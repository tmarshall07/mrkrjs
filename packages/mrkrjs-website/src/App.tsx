import React, { useRef, useEffect } from 'react';
import './App.css';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import Mrkr from 'mrkrjs';

SyntaxHighlighter.registerLanguage('javascript', js);

const Component = ({ string }: { string: string }) => {
  return (
    <SyntaxHighlighter language="javascript" style={atomOneDark}>
      {string}
    </SyntaxHighlighter>
  );
};


function App() {
  const mrkrRef = useRef();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) mrkrRef.current = new Mrkr(containerRef.current);
  }, [])

  return (
    <div className="App" ref={containerRef}>
      <header className="App-header">
        <h2>Install</h2>
        <code>yarn add mrkrjs</code>

        <h2>Usage</h2>
        <Component string={`
import Mrkr from 'mrkrjs';
          
// Create mrkr instance
const mrkr = new Mrkr(); 
        `} />
        <code>
        </code>
      </header>
    </div>
  );
}

export default App;
