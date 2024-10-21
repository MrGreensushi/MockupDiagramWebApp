// src/App.js
import React, { useState } from "react";
import FlowDiagram from "./Flow/FlowDiagram";
import FlowDescriptor from "./Flow/FlowDescriptor";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [mainFlow, setMainFlow] = useState(
    new FlowDescriptor([], [], "React Diagram",true)
  );
  const [activeFlow, setActiveFlow] = useState(mainFlow);

  const onClickSetSubFlow = (
    currentFlow,
    newFlow
  ) => {
    //aggiorna mainFlow
    setMainFlow(
      (prevFlow) => new FlowDescriptor(currentFlow.nodes, currentFlow.edges, prevFlow.name)
    );
    //Setta il nuovo active flow
    setActiveFlow(newFlow);
  };

  const returnToMainFlow=()=>{

  }

  return (
    <div className="App">
      <h1>{activeFlow.name}</h1>
      <FlowDiagram
        flow={activeFlow}
        onClickSetSubFlow={onClickSetSubFlow}
      />
    </div>
  );
}

export default App;
