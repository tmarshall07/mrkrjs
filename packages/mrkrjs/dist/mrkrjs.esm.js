import { __spreadArray } from 'tslib';

// Type guard for Text nodes
function isTextNode(node) {
    return node.nodeType === 3;
}
// Type guard for offset
function isValidOffset(offset) {
    return !!(offset && typeof offset.startOffset === 'number' && typeof offset.endOffset === 'number');
}
/**
 * Gets an array of text nodes under the passed node
 *
 * @param {HTMLElement} node
 * @returns {[HTMLElement]} - array of text nodes
 */
var textNodesUnder = function (node) {
    var all = [];
    // eslint-disable-next-line no-param-reassign
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (isTextNode(node))
            all.push(node);
        else
            all = all.concat(textNodesUnder(node));
    }
    return all;
};
var Mrkr = /** @class */ (function () {
    function Mrkr(props) {
        if (props === void 0) { props = {}; }
        var _this = this;
        /**
         * Converts relative range offset data to absolute offsets
         *
         * @private
         * @memberof Mrkr
         */
        this.getAbsoluteOffsets = function (startContainer, startOffset, endContainer, endOffset) {
            var textNodes = textNodesUnder(_this.element);
            var currentIndex = 0;
            var absoluteStartOffset;
            var absoluteEndOffset;
            textNodes.some(function (textNode) {
                if (!(textNode === null || textNode === void 0 ? void 0 : textNode.textContent))
                    return false;
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
            if (absoluteStartOffset && absoluteEndOffset) {
                return { startOffset: absoluteStartOffset, endOffset: absoluteEndOffset };
            }
            return {};
        };
        var _a = props.element, element = _a === void 0 ? document.body : _a, _b = props.className, className = _b === void 0 ? 'highlight' : _b, onSelection = props.onSelection, _c = props.maximum, maximum = _c === void 0 ? undefined : _c, _d = props.minimum, minimum = _d === void 0 ? undefined : _d, _e = props.overlap, overlap = _e === void 0 ? true : _e;
        this.element = element;
        this.highlightClass = className;
        this.selectionEnabled = false;
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
    Mrkr.prototype.handlePointerUp = function (event) {
        if (this.selectionEnabled) {
            var results = this.highlight();
            if (this.onSelection)
                this.onSelection(event, results);
        }
    };
    /**
     * Gets all nodes that have the current className
     *
     * @private
     * @returns {HTMLElement[]}
     * @memberof Mrkr
     */
    Mrkr.prototype.getHighlightedNodes = function (className) {
        if (!this.element)
            return [];
        return Array.from(this.element.querySelectorAll(".".concat(className || this.highlightClass)));
    };
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
    Mrkr.prototype.highlightNode = function (text, startOffset, endOffset) {
        if (text === void 0) { text = ''; }
        if (!text)
            return [];
        var highlightedText = text.substring(startOffset, endOffset);
        if (highlightedText.length > 0) {
            var highlightedSpanNode = document.createElement('SPAN');
            highlightedSpanNode.classList.add(this.highlightClass);
            var startTextNode = document.createTextNode(text.substring(0, startOffset));
            var highlightedTextNode = document.createTextNode(highlightedText);
            var endTextNode = document.createTextNode(text.substring(endOffset));
            highlightedSpanNode.appendChild(highlightedTextNode);
            var newNodes = [];
            if (startTextNode.textContent)
                newNodes.push(startTextNode);
            newNodes.push(highlightedSpanNode);
            if (endTextNode.textContent)
                newNodes.push(endTextNode);
            return newNodes;
        }
        return [document.createTextNode(text)];
    };
    /**
     * Adds the event listener for pointerup
     *
     * @memberof Mrkr
     */
    Mrkr.prototype.register = function () {
        this.element.addEventListener('pointerup', this.handlePointerUp);
    };
    /**
     * Removes the event listener for pointerup
     *
     * @memberof Mrkr
     */
    Mrkr.prototype.unregister = function () {
        this.element.removeEventListener('pointerup', this.handlePointerUp);
    };
    /**
     * Sets the current classname
     *
     * @param {string} className
     * @memberof Mrkr
     */
    Mrkr.prototype.setClassName = function (className) {
        this.highlightClass = className;
    };
    /**
     * Searches the container element for any highlighted nodes
     * according to the current className
     *
     * @param {string} [className] - optional classname, otherwise will check for this.highlightClass
     * @returns {DataProps[]}
     * @memberof Mrkr
     */
    Mrkr.prototype.getData = function (className) {
        if (!this.element)
            return [];
        var textNodes = textNodesUnder(this.element);
        var highlightedTextNodes = this.getHighlightedNodes(className).reduce(function (arr, current) { return __spreadArray(__spreadArray([], arr, true), textNodesUnder(current), true); }, []);
        var currentIndex = 0;
        var startFound = false;
        var data = [];
        textNodes.some(function (textNode, i) {
            if (!textNode.textContent)
                return false;
            var highlightedTextNode = highlightedTextNodes.find(function (node) { return node === textNode; });
            if (highlightedTextNode) {
                if (!startFound) {
                    data.push({
                        startOffset: currentIndex,
                        text: textNode.textContent,
                        nodes: [highlightedTextNode],
                    });
                    startFound = true;
                }
                else {
                    data[data.length - 1].text += textNode.textContent;
                    data[data.length - 1].nodes.push(highlightedTextNode);
                }
                // If this node is also the last node
                if (i === textNodes.length - 1) {
                    data[data.length - 1].endOffset = currentIndex + textNode.textContent.length;
                }
            }
            else if (startFound) {
                data[data.length - 1].endOffset = currentIndex;
                startFound = false;
            }
            currentIndex += textNode.textContent.length;
            return false;
        });
        return data;
    };
    /**
     * Sets the current container element
     *
     * @param {HTMLElement} element
     * @memberof Mrkr
     */
    Mrkr.prototype.setElement = function (element) {
        this.unregister();
        this.element = element;
        this.register();
    };
    /**
     * Clears all or part of the highlighted text blocks
     *
     * @param {OffsetProps[]} [offsetTargets] - optional array of offsets to target and remove
     * @returns {void}
     * @memberof Mrkr
     */
    Mrkr.prototype.clear = function (offsetTargets) {
        if (!this.element)
            return;
        // Guard against bad offset inputs
        var offsets = offsetTargets === null || offsetTargets === void 0 ? void 0 : offsetTargets.filter(function (o) { return isValidOffset(o); });
        var highlightedNodes = this.getHighlightedNodes();
        var textNodes = textNodesUnder(this.element);
        // If offsets array not included, clear all
        if (!offsets) {
            highlightedNodes.forEach(function (highlightedNode) {
                highlightedNode.replaceWith.apply(highlightedNode, Array.from(highlightedNode.childNodes));
            });
        }
        else {
            // Clear all highlighted text that falls between the offsets in the passed offsets array
            var currentIndex_1 = 0;
            // Clear any text nodes that fall inside any of the offset ranges passed
            textNodes.some(function (textNode) {
                var _a;
                if (offsets.find(function (offset) { return isValidOffset(offset) && currentIndex_1 >= offset.startOffset && currentIndex_1 <= offset.endOffset; })) {
                    var highlightedNode = highlightedNodes.find(function (node) { return !!Array.from(node.childNodes).find(function (n) { return n === textNode; }); });
                    if (highlightedNode) {
                        highlightedNode.replaceWith.apply(highlightedNode, Array.from(highlightedNode.childNodes));
                    }
                }
                // Can stop searching
                var ends = offsets.map(function (offset) { return offset.endOffset; }).filter(function (n) { return typeof n === 'number'; });
                if (currentIndex_1 > Math.max.apply(Math, ends)) {
                    return true;
                }
                currentIndex_1 += ((_a = textNode.textContent) === null || _a === void 0 ? void 0 : _a.length) || 0;
                return false;
            });
        }
    };
    Mrkr.prototype.highlight = function () {
        var selection = window.getSelection();
        var results = [];
        // If there's no selection object
        if (!selection)
            return results;
        // Container element must be defined
        if (!this.element) {
            console.error(new Error('Container element not defined for highlighter.'));
            return results;
        }
        var range = selection.getRangeAt(0);
        var _a = range, startContainer = _a.startContainer, endContainer = _a.endContainer;
        // Ensure that results are Text nodes
        if (isTextNode(startContainer) && isTextNode(endContainer)) {
            var startTextNode = startContainer;
            var endTextNode = endContainer;
            // If no content's actually been selected
            if (startTextNode === endTextNode && range.endOffset === range.startOffset)
                return results;
            // Convert to absolute offsets in the element
            var offsets = this.getAbsoluteOffsets(startContainer, range.startOffset, endContainer, range.endOffset);
            // Remove native selection
            selection.removeAllRanges();
            if (offsets.startOffset && offsets.endOffset) {
                var length_1 = offsets.endOffset - offsets.startOffset;
                // Check for minimum / maximum
                var startOffset_1 = offsets.startOffset, endOffset_1 = offsets.endOffset;
                if ((this.minimum && !(length_1 >= this.minimum)) || (this.maximum && !(length_1 <= this.maximum))) {
                    return results;
                }
                // Check for overlap
                if (!this.overlap) {
                    var highlights = this.getData();
                    if (highlights.some(function (highlight) {
                        return highlight.startOffset &&
                            highlight.endOffset &&
                            ((startOffset_1 > highlight.startOffset && startOffset_1 < highlight.endOffset) ||
                                (endOffset_1 > highlight.startOffset && endOffset_1 < highlight.endOffset));
                    })) {
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
    };
    /**
     * Highlights a range of text determined by start and end offsets
     *
     * @param {number} startOffset - absolute offset in the element container
     * @param {number} endOffset - absolute offset in the element container
     * @returns {DataProps[]}
     * @memberof Mrkr
     */
    Mrkr.prototype.highlightRange = function (startOffset, endOffset) {
        var _this = this;
        var results = [];
        if (!this.element) {
            console.error(new Error('Container element not defined for highlighter.'));
            return results;
        }
        var textNodes = textNodesUnder(this.element);
        var currentIndex = 0;
        var startFound = false;
        textNodes.some(function (textNode) {
            if (!textNode.textContent)
                return false;
            var newCurrentIndex = currentIndex + textNode.textContent.length;
            if (startOffset >= currentIndex && startOffset < newCurrentIndex) {
                var newNodes = _this.highlightNode(textNode.textContent, startOffset - currentIndex, endOffset - currentIndex);
                textNode.replaceWith.apply(textNode, newNodes);
                // Start collecting text nodes in between
                startFound = true;
            }
            if (endOffset >= currentIndex && endOffset < newCurrentIndex) {
                var newNodes = _this.highlightNode(textNode.textContent, 0, endOffset - currentIndex);
                textNode.replaceWith.apply(textNode, newNodes);
                // End the loop
                return true;
            }
            if (startFound) {
                var newNodes = _this.highlightNode(textNode.textContent, 0, textNode.textContent.length);
                textNode.replaceWith.apply(textNode, newNodes);
            }
            currentIndex = newCurrentIndex;
            return false;
        });
        return this.getData();
    };
    Mrkr.prototype.getSelectionEnabled = function () {
        return this.selectionEnabled;
    };
    Mrkr.prototype.toggleSelection = function (isEnabled) {
        this.selectionEnabled = typeof isEnabled === 'undefined' ? !this.selectionEnabled : isEnabled;
    };
    Mrkr.prototype.enableSelection = function () {
        this.selectionEnabled = true;
    };
    Mrkr.prototype.disableSelection = function () {
        this.selectionEnabled = false;
    };
    return Mrkr;
}());

export { Mrkr as default };
//# sourceMappingURL=mrkrjs.esm.js.map
