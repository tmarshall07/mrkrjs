// Type guard for Text nodes
function isTextNode(node: Node): node is Text {
  return (node as Text).nodeType === 3;
}

type OffsetProps = {
  startOffset?: number;
  endOffset?: number;
}

interface Props {
  element?: HTMLElement;
  className?: string;
  selectionEnabled?: boolean;
  onHighlightSelection?: (e: PointerEvent, offsets: OffsetProps) => void;
}

interface Range {
  startContainer: ChildNode;
  endContainer: ChildNode;
  startOffset: number;
  endOffset: number;
}

export default class Highlighter {
  element: HTMLElement;
  highlightClass: string;
  selectionEnabled: boolean;
  onHighlightSelection: (e: PointerEvent, offsets: OffsetProps) => void;

  constructor(props: Props = {}) {
    const { element = document.body, className = 'highlight', selectionEnabled = false, onHighlightSelection = () => {} } = props;

    this.element = element;
    this.highlightClass = className;
    this.selectionEnabled = selectionEnabled;
    this.onHighlightSelection = onHighlightSelection;
    
    this.handlePointerUp = this.handlePointerUp.bind(this);

    this.setContainerElement(element);
  }

  register() {
    this.element.addEventListener('pointerup', this.handlePointerUp);
  }

  unregister() {
    this.element.removeEventListener('pointerup', this.handlePointerUp);
  }
  
  setContainerElement(element: HTMLElement) {
    this.unregister();
    this.element = element;
    this.register();
  }

  handlePointerUp(event: PointerEvent) {
    if (this.selectionEnabled) {
      const offsets = this.highlightSelection();

      this.onHighlightSelection(event, offsets);
    }
  }

  getHighlightedNodes(): HTMLElement[] {
    if (!this.element) return [];

    return Array.from(this.element.querySelectorAll(`.${this.highlightClass}`));
  }

  /**
   * Clears the highlights from the container element
   *
   * @memberof Highlighter
   */
  clear(): void {
    if (!this.element) return;

    const highlightedNodes = this.getHighlightedNodes();
    highlightedNodes.forEach((highlightedNode) => {
      highlightedNode.replaceWith(...Array.from(highlightedNode.childNodes));
    });
  }

  highlightSelection(): { startOffset?: number; endOffset?: number } {
    const selection = window.getSelection();
    let results = {};

    // If there's no selection object
    if (!selection) return results;

    // Container element must be defined
    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'));
      return results;
    } 
    
    const range = selection.getRangeAt(0);
    
    const { startContainer, endContainer, startOffset, endOffset } = range as unknown as Range;

    // Ensure that results are Text nodes
    if (isTextNode(startContainer) && isTextNode(endContainer)) {
      const startTextNode = startContainer;
      const endTextNode = endContainer;

      // If no content's actually been selected
      if (startTextNode === endTextNode && endOffset === startOffset) return results;
  
      if (startTextNode === endTextNode) {
        // If the selection occurs inside the same text node
        const newNodes = this.highlightNode(startTextNode.textContent, startOffset, endOffset) as ChildNode[];
        startTextNode.replaceWith(...newNodes);
      } else {
        const textNodes = textNodesUnder(this.element);
  
        let startFound = false;
        textNodes.some((textNode) => {
          if (!textNode.textContent) return false;
  
          // Handle highlighting the starting text node
          if (textNode === startTextNode) {
            const newStartNodes = this.highlightNode(textNode.textContent, startOffset, textNode.textContent.length);
            textNode.replaceWith(...newStartNodes);
  
            // Start collecting text nodes in between
            startFound = true;
            
            return false;
          } else if (textNode === endTextNode) {
            // Handle highlighting the end text node
            const newEndNodes = this.highlightNode(textNode.textContent, 0, endOffset);
            textNode.replaceWith(...newEndNodes);
  
            return true; // Stop the loop
          } else if (startFound) {
            // Handle highlighting nodes in between start and end
            const newEndNodes = this.highlightNode(textNode.textContent, 0, textNode.textContent.length);
            textNode.replaceWith(...newEndNodes);
          }
          
          return false;
        });
      }
      selection.removeAllRanges();
  
      return this.getOffsets();
    }

    return results;
  }

  highlightRange(startOffset: number, endOffset: number): void {
    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'))
    };

    const textNodes = textNodesUnder(this.element);
    
    let currentIndex = 0;
    let startFound = false;

    textNodes.some((textNode) => {
      if (!textNode.textContent) return false;

      const newCurrentIndex = currentIndex + (textNode.textContent.length || 0);
      if (startOffset >= currentIndex && startOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, startOffset - currentIndex, textNode.textContent.length);
        textNode.replaceWith(...newNodes);
        startFound = true;
      } else if (endOffset >= currentIndex && endOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, 0, endOffset - currentIndex);
        textNode.replaceWith(...newNodes);
        return true;
      } else if (startFound) {
        const newNodes = this.highlightNode(textNode.textContent, 0, textNode.textContent.length);
        textNode.replaceWith(...newNodes);
      }

      currentIndex = newCurrentIndex;
      return false;
    });
  }

  getOffsets() {
    if (!this.element) return {};

    const textNodes = textNodesUnder(this.element);
    const highlightedNodes = this.getHighlightedNodes().reduce((arr: Text[], current) => [...arr,  ...textNodesUnder(current)], []);

    let startOffset = 0;
    let endOffset = 0;

    let currentIndex = 0;
    textNodes.some((textNode) => {
      if (!textNode.textContent) return false;

      if (highlightedNodes.find((node) => node === textNode)) {
        if (!startOffset) {
          startOffset = currentIndex;
        }
        
        endOffset = currentIndex + textNode.textContent.length;
      }

      currentIndex += textNode.textContent.length;
    });

    return { startOffset, endOffset };
  }

  highlightNode (text: string | null = '', startOffset: number, endOffset: number): ChildNode[] {
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
