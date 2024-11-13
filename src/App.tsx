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
  new ObjectElement(true, "Oggetti_generici"),
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

  const [modalOpened, setModalOpened] = useState(false);

  const manager = NarrativeDataManager.getInstance();
  characterDescriptors.forEach((element) => {
    manager.addCharacter(element);
  });

  objectDescriptors.forEach((element) => {
    manager.addObject(element);
  });

  backgroundDescriptors.forEach((element) => {
    manager.addBackground(element);
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
