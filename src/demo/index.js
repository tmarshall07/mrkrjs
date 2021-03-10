import './css/App.css';
import Mrkr from '../lib';

const onHighlightSelection = (e, results) => {
  console.log(e)
  console.log(results)
};

const mrkr= new Mrkr({ onHighlightSelection });
window.mrkr = mrkr;

mrkr.enableSelection();

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';


// const domContainer = document.getElementById('root');
// ReactDOM.render(React.createElement(App), domContainer);
