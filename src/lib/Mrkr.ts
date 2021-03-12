type OffsetProps ={
  startOffset?: number;
  endOffset?: number;
}

type DataProps = OffsetProps & {
  text: string;
  nodes: Text[];
}

// Type guard for Text nodes
function isTextNode(node: Node): node is Text {
  return (node as Text).nodeType === 3;
}

// Type guard for offset
function isValidOffset(offset?: OffsetProps): offset is { startOffset: number; endOffset: number } {
  return !!(offset && typeof offset.startOffset === 'number' && typeof offset.endOffset === 'number');
}

interface Props {
  element?: HTMLElement;
  className?: string;
  selectionEnabled?: boolean;
  onSelection?: (e: PointerEvent, data: DataProps[]) => void;
}

interface Range {
  startContainer: ChildNode;
  endContainer: ChildNode;
  startOffset: number;
  endOffset: number;
}

export default class Mrkr {
  element: HTMLElement;
  highlightClass: string;
  onSelection: (e: PointerEvent, data: DataProps[]) => void;
  
  private selectionEnabled: boolean;

  constructor(props: Props = {}) {
    const { element = document.body, className = 'highlight', selectionEnabled = false, onSelection = () => {} } = props;

    this.element = element;
    this.highlightClass = className;
    this.selectionEnabled = selectionEnabled;
    this.onSelection = onSelection;
    
    this.handlePointerUp = this.handlePointerUp.bind(this);

    this.setElement(element);
  }

  /**
   * Callback run on pointerup
   *
   * @private
   * @param {PointerEvent} event
   * @memberof Mrkr
   */
  private handlePointerUp(event: PointerEvent) {
    if (this.selectionEnabled) {
      const results = this.highlight();

      this.onSelection(event, results);
    }
  }

  /**
   * Gets all nodes that have the current className
   *
   * @private
   * @returns {HTMLElement[]}
   * @memberof Mrkr
   */
  private getHighlightedNodes(className?: string): HTMLElement[] {
    if (!this.element) return [];

    return Array.from(this.element.querySelectorAll(`.${className || this.highlightClass}`));
  }

  /**
   * Creates a set of highlighted and non-highlighted nodes to replace the passed text content
   *
   * @private
   * @param {(string | null)} [text='']
   * @param {number} startOffset
   * @param {number} endOffset
   * @returns {ChildNode[]}
   * @memberof Mrkr
   */
  private highlightNode (text: string | null = '', startOffset: number, endOffset: number): ChildNode[] {
    if (!text) return [];

    const highlightedText = text.substring(startOffset, endOffset);
  
    if (highlightedText.length > 0) {
      const highlightedSpanNode = document.createElement('SPAN');
      highlightedSpanNode.classList.add(this.highlightClass);
    
      const startTextNode = document.createTextNode(text.substring(0, startOffset));
      const highlightedTextNode = document.createTextNode(highlightedText);
      const endTextNode = document.createTextNode(text.substring(endOffset));
    
      highlightedSpanNode.appendChild(highlightedTextNode);
    
      const newNodes = [];
      if (startTextNode.textContent) newNodes.push(startTextNode);
      newNodes.push(highlightedSpanNode);
      if (endTextNode.textContent) newNodes.push(endTextNode);
    
      return newNodes;
    }
    
    return [document.createTextNode(text)];
  }

  /**
   * Converts relative range offset data to absolute offsets
   *
   * @private
   * @memberof Mrkr
   */
  private getAbsoluteOffsets = (startContainer: Text, startOffset: number, endContainer: Text, endOffset: number): OffsetProps => {
    const textNodes = textNodesUnder(this.element);
    let currentIndex = 0;
    let absoluteStartOffset = undefined;
    let absoluteEndOffset  = undefined;

    textNodes.some((textNode) => {
      if (!textNode?.textContent) return false;
      
      if (textNode === startContainer) {
        absoluteStartOffset = currentIndex + startOffset;
      }

      if (textNode === endContainer) {
        absoluteEndOffset = currentIndex + endOffset;
        return true;
      }

      currentIndex = currentIndex + textNode.textContent.length;
      return false;
    });

    if (absoluteStartOffset && absoluteEndOffset) {
      return { startOffset: absoluteStartOffset, endOffset: absoluteEndOffset };
    }

    return {};
  }

  /**
   * Searches the container element for any highlighted nodes
   * according to the current className
   * 
   * @param {string} [className] - optional classname, otherwise will check for this.highlightClass
   * @returns {DataProps[]}
   * @memberof Mrkr
   */
  getData(className?: string): DataProps[] {
    if (!this.element) return [];

    const textNodes = textNodesUnder(this.element);
    const highlightedTextNodes = this.getHighlightedNodes(className).reduce((arr: Text[], current) => [...arr,  ...textNodesUnder(current)], []);

    let currentIndex = 0;

    let startFound = false;

    const data: DataProps[] = [];
    
    textNodes.some((textNode, i) => {
      if (!textNode.textContent) return false;

      const highlightedTextNode = highlightedTextNodes.find((node) => node === textNode);

      if (highlightedTextNode) {
        if (!startFound) {
          data.push({
            startOffset: currentIndex,
            text: textNode.textContent,
            nodes: [highlightedTextNode],
          });

          startFound = true;

        } else {
          data[data.length - 1].text += textNode.textContent;
          data[data.length - 1].nodes.push(highlightedTextNode);
        }

        // If this node is also the last node
        if (i === textNodes.length - 1) {
          data[data.length - 1].endOffset = currentIndex + textNode.textContent.length;
        }
      } else if (startFound) {
        data[data.length - 1].endOffset = currentIndex;
        startFound = false;
      }

      currentIndex += textNode.textContent.length;
    });

    return data;
  }

  /**
   * Adds the event listener for pointerup
   *
   * @memberof Mrkr
   */
  register() {
    this.element.addEventListener('pointerup', this.handlePointerUp);
  }

  /**
   * Removes the event listener for pointerup
   *
   * @memberof Mrkr
   */
  unregister() {
    this.element.removeEventListener('pointerup', this.handlePointerUp);
  }
  
  /**
   * Sets the current container element
   *
   * @param {HTMLElement} element
   * @memberof Mrkr
   */
  setElement(element: HTMLElement) {
    this.unregister();
    this.element = element;
    this.register();
  }

  /**
   * Clears all or part of the highlighted text blocks
   *
   * @param {OffsetProps[]} [offsetTargets] - optional array of offsets to target and remove
   * @returns {void}
   * @memberof Mrkr
   */
  clear(offsetTargets?: OffsetProps[]): void {
    if (!this.element) return;

    // Guard against bad offset inputs
    const offsets = offsetTargets?.filter((o) => isValidOffset(o));

    const highlightedNodes = this.getHighlightedNodes();
    const textNodes = textNodesUnder(this.element);

    // If offsets array not included, clear all
    if (!offsets) {
      highlightedNodes.forEach((highlightedNode) => {
        highlightedNode.replaceWith(...Array.from(highlightedNode.childNodes));
      });
    } else {
      // Clear all highlighted text that falls between the offsets in the passed offsets array
      let currentIndex = 0;

      // Clear any text nodes that fall inside any of the offset ranges passed
      textNodes.some((textNode) => {
        if (offsets.find((offset) => isValidOffset(offset) && (currentIndex >= offset.startOffset && currentIndex <= offset.endOffset))) {
          const highlightedNode = highlightedNodes.find((node) => !!Array.from(node.childNodes).find((n => n === textNode)));
          if (highlightedNode) {
            highlightedNode.replaceWith(...Array.from(highlightedNode.childNodes));
          }
        }

        // Can stop searching
        const ends = offsets.map((offset) => offset.endOffset).filter(n => typeof n === 'number') as number[];
        if (currentIndex > Math.max(...ends)) {
          return true;
        }

        currentIndex += textNode.textContent?.length || 0;
        return false;
      });
    }
  }

  highlight(): DataProps[] {
    const selection = window.getSelection();
    let results: DataProps[] = [];

    // If there's no selection object
    if (!selection) return results;

    // Container element must be defined
    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'));
      return results;
    } 
    
    const range = selection.getRangeAt(0);
    
    const { startContainer, endContainer } = range as unknown as Range;
    
    // Ensure that results are Text nodes
    if (isTextNode(startContainer) && isTextNode(endContainer)) {
      const startTextNode = startContainer;
      const endTextNode = endContainer;

      // If no content's actually been selected
      if (startTextNode === endTextNode && range.endOffset === range.startOffset) return results;

      // Convert to absolute offsets in the element
      const offsets = this.getAbsoluteOffsets(startContainer, range.startOffset, endContainer, range.endOffset);

      if (isValidOffset(offsets)) {
        this.highlightRange(offsets.startOffset, offsets.endOffset);
      }

      selection.removeAllRanges();

      return this.getData();
    }

    return results;
  }

  /**
   * Highlights a range of text determined by start and end offsets
   *
   * @param {number} startOffset - absolute offset in the element container
   * @param {number} endOffset - absolute offset in the element container
   * @returns {DataProps[]}
   * @memberof Mrkr
   */
  highlightRange(startOffset: number, endOffset: number): DataProps[] {
    let results: DataProps[] = [];

    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'))
      return results;
    };

    const textNodes = textNodesUnder(this.element);
    
    let currentIndex = 0;
    let startFound = false;

    textNodes.some((textNode) => {
      if (!textNode.textContent) return false;

      const newCurrentIndex = currentIndex + textNode.textContent.length;
      if (startOffset >= currentIndex && startOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, startOffset - currentIndex, endOffset - currentIndex);
        textNode.replaceWith(...newNodes);
  
        // Start collecting text nodes in between
        startFound = true;
      }
      
      if (endOffset >= currentIndex && endOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, 0, endOffset - currentIndex);
        textNode.replaceWith(...newNodes);
        
        // End the loop
        return true;
      } else if (startFound) {
        const newNodes = this.highlightNode(textNode.textContent, 0, textNode.textContent.length);
        textNode.replaceWith(...newNodes);
      }

      currentIndex = newCurrentIndex;
      return false;
    });

    return this.getData();
  }

  getSelectionEnabled() {
    return this.selectionEnabled;
  }

  toggleSelection(isEnabled: boolean) {
    this.selectionEnabled = isEnabled;
  }

  enableSelection() {
    this.selectionEnabled = true;
  }

  disableSelection() {
    this.selectionEnabled = false;
  }
}

/**
 * Gets an array of text nodes under the passed node
 *
 * @param {HTMLElement} node
 * @returns {[HTMLElement]} - array of text nodes
 */
 const textNodesUnder = (node: HTMLElement): Text[] => {
  let all: Text[] = [];

  // @ts-ignore
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (isTextNode(node)) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
};
