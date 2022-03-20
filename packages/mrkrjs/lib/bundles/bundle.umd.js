(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mrkrjs = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

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


  var textNodesUnder = function textNodesUnder(node) {
    var all = []; // eslint-disable-next-line no-param-reassign

    for (node = node.firstChild; node; node = node.nextSibling) {
      if (isTextNode(node)) all.push(node);else all = all.concat(textNodesUnder(node));
    }

    return all;
  };

  var Mrkr = /*#__PURE__*/function () {
    function Mrkr(element) {
      var _this = this;

      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Mrkr);

      _defineProperty(this, "getAbsoluteOffsets", function (startContainer, startOffset, endContainer, endOffset) {
        var textNodes = textNodesUnder(_this.element);
        var currentIndex = 0;
        var absoluteStartOffset;
        var absoluteEndOffset;
        textNodes.some(function (textNode) {
          if (!(textNode !== null && textNode !== void 0 && textNode.textContent)) return false;

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
          return {
            startOffset: absoluteStartOffset,
            endOffset: absoluteEndOffset
          };
        }

        return {};
      });

      var _props$className = props.className,
          className = _props$className === void 0 ? 'highlight' : _props$className,
          onSelection = props.onSelection,
          _props$maximum = props.maximum,
          maximum = _props$maximum === void 0 ? undefined : _props$maximum,
          _props$minimum = props.minimum,
          minimum = _props$minimum === void 0 ? undefined : _props$minimum,
          _props$overlap = props.overlap,
          overlap = _props$overlap === void 0 ? true : _props$overlap,
          _props$selectionEnabl = props.selectionEnabled,
          selectionEnabled = _props$selectionEnabl === void 0 ? true : _props$selectionEnabl; // Make sure element exists

      if (!element) throw new Error('Container element is required.');
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


    _createClass(Mrkr, [{
      key: "handlePointerUp",
      value: function handlePointerUp(event) {
        if (this.selectionEnabled) {
          var results = this.highlight();
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

    }, {
      key: "getHighlightedNodes",
      value: function getHighlightedNodes(className) {
        if (!this.element) return [];
        return Array.from(this.element.querySelectorAll(".".concat(className || this.highlightClass)));
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

    }, {
      key: "highlightNode",
      value: function highlightNode() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var startOffset = arguments.length > 1 ? arguments[1] : undefined;
        var endOffset = arguments.length > 2 ? arguments[2] : undefined;
        if (!text) return [];
        var highlightedText = text.substring(startOffset, endOffset);

        if (highlightedText.length > 0) {
          var highlightedSpanNode = document.createElement('SPAN');
          highlightedSpanNode.classList.add(this.highlightClass);
          var startTextNode = document.createTextNode(text.substring(0, startOffset));
          var highlightedTextNode = document.createTextNode(highlightedText);
          var endTextNode = document.createTextNode(text.substring(endOffset));
          highlightedSpanNode.appendChild(highlightedTextNode);
          var newNodes = [];
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

    }, {
      key: "register",
      value:
      /**
       * Adds the event listener for pointerup
       *
       * @memberof Mrkr
       */
      function register() {
        this.element.addEventListener('pointerup', this.handlePointerUp);
      }
      /**
       * Removes the event listener for pointerup
       *
       * @memberof Mrkr
       */

    }, {
      key: "unregister",
      value: function unregister() {
        this.element.removeEventListener('pointerup', this.handlePointerUp);
      }
      /**
       * Sets the current classname
       *
       * @param {string} className
       * @memberof Mrkr
       */

    }, {
      key: "setClassName",
      value: function setClassName(className) {
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

    }, {
      key: "getData",
      value: function getData(className) {
        if (!this.element) return [];
        var textNodes = textNodesUnder(this.element);
        var highlightedTextNodes = this.getHighlightedNodes(className).reduce(function (arr, current) {
          return [].concat(_toConsumableArray(arr), _toConsumableArray(textNodesUnder(current)));
        }, []);
        var currentIndex = 0;
        var startFound = false;
        var data = [];
        textNodes.some(function (textNode, i) {
          if (!textNode.textContent) return false;
          var highlightedTextNode = highlightedTextNodes.find(function (node) {
            return node === textNode;
          });

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

    }, {
      key: "setElement",
      value: function setElement(element) {
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

    }, {
      key: "clear",
      value: function clear(offsetTargets) {
        if (!this.element) return; // Guard against bad offset inputs

        var offsets = offsetTargets === null || offsetTargets === void 0 ? void 0 : offsetTargets.filter(function (o) {
          return isValidOffset(o);
        });
        var highlightedNodes = this.getHighlightedNodes();
        var textNodes = textNodesUnder(this.element); // If offsets array not included, clear all

        if (!offsets) {
          highlightedNodes.forEach(function (highlightedNode) {
            highlightedNode.replaceWith.apply(highlightedNode, _toConsumableArray(Array.from(highlightedNode.childNodes)));
          });
        } else {
          // Clear all highlighted text that falls between the offsets in the passed offsets array
          var currentIndex = 0; // Clear any text nodes that fall inside any of the offset ranges passed

          textNodes.some(function (textNode) {
            var _textNode$textContent;

            if (offsets.find(function (offset) {
              return isValidOffset(offset) && currentIndex >= offset.startOffset && currentIndex <= offset.endOffset;
            })) {
              var highlightedNode = highlightedNodes.find(function (node) {
                return !!Array.from(node.childNodes).find(function (n) {
                  return n === textNode;
                });
              });

              if (highlightedNode) {
                highlightedNode.replaceWith.apply(highlightedNode, _toConsumableArray(Array.from(highlightedNode.childNodes)));
              }
            } // Can stop searching


            var ends = offsets.map(function (offset) {
              return offset.endOffset;
            }).filter(function (n) {
              return typeof n === 'number';
            });

            if (currentIndex > Math.max.apply(Math, _toConsumableArray(ends))) {
              return true;
            }

            currentIndex += ((_textNode$textContent = textNode.textContent) === null || _textNode$textContent === void 0 ? void 0 : _textNode$textContent.length) || 0;
            return false;
          });
        }
      }
    }, {
      key: "highlight",
      value: function highlight() {
        var selection = window.getSelection();
        var results = []; // If there's no selection object

        if (!selection) return results; // Container element must be defined

        if (!this.element) {
          console.error(new Error('Container element not defined for highlighter.'));
          return results;
        }

        var range = selection.getRangeAt(0);
        var _ref = range,
            startContainer = _ref.startContainer,
            endContainer = _ref.endContainer; // Ensure that results are Text nodes

        if (isTextNode(startContainer) && isTextNode(endContainer)) {
          var startTextNode = startContainer;
          var endTextNode = endContainer; // If no content's actually been selected

          if (startTextNode === endTextNode && range.endOffset === range.startOffset) return results; // Convert to absolute offsets in the element

          var offsets = this.getAbsoluteOffsets(startContainer, range.startOffset, endContainer, range.endOffset); // Remove native selection

          selection.removeAllRanges();

          if (offsets.startOffset && offsets.endOffset) {
            var length = offsets.endOffset - offsets.startOffset; // Check for minimum / maximum

            var startOffset = offsets.startOffset,
                endOffset = offsets.endOffset;

            if (this.minimum && !(length >= this.minimum) || this.maximum && !(length <= this.maximum)) {
              return results;
            } // Check for overlap


            if (!this.overlap) {
              var highlights = this.getData();

              if (highlights.some(function (highlight) {
                return highlight.startOffset && highlight.endOffset && (startOffset > highlight.startOffset && startOffset < highlight.endOffset || endOffset > highlight.startOffset && endOffset < highlight.endOffset);
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
      }
      /**
       * Highlights a range of text determined by start and end offsets
       *
       * @param {number} startOffset - absolute offset in the element container
       * @param {number} endOffset - absolute offset in the element container
       * @returns {DataProps[]}
       * @memberof Mrkr
       */

    }, {
      key: "highlightRange",
      value: function highlightRange(startOffset, endOffset) {
        var _this2 = this;

        var results = [];

        if (!this.element) {
          console.error(new Error('Container element not defined for highlighter.'));
          return results;
        }

        var textNodes = textNodesUnder(this.element);
        var currentIndex = 0;
        var startFound = false;
        textNodes.some(function (textNode) {
          if (!textNode.textContent) return false;
          var newCurrentIndex = currentIndex + textNode.textContent.length;

          if (startOffset >= currentIndex && startOffset < newCurrentIndex) {
            var newNodes = _this2.highlightNode(textNode.textContent, startOffset - currentIndex, endOffset - currentIndex);

            textNode.replaceWith.apply(textNode, _toConsumableArray(newNodes)); // Start collecting text nodes in between

            startFound = true;
          }

          if (endOffset >= currentIndex && endOffset < newCurrentIndex) {
            var _newNodes = _this2.highlightNode(textNode.textContent, 0, endOffset - currentIndex);

            textNode.replaceWith.apply(textNode, _toConsumableArray(_newNodes)); // End the loop

            return true;
          }

          if (startFound) {
            var _newNodes2 = _this2.highlightNode(textNode.textContent, 0, textNode.textContent.length);

            textNode.replaceWith.apply(textNode, _toConsumableArray(_newNodes2));
          }

          currentIndex = newCurrentIndex;
          return false;
        });
        return this.getData();
      }
    }, {
      key: "getSelectionEnabled",
      value: function getSelectionEnabled() {
        return this.selectionEnabled;
      }
    }, {
      key: "toggleSelection",
      value: function toggleSelection(isEnabled) {
        this.selectionEnabled = typeof isEnabled === 'undefined' ? !this.selectionEnabled : isEnabled;
      }
    }, {
      key: "enableSelection",
      value: function enableSelection() {
        this.selectionEnabled = true;
      }
    }, {
      key: "disableSelection",
      value: function disableSelection() {
        this.selectionEnabled = false;
      }
    }]);

    return Mrkr;
  }();

  return Mrkr;

}));
//# sourceMappingURL=bundle.umd.js.map
