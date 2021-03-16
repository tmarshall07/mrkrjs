import './css/App.css';
import Mrkr from '../lib';

const onSelection = (e, results) => {
  console.log(e);
  console.log(results);
};

const element = document.getElementById('root');

const mrkr = new Mrkr({ onSelection, element, minimum: 5, maximum: 1000, overlap: false });
window.mrkr = mrkr;

mrkr.enableSelection();

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// const domContainer = document.getElementById('root');
// ReactDOM.render(React.createElement(App), domContainer);
