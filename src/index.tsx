import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';

const rootNode = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(rootNode, document.getElementById('root'));
