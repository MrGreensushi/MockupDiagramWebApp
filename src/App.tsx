// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import NarrativeFlowDiagram from "./Flow/NarrativeFlowDiagram.tsx";
import StoryElements from "./Layout/StoryElements.tsx";
import { Col, Row } from "react-bootstrap";
import { CharacterElement, LocationElement, ObjectElement } from "./StoryElements/StoryElement.ts";
import Story from "./StoryElements/Story.ts";
import { initBlocks } from "./Blockly/Blocks.ts";

const defaultCharacters = [
  new CharacterElement(false, "Amun", "Scriba per il faraone Ramses II"),
  new CharacterElement(false, "Semeb", "Scriba per il faraone Ramses II"),
  new CharacterElement(false, "Imhotep", "Capo Scriba per il faraone Ramses II"),
  new CharacterElement(false, "Tia", "Moglie di Semeb"),
  new CharacterElement(true, "Oracolo"),
  new CharacterElement(true, "Scienziati"),
];

const defaultObjects = [
  new ObjectElement(true, "Oggetti Generici"),
];

const defaultLocations = [
  new LocationElement(true, "Tombe"),
  new LocationElement(true, "Case"),
  new LocationElement(true, "Biblioteche"),
  new LocationElement(false, "Riva del Nilo"),
  new LocationElement(false, "Tempio di Karnak"),
  new LocationElement(false, "Piazza di Tebe"),
];


function App() {
  const [story, setStory] = useState(new Story(defaultCharacters, defaultObjects, defaultLocations));

  useEffect(() => initBlocks(), []);
  useEffect(() => console.log(story),[story]);

  return (
    <div className="App">
      <h1>Story Editor</h1>
      <Row>
        <Col xs={3}>
          <StoryElements 
            story={story}
            setStory={setStory} />
        </Col>
        <Col>
          <NarrativeFlowDiagram
            story={story}
            setStory={setStory}/>
        </Col>
      </Row>
    </div>
  );
}

export default App;
