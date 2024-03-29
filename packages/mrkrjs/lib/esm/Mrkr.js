// Type guard for Text nodes
function isTextNode(node) {
  return node.nodeType === 3;
} // Type guard for offset


function isValidOffset(offset) {
  return !!(offset && typeof offset.startOffset === 'number' && typeof offset.endOffset === 'number');
}
/**
 * Gets an array of text nodes under the passed node
 *
 * @param {HTMLElement} node
 * @returns {[HTMLElement]} - array of text nodes
 */


const textNodesUnder = node => {
  let all = []; // eslint-disable-next-line no-param-reassign

  for (node = node.firstChild; node; node = node.nextSibling) {
    if (isTextNode(node)) all.push(node);else all = all.concat(textNodesUnder(node));
  }

  return all;
};

export default class Mrkr {
  constructor(element, className, props = {}) {
    const {
      onSelection,
      maximum = undefined,
      minimum = undefined,
      overlap = true,
      selectionEnabled = true
    } = props; // Make sure element exists

    if (!element) throw new Error('Element is required.'); // Make sure className

    if (!className) throw new Error('Class name is required.');
    this.element = element;
    this.highlightClass = className;
    this.selectionEnabled = selectionEnabled;
    this.maximum = maximum;
    this.minimum = minimum;
    this.overlap = overlap;
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


  handlePointerUp(event) {
    if (this.selectionEnabled) {
      const results = this.highlight();
      if (this.onSelection) this.onSelection(event, results);
    }
  }
  /**
   * Gets all nodes that have the current className
   *
   * @private
   * @returns {HTMLElement[]}
   * @memberof Mrkr
   */


  getHighlightedNodes(className) {
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


  highlightNode(text = '', startOffset, endOffset) {
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


  getAbsoluteOffsets = (startContainer, startOffset, endContainer, endOffset) => {
    const textNodes = textNodesUnder(this.element);
    let currentIndex = 0;
    let absoluteStartOffset;
    let absoluteEndOffset;
    textNodes.some(textNode => {
      if (!textNode?.textContent) return false;

      if (textNode === startContainer) {
        absoluteStartOffset = currentIndex + startOffset;
      }

      if (textNode === endContainer) {
        absoluteEndOffset = currentIndex + endOffset;
        return true;
      }

      currentIndex += textNode.textContent.length;
      return false;
    });

    if (absoluteStartOffset !== undefined && absoluteEndOffset) {
      return {
        startOffset: absoluteStartOffset,
        endOffset: absoluteEndOffset
      };
    }

    return {};
  };
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
   * Sets the current classname
   *
   * @param {string} className
   * @memberof Mrkr
   */


  setClassName(className) {
    this.highlightClass = className;
  }
  /**
   * Searches the container element for any highlighted nodes
   * according to the current className
   *
   * @param {string} [className] - optional classname, otherwise will check for this.highlightClass
   * @returns {DataProps[]}
   * @memberof Mrkr
   */


  getData(className) {
    if (!this.element) return [];
    const textNodes = textNodesUnder(this.element);
    const highlightedTextNodes = this.getHighlightedNodes(className).reduce((arr, current) => [...arr, ...textNodesUnder(current)], []);
    let currentIndex = 0;
    let startFound = false;
    const data = [];
    textNodes.some((textNode, i) => {
      if (!textNode.textContent) return false;
      const highlightedTextNode = highlightedTextNodes.find(node => node === textNode);

      if (highlightedTextNode) {
        if (!startFound) {
          data.push({
            startOffset: currentIndex,
            text: textNode.textContent,
            nodes: [highlightedTextNode]
          });
          startFound = true;
        } else {
          data[data.length - 1].text += textNode.textContent;
          data[data.length - 1].nodes.push(highlightedTextNode);
        } // If this node is also the last node


        if (i === textNodes.length - 1) {
          data[data.length - 1].endOffset = currentIndex + textNode.textContent.length;
        }
      } else if (startFound) {
        data[data.length - 1].endOffset = currentIndex;
        startFound = false;
      }

      currentIndex += textNode.textContent.length;
      return false;
    });
    return data;
  }
  /**
   * Sets the current container element
   *
   * @param {HTMLElement} element
   * @memberof Mrkr
   */


  setElement(element) {
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


  clear(offsetTargets) {
    if (!this.element) return; // Guard against bad offset inputs

    const offsets = offsetTargets?.filter(o => isValidOffset(o));
    const highlightedNodes = this.getHighlightedNodes();
    const textNodes = textNodesUnder(this.element); // If offsets array not included, clear all

    if (!offsets) {
      highlightedNodes.forEach(highlightedNode => {
        highlightedNode.replaceWith(...Array.from(highlightedNode.childNodes));
      });
    } else {
      // Clear all highlighted text that falls between the offsets in the passed offsets array
      let currentIndex = 0; // Clear any text nodes that fall inside any of the offset ranges passed

      textNodes.some(textNode => {
        if (offsets.find(offset => isValidOffset(offset) && currentIndex >= offset.startOffset && currentIndex <= offset.endOffset)) {
          const highlightedNode = highlightedNodes.find(node => !!Array.from(node.childNodes).find(n => n === textNode));

          if (highlightedNode) {
            highlightedNode.replaceWith(...Array.from(highlightedNode.childNodes));
          }
        } // Can stop searching


        const ends = offsets.map(offset => offset.endOffset).filter(n => typeof n === 'number');

        if (currentIndex > Math.max(...ends)) {
          return true;
        }

        currentIndex += textNode.textContent?.length || 0;
        return false;
      });
    }
  }

  highlight() {
    const selection = window.getSelection();
    const results = []; // If there's no selection object

    if (!selection) return results; // Container element must be defined

    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'));
      return results;
    }

    const range = selection.getRangeAt(0);
    const {
      startContainer,
      endContainer
    } = range; // Ensure that results are Text nodes

    if (isTextNode(startContainer) && isTextNode(endContainer)) {
      const startTextNode = startContainer;
      const endTextNode = endContainer; // If no content's actually been selected

      if (startTextNode === endTextNode && range.endOffset === range.startOffset) return results; // Convert to absolute offsets in the element

      const offsets = this.getAbsoluteOffsets(startContainer, range.startOffset, endContainer, range.endOffset); // Remove native selection

      selection.removeAllRanges();

      if (offsets.startOffset && offsets.endOffset) {
        const length = offsets.endOffset - offsets.startOffset; // Check for minimum / maximum

        const {
          startOffset,
          endOffset
        } = offsets;

        if (this.minimum && !(length >= this.minimum) || this.maximum && !(length <= this.maximum)) {
          return results;
        } // Check for overlap


        if (!this.overlap) {
          const highlights = this.getData();

          if (highlights.some(highlight => highlight.startOffset && highlight.endOffset && (startOffset > highlight.startOffset && startOffset < highlight.endOffset || endOffset > highlight.startOffset && endOffset < highlight.endOffset))) {
            return results;
          }
        }
      }

      if (isValidOffset(offsets)) {
        this.highlightRange(offsets.startOffset, offsets.endOffset);
      }

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


  highlightRange(startOffset, endOffset) {
    const results = [];

    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'));
      return results;
    }

    const textNodes = textNodesUnder(this.element);
    let currentIndex = 0;
    let startFound = false;
    textNodes.some(textNode => {
      if (!textNode.textContent) return false;
      const newCurrentIndex = currentIndex + textNode.textContent.length;

      if (startOffset >= currentIndex && startOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, startOffset - currentIndex, endOffset - currentIndex);
        textNode.replaceWith(...newNodes); // Start collecting text nodes in between

        startFound = true;
      }

      if (endOffset >= currentIndex && endOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, 0, endOffset - currentIndex);
        textNode.replaceWith(...newNodes); // End the loop

        return true;
      }

      if (startFound) {
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

  toggleSelection(isEnabled) {
    this.selectionEnabled = typeof isEnabled === 'undefined' ? !this.selectionEnabled : isEnabled;
  }

  enableSelection() {
    this.selectionEnabled = true;
  }

  disableSelection() {
    this.selectionEnabled = false;
  }

}
//# sourceMappingURL=Mrkr.js.map