// src/App.js
import React from 'react';
import FlowDiagram from './FlowDiagram';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>React Flow Diagram</h1>
      <FlowDiagram />
    </div>
  );
}

export default App;
