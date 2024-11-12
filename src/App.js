// src/App.js
import React, { useEffect, useState } from "react";
import FlowDiagram from "./Flow/FlowDiagram";
import FlowDescriptor from "./Flow/FlowDescriptor";
import NarrativeFlowDiagram from "./Flow/NarrativeFlowDiagram";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NarrativeDataManager from "./StoryElements/NarrativeDataManager";
import StoryElementDescriptor from "./StoryElements/StoryElementDescriptor";
import StoryElementFormsTab from "./Features/StoryElementFormsTab";
import CharacterData from "./StoryElements/CharacterData";
import ObjectData from "./StoryElements/ObjectData";
import LocationtData from "./StoryElements/LocationData";
import SceneEditor from "./Layout/SceneEditor";import { Col, Row } from "react-bootstrap";

const characterDescriptors = [
  new StoryElementDescriptor(false, "Amun", "Scriba per il faraone Ramses II"),
  new StoryElementDescriptor(false, "Semeb", "Scriba per il faraone Ramses II"),
  new StoryElementDescriptor(
    false,
    "Imhotep",
    "Capo Scriba per il faraone Ramses II"
  ),
  new StoryElementDescriptor(false, "Tia", "Moglie di Semeb"),
  new StoryElementDescriptor(true, "Oracolo"),
  new StoryElementDescriptor(true, "Scienziati"),
];

const objectDescriptors = [
  new StoryElementDescriptor(true, "Oggetti_generici"),
];

const backgroundDescriptors = [
  new StoryElementDescriptor(true, "Tombe"),
  new StoryElementDescriptor(true, "Case"),
  new StoryElementDescriptor(true, "Biblioteche"),
  new StoryElementDescriptor(false, "Riva del Nilo"),
  new StoryElementDescriptor(false, "Tempio di Karnak"),
  new StoryElementDescriptor(false, "Pizza di Tebe"),
];


function App() {
  const [mainFlow, setMainFlow] = useState(
    new FlowDescriptor([], [], "React Diagram", true)
  );
  const [activeFlow, setActiveFlow] = useState(mainFlow);

  const manager = NarrativeDataManager.getInstance();
  characterDescriptors.forEach((element) => {
    manager.addCharacterDescriptor(element);
  });

  objectDescriptors.forEach((element) => {
    manager.addObjectDescriptor(element);
  });

  backgroundDescriptors.forEach((element) => {
    manager.addBackgroundDescriptor(element);
  });

  console.log("Manager ", manager);

  const onClickSetSubFlow = (currentFlow, newFlow) => {
    //aggiorna mainFlow
    setMainFlow(
      (prevFlow) =>
        new FlowDescriptor(currentFlow.nodes, currentFlow.edges, prevFlow.name)
    );
    //Setta il nuovo active flow
    setActiveFlow(newFlow);
  };

  const returnToMainFlow = () => {};

  return (
    <div className="App">
      <h1>{activeFlow.name}</h1>
      <Row>
        <Col xs={3}>
          <StoryElementFormsTab />
        </Col>
        <Col>
          <NarrativeFlowDiagram
            flow={activeFlow}
            onClickSetSubFlow={onClickSetSubFlow}
          />
        </Col>
      </Row>
    </div>
  );

  /*return(
    <div className="App">
      <SceneEditor />
    </div>
  );*/
}

export default App;
