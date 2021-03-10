/*!
 * 
 *   mrkrjs v1.0.9
 *   https://github.com/tmarshall/mrkrjs
 * 
 *   Copyright (c) Tanner Marshall (https://github.com/tmarshall07)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *   
 */
!function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define("Mrkr",[],t):"object"===typeof exports?exports.Mrkr=t():e.Mrkr=t()}(this,(function(){return function(e){var t={};function __webpack_require__(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,n){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},__webpack_require__.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,t){if(1&t&&(e=__webpack_require__(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(__webpack_require__.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)__webpack_require__.d(n,r,function(t){return e[t]}.bind(null,r));return n},__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=0)}([function(e,t,n){"use strict";function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _toConsumableArray(e){return function(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(e){if("string"===typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function isTextNode(e){return 3===e.nodeType}n.r(t);var r=function(){function Mrkr(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,Mrkr),_defineProperty(this,"element",void 0),_defineProperty(this,"highlightClass",void 0),_defineProperty(this,"onSelection",void 0),_defineProperty(this,"selectionEnabled",void 0);var t=e.element,n=void 0===t?document.body:t,r=e.className,i=void 0===r?"highlight":r,o=e.selectionEnabled,a=void 0!==o&&o,l=e.onSelection,u=void 0===l?function(){}:l;this.element=n,this.highlightClass=i,this.selectionEnabled=a,this.onSelection=u,this.handlePointerUp=this.handlePointerUp.bind(this),this.setElement(n)}var e,t,n;return e=Mrkr,(t=[{key:"handlePointerUp",value:function(e){if(this.selectionEnabled){var t=this.highlight();this.onSelection(e,t)}}},{key:"getHighlightedNodes",value:function(){return this.element?Array.from(this.element.querySelectorAll(".".concat(this.highlightClass))):[]}},{key:"highlightNode",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;if(!e)return[];var r=e.substring(t,n);if(r.length>0){var i=document.createElement("SPAN");i.classList.add(this.highlightClass);var o=document.createTextNode(e.substring(0,t)),a=document.createTextNode(r),l=document.createTextNode(e.substring(n));i.appendChild(a);var u=[];return o.textContent&&u.push(o),u.push(i),l.textContent&&u.push(l),u}return[document.createTextNode(e)]}},{key:"getData",value:function(){if(!this.element)return[];var e=i(this.element),t=this.getHighlightedNodes().reduce((function(e,t){return[].concat(_toConsumableArray(e),_toConsumableArray(i(t)))}),[]),n=0,r=!1,o=[];return e.some((function(e){if(!e.textContent)return!1;t.find((function(t){return t===e}))?r?o[o.length-1].text+=e.textContent:(o.push({startOffset:n,text:e.textContent}),r=!0):r&&(o[o.length-1].endOffset=n+e.textContent.length,r=!1),n+=e.textContent.length})),o}},{key:"register",value:function(){this.element.addEventListener("pointerup",this.handlePointerUp)}},{key:"unregister",value:function(){this.element.removeEventListener("pointerup",this.handlePointerUp)}},{key:"setElement",value:function(e){this.unregister(),this.element=e,this.register()}},{key:"clear",value:function(e){if(this.element){var t=null===e||void 0===e?void 0:e.filter((function(e){return e&&e.startOffset&&e.endOffset})),n=this.getHighlightedNodes(),r=i(this.element);if(t){var o=0;r.some((function(e){var r;if(t.find((function(e){return e.startOffset&&e.endOffset&&o>=e.startOffset&&o<=e.endOffset}))){var i=n.find((function(t){return!!Array.from(t.childNodes).find((function(t){return t===e}))}));i&&i.replaceWith.apply(i,_toConsumableArray(Array.from(i.childNodes)))}var a=t.map((function(e){return e.endOffset})).filter((function(e){return"number"===typeof e}));return o>Math.max.apply(Math,_toConsumableArray(a))||(o+=(null===(r=e.textContent)||void 0===r?void 0:r.length)||0,!1)}))}else n.forEach((function(e){e.replaceWith.apply(e,_toConsumableArray(Array.from(e.childNodes)))}))}}},{key:"highlight",value:function(){var e=this,t=window.getSelection(),n=[];if(!t)return n;if(!this.element)return console.error(new Error("Container element not defined for highlighter.")),n;var r=t.getRangeAt(0),o=r.startContainer,a=r.endContainer,l=r.startOffset,u=r.endOffset;if(isTextNode(o)&&isTextNode(a)){var s=o,f=a;if(s===f&&u===l)return n;if(s===f){var c=this.highlightNode(s.textContent,l,u);s.replaceWith.apply(s,_toConsumableArray(c))}else{var h=i(this.element),d=!1;h.some((function(t){if(!t.textContent)return!1;if(t===s){var n=e.highlightNode(t.textContent,l,t.textContent.length);return t.replaceWith.apply(t,_toConsumableArray(n)),d=!0,!1}if(t===f){var r=e.highlightNode(t.textContent,0,u);return t.replaceWith.apply(t,_toConsumableArray(r)),!0}if(d){var i=e.highlightNode(t.textContent,0,t.textContent.length);t.replaceWith.apply(t,_toConsumableArray(i))}return!1}))}return t.removeAllRanges(),this.getData()}return n}},{key:"highlightRange",value:function(e,t){var n=this;if(!this.element)return console.error(new Error("Container element not defined for highlighter.")),[];var r=i(this.element),o=0,a=!1;return r.some((function(r){if(!r.textContent)return!1;var i=o+(r.textContent.length||0);if(e>=o&&e<i){var l=n.highlightNode(r.textContent,e-o,r.textContent.length);r.replaceWith.apply(r,_toConsumableArray(l)),a=!0}else{if(t>=o&&t<i){var u=n.highlightNode(r.textContent,0,t-o);return r.replaceWith.apply(r,_toConsumableArray(u)),!0}if(a){var s=n.highlightNode(r.textContent,0,r.textContent.length);r.replaceWith.apply(r,_toConsumableArray(s))}}return o=i,!1})),this.getData()}},{key:"getSelectionEnabled",value:function(){return this.selectionEnabled}},{key:"toggleSelection",value:function(e){this.selectionEnabled=e}},{key:"enableSelection",value:function(){this.selectionEnabled=!0}},{key:"disableSelection",value:function(){this.selectionEnabled=!1}}])&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),Mrkr}(),i=function textNodesUnder(e){var t=[];for(e=e.firstChild;e;e=e.nextSibling)isTextNode(e)?t.push(e):t=t.concat(textNodesUnder(e));return t};t.default=r}]).default}));
//# sourceMappingURL=index.js.map