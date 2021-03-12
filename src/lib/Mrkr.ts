type OffsetProps ={
  startOffset?: number;
  endOffset?: number;
}

type DataProps = OffsetProps & {
  text: string;
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

  private handlePointerUp(event: PointerEvent) {
    if (this.selectionEnabled) {
      const results = this.highlight();

      this.onSelection(event, results);
    }
  }

  private getHighlightedNodes(): HTMLElement[] {
    if (!this.element) return [];

    return Array.from(this.element.querySelectorAll(`.${this.highlightClass}`));
  }

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

  getData(): DataProps[] {
    if (!this.element) return [];

    const textNodes = textNodesUnder(this.element);
    const highlightedTextNodes = this.getHighlightedNodes().reduce((arr: Text[], current) => [...arr,  ...textNodesUnder(current)], []);

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
          });

          startFound = true;

        } else {
          data[data.length - 1].text += textNode.textContent;
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

  register() {
    this.element.addEventListener('pointerup', this.handlePointerUp);
  }

  unregister() {
    this.element.removeEventListener('pointerup', this.handlePointerUp);
  }
  
  setElement(element: HTMLElement) {
    this.unregister();
    this.element = element;
    this.register();
  }

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

  highlightRange(startOffset: number, endOffset: number): DataProps[] {
    let results: DataProps[] = [];

    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'))
      return results;
    };

    const textNodes = textNodesUnder(this.element);
    
    let currentIndex = 0;
    let startFound = false;
    let text = '';

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
