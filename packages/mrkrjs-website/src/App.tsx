import React, { useRef } from 'react';
import './App.css';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import Mrkr from 'mrkrjs';

SyntaxHighlighter.registerLanguage('javascript', js);

const Component = ({ string }: { string: string }) => {
  return (
    <SyntaxHighlighter language="javascript" style={atomOneDark} customStyle={{ backgroundColor: '#20232a', fontSize: 18, borderRadius: 10 }}>
      {string}
    </SyntaxHighlighter>
  );
};


function App() {
  useRef<Mrkr>(new Mrkr(document.body, 'highlight'));

  return (
    <div className="App">
      <header className="App-header">
        <div className="content-container">
          <h2>Install</h2>
          <Component string="yarn add mrkrjs" />

          <h2>Usage</h2>
          <Component string={`import Mrkr from 'mrkrjs';
            
// Get container element
const element = document.getElementById('my-container');

// Create mrkr instance
const mrkr = new Mrkr(element, 'highlight');`} />

          <h2>Demo</h2>
          <div style={{ lineHeight: '1.25em' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
