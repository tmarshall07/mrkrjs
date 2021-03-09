<div align="center">
  <h2>MrkrJS</h2>
  <blockquote>A simple highlighter utility for the browser</blockquote>
</div>

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

const mrkr = new Mrkr(); // Create mrkr instance

// Enable selection highlight
mrkr.enableSelection();
```

# Options
You can also pass an optional options object, defaults are shown below:
```javascript
const options = {
  className: 'highlight',
  selectionEnabled: false,
  element: document.body,
}
```
