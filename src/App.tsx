// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState } from "react";
import FlowDiagram from "./Flow/FlowDiagram.tsx";
import FlowDescriptor from "./Flow/FlowDescriptor.ts";
import NarrativeFlowDiagram from "./Flow/NarrativeFlowDiagram";
import StoryElementFormsTab from "./Features/StoryElementFormsTab.tsx";
import { Col, Modal, Row } from "react-bootstrap";
import NarrativeDataManager from "./StoryElements/NarrativeDataManager.ts";
import SceneEditor from "./Layout/SceneEditor.tsx";
import { CharacterElement, LocationElement, ObjectElement } from "./StoryElements/StoryElement.ts";
import StoryElementInputForm from "./Layout/StoryElementInputForm.tsx";

const characterDescriptors = [
  new CharacterElement(false, "Amun", "Scriba per il faraone Ramses II"),
  new CharacterElement(false, "Semeb", "Scriba per il faraone Ramses II"),
  new CharacterElement(false, "Imhotep", "Capo Scriba per il faraone Ramses II"),
  new CharacterElement(false, "Tia", "Moglie di Semeb"),
  new CharacterElement(true, "Oracolo"),
  new CharacterElement(true, "Scienziati"),
];

const objectDescriptors = [
  new ObjectElement(true, "Oggetti Generici"),
];

const backgroundDescriptors = [
  new LocationElement(true, "Tombe"),
  new LocationElement(true, "Case"),
  new LocationElement(true, "Biblioteche"),
  new LocationElement(false, "Riva del Nilo"),
  new LocationElement(false, "Tempio di Karnak"),
  new LocationElement(false, "Piazza di Tebe"),
];


function App() {
  const [mainFlow, setMainFlow] = useState(
    new FlowDescriptor("React Diagram", true)
  );
  const [activeFlow, setActiveFlow] = useState(mainFlow);

  const manager = NarrativeDataManager.getInstance();
  characterDescriptors.forEach((element: CharacterElement) => {
    manager.addCharacter(element);
  });

  objectDescriptors.forEach((element: ObjectElement) => {
    manager.addObject(element);
  });

  backgroundDescriptors.forEach((element: LocationElement) => {
    manager.addLocation(element);
  });

  console.log("Manager ", manager);

  const onClickSetSubFlow = (currentFlow: FlowDescriptor, newFlow: FlowDescriptor) => {
    //aggiorna mainFlow
    setMainFlow(
      (prevFlow) =>
        new FlowDescriptor(prevFlow.name, false, currentFlow.nodes, currentFlow.edges, )
    );
    //Setta il nuovo active flow
    setActiveFlow(newFlow);
  };

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
/*
  return(
    <div className="App">
      <SceneEditor />
    </div>
  );*/
}

export default App;
