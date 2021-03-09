/*!
 * 
 *   mrkerjs v1.0.0
 *   https://github.com/tmarshall/mrkrjs
 * 
 *   Copyright (c) Tanner Marshall (https://github.com/tmarshall07)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *   
 */
!function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define("mrkrjs",[],t):"object"===typeof exports?exports.mrkrjs=t():e.mrkrjs=t()}(this,(function(){return function(e){var t={};function __webpack_require__(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},__webpack_require__.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,t){if(1&t&&(e=__webpack_require__(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(__webpack_require__.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)__webpack_require__.d(r,n,function(t){return e[t]}.bind(null,n));return r},__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=0)}([function(e,t,r){"use strict";function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function _toConsumableArray(e){return function(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(e){if("string"===typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function isTextNode(e){return 3===e.nodeType}r.r(t);var n=function(){function Highlighter(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,Highlighter),_defineProperty(this,"element",void 0),_defineProperty(this,"highlightClass",void 0),_defineProperty(this,"enabled",void 0);var t=e.element,r=void 0===t?document.body:t,n=e.className,i=void 0===n?"highlight":n,o=e.enabled,a=void 0===o||o;this.element=r,this.highlightClass=i,this.enabled=a,this.setContainerElement(r),this.handlePointerUp=this.handlePointerUp.bind(this),this.element.addEventListener("pointerup",this.handlePointerUp)}var e,t,r;return e=Highlighter,(t=[{key:"handlePointerUp",value:function(){this.enabled&&this.highlightSelection()}},{key:"setContainerElement",value:function(e){this.element=e}},{key:"getHighlightedNodes",value:function(){return this.element?Array.from(this.element.querySelectorAll(".".concat(this.highlightClass))):[]}},{key:"clear",value:function(){this.element&&this.getHighlightedNodes().forEach((function(e){e.replaceWith.apply(e,_toConsumableArray(Array.from(e.childNodes)))}))}},{key:"highlightSelection",value:function(){var e=this,t=window.getSelection(),r={};if(!t)return r;if(!this.element)return console.error(new Error("Container element not defined for highlighter.")),r;var n=t.getRangeAt(0),o=n.startContainer,a=n.endContainer,l=n.startOffset,u=n.endOffset;if(isTextNode(o)&&isTextNode(a)){var h=o,s=a;if(h===s&&u===l)return r;if(h===s){var c=this.highlightNode(h.textContent,l,u);h.replaceWith.apply(h,_toConsumableArray(c))}else{var f=i(this.element),d=!1;f.some((function(t){if(!t.textContent)return!1;if(t===h){var r=e.highlightNode(t.textContent,l,t.textContent.length);return t.replaceWith.apply(t,_toConsumableArray(r)),d=!0,!1}if(t===s){var n=e.highlightNode(t.textContent,0,u);return t.replaceWith.apply(t,_toConsumableArray(n)),!0}if(d){var i=e.highlightNode(t.textContent,0,t.textContent.length);t.replaceWith.apply(t,_toConsumableArray(i))}return!1}))}return t.removeAllRanges(),this.getOffsets()}return r}},{key:"highlightRange",value:function(e,t){var r=this;this.element||console.error(new Error("Container element not defined for highlighter."));var n=i(this.element),o=0,a=!1;n.some((function(n){if(!n.textContent)return!1;var i=o+(n.textContent.length||0);if(e>=o&&e<i){var l=r.highlightNode(n.textContent,e-o,n.textContent.length);n.replaceWith.apply(n,_toConsumableArray(l)),a=!0}else{if(t>=o&&t<i){var u=r.highlightNode(n.textContent,0,t-o);return n.replaceWith.apply(n,_toConsumableArray(u)),!0}if(a){var h=r.highlightNode(n.textContent,0,n.textContent.length);n.replaceWith.apply(n,_toConsumableArray(h))}}return o=i,!1}))}},{key:"getOffsets",value:function(){if(!this.element)return{};var e=i(this.element),t=this.getHighlightedNodes().reduce((function(e,t){return[].concat(_toConsumableArray(e),_toConsumableArray(i(t)))}),[]),r=0,n=0,o=0;return e.some((function(e){if(!e.textContent)return!1;t.find((function(t){return t===e}))&&(r||(r=o),n=o+e.textContent.length),o+=e.textContent.length})),{startOffset:r,endOffset:n}}},{key:"highlightNode",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1?arguments[1]:void 0,r=arguments.length>2?arguments[2]:void 0;if(!e)return[];var n=e.substring(t,r);if(n.length>0){var i=document.createElement("SPAN");i.classList.add(this.highlightClass);var o=document.createTextNode(e.substring(0,t)),a=document.createTextNode(n),l=document.createTextNode(e.substring(r));i.appendChild(a);var u=[];return o.textContent&&u.push(o),u.push(i),l.textContent&&u.push(l),u}return[document.createTextNode(e)]}},{key:"enable",value:function(){this.enabled=!0}},{key:"disable",value:function(){this.enabled=!1}}])&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),Highlighter}(),i=function textNodesUnder(e){var t=[];for(e=e.firstChild;e;e=e.nextSibling)isTextNode(e)?t.push(e):t=t.concat(textNodesUnder(e));return t};t.default=n}])}));
//# sourceMappingURL=index.js.map