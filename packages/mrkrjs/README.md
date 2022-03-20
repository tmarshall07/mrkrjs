<div align="center">
  <h2>MrkrJS</h2>
  <blockquote>A simple highlighter utility for the browser</blockquote>
</div>

# MrkrJS
Mrkr is a simple utility to apply arbitrary styles to highlighted text either using the native cursor or programmatically with a set of number offsets.

# Installation
```bash
# npm
npm i mrkrjs

# yarn
yarn add mrkrjs
```

# Usage
```javascript
import Mrkr from 'mrkrjs';

// Create mrkr instance
const mrkr = new Mrkr(document.body, 'highlight');
```

## Parameters
### `element`
A target container element to apply highlighting to.
> Note: Any HTMLElement works as a container, however using the `body` element can result in slower highlighting with larger pages.

### `className`
The class name to apply to highlighted elements.

### `options` (optional)
An object containing intialization parameters. The possible options are:


`options.minimum` _number_
Default: `undefined`

The minimum amount of text that must be selected to apply highlights.


`options.maximum` _number_
Default: `undefined`

The maximum amount of text that can be selected to apply highlights.


`options.overlap` _boolean_
Default: `false`

Allow overlapping highlights.


`options.onSelection` _(e, data) => void_
Default: `undefined`

Callback that's fired on selection with the cursor.

## Methods

### `enabledSelection()`
Enables the highlighter.

### `disabledSelection()`
Disables the highlighter.

### `clear([ offsetTargets])`
Clears a specific range of highlighted text if an array is passed, otherwise clears all highlighted text.
#### Parameters
`offsetTargets`: 
```javascript
{
  startOffset: number;
  endOffset: number;
}[]
```

### `setClassName(className)`
Sets the current `className` applied to highlighted text.
#### parameters
`className`: `string`

### `getData()`
Gets an array of data about the highlighted blocks of text.
#### Returns
```javascript
{
  startOffset: number;
  endOffset: number;
  text: string;
  node: Text[];
}[]
```

### `setElement(element)`
Set the highlighter's current container element.
#### Parameters
`element`: `HTMLElement`



### `highlight()`
Applies the highlight class to the currently selected text.
#### Returns
```javascript
{
  startOffset: number;
  endOffset: number;
  text: string;
  node: Text[];
}[]
```

### `highlightRange(startOffset, endOffset)`
Applies the highlight class to the specified range of text offsets.
#### Parameters
`startOffset`: `number`
`endOffset`: `number`

#### Returns
```javascript
{
  startOffset: number;
  endOffset: number;
  text: string;
  node: Text[];
}[]
```

### `getSelectionEnabled()`
Gets the current active state of the selection highlighter.
#### Returns
`boolean`

### `toggleSelection([ isEnabled])`
Toggles the current active state of the selection highlighter or sets the passed enabled state.
#### Parameters
`isEnabled`: `boolean`

