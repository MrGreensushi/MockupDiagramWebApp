import React, { useState, useEffect } from "react";
import ElementPicker from "./ElementPicker";
import NarrativeDataManager from "../../../StoryElements/NarrativeDataManager";
import { Col } from "react-bootstrap";
import NarratorNode from "../../NodesClasses/NarratorNode";
import StoryElementComponent from "./StoryElementComponent";

// selectedNode è un NarratorNode
const NarratorNodeEditor = ({ selectedNode, handleNodeUpdate }) => {
  const [nodeLabel,setNodeLabel] = useState(selectedNode.label||"")
  const [mainCharacters, setMainCharacters] = useState(selectedNode.mainCharacters || []);
  const [backgroundCharacters, setBackgroundCharacters] = useState(selectedNode.BackgroundCharacters || []);
  const [objects, setObjects] = useState(selectedNode.Objects || []);
  const [background, setBackground] = useState(selectedNode.Background || null);
  const narrativeDataManager = NarrativeDataManager.getInstance();

  // Aggiorna i valori quando selectedNode cambia
  useEffect(() => {
    if (selectedNode) {
      setMainCharacters(selectedNode.mainCharacters || []);
      setBackgroundCharacters(selectedNode.BackgroundCharacters || []);
      setObjects(selectedNode.Objects || []);
      setBackground(selectedNode.Background || null);
    }
    console.log("SelectedNode Changed: ", selectedNode);
  }, [selectedNode]);

  // Funzioni per aggiornare i personaggi principali
  const handleMainCharactersChange = (updatedCharacters) => {
    const validCharacters = updatedCharacters.filter(character =>
      narrativeDataManager.characters.includes(character)
    );
    setMainCharacters(validCharacters);
    console.log("Main characters updated: ", validCharacters);
  };

  // Funzioni per aggiornare i personaggi di sfondo
  const handleBackgroundCharactersChange = (updatedCharacters) => {
    const validCharacters = updatedCharacters.filter(character =>
      narrativeDataManager.characters.includes(character)
    );
    setBackgroundCharacters(validCharacters);
    console.log("Background characters updated: ", validCharacters);
  };

  // Funzioni per aggiornare gli oggetti
  const handleObjectsChange = (updatedObjects) => {
    const validObjects = updatedObjects.filter(object =>
      narrativeDataManager.objects.includes(object)
    );
    setObjects(validObjects);
    console.log("Objects updated: ", validObjects);
  };

  // Funzioni per aggiornare il background
  const handleBackgroundChange = (updatedBackgrounds) => {

    //Voglio solamente 1 possibile background e voglio che sia l'ultimo che sia stato selezionato!
    const newBackground=updatedBackgrounds[updatedBackgrounds.length-1]
    console.log("New background: ",newBackground, updatedBackgrounds)

    if (narrativeDataManager.backgrounds.includes(newBackground)) {
      setBackground(newBackground);
    } else {
      console.error(`Background non valido!`, newBackground);
    }
  };

  // Salva le modifiche
  const saveChanges = () => {
    const updatedNode = new NarratorNode(
      nodeLabel,
      selectedNode.id,
      mainCharacters,
      backgroundCharacters,
      objects,
      background,
      selectedNode.Time,
      selectedNode.Weather,
      selectedNode.Tones,
      selectedNode.Values,
      selectedNode.Prompt,
      selectedNode.NextNodes
    );
    console.log("Node to save: ", updatedNode);
    handleNodeUpdate(updatedNode);  // Salva/aggiorna il nodo
  };

  return (
    <Col
      style={{
        padding: "1%",
        borderLeft: "1px solid #ddd",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h3>Modifica NarratorNode</h3>

      <label>Nome del nodo:</label>
      <input
        type="text"
        value={nodeLabel}
        onChange={(e) => setNodeLabel(e.target.value)}
        style={{ padding: "5px", marginTop: "10px" }}
      />

      <h4>Main Characters</h4>
      <ElementPicker
        elements={mainCharacters}
        availableElements={narrativeDataManager.characters}
        handleElementsChange={handleMainCharactersChange}
      />

      <h4>Background Characters</h4>
      <ElementPicker
        elements={backgroundCharacters}
        availableElements={narrativeDataManager.characters}
        handleElementsChange={handleBackgroundCharactersChange}
      />

      <h4>Objects</h4>
      <ElementPicker
        elements={objects}
        availableElements={narrativeDataManager.objects}
        handleElementsChange={handleObjectsChange}
      />

      <h4>Background</h4>
      <ElementPicker
        elements={background==null?[]:[background]}
        availableElements={narrativeDataManager.backgrounds}
        handleElementsChange={handleBackgroundChange}
      />

      <button onClick={saveChanges} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </Col>
  );
};

export default NarratorNodeEditor;
