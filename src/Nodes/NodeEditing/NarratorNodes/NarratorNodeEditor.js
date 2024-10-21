import React, { useState, useEffect } from "react";
import CharacterEditor from "./CharacterEditor";  // Un editor simile a DescriptionEditor
import ObjectEditor from "./ObjectEditor";  // Un editor simile a NodePhrasesEditor
import NarrativeDataManager from "../../../StoryElements/NarrativeDataManager";
import { Col } from "react-bootstrap";
import NarratorNode from "../../NodesClasses/NarratorNode";
import BackgroundSelector from "./BackgroundSelector";

// selectedNode è un NarratorNode
const NarratorNodeEditor = ({ selectedNode, handleNameChange, handleNodeUpdate }) => {
  const [mainCharacters, setMainCharacters] = useState(selectedNode.mainCharacters || []);
  const [backgroundCharacters, setBackgroundCharacters] = useState(selectedNode.BackgroundCharacters || []);
  const [objects, setObjects] = useState(selectedNode.Objects || []);
  const [background, setBackground] = useState(selectedNode.Background || "");
  const narrativeDataManager = NarrativeDataManager.getInstance();

  // Aggiorna i valori quando selectedNode cambia
  useEffect(() => {
    if (selectedNode) {
      setMainCharacters(selectedNode.mainCharacters || []);
      setBackgroundCharacters(selectedNode.BackgroundCharacters || []);
      setObjects(selectedNode.Objects || []);
      setBackground(selectedNode.Background || "");
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
  const handleBackgroundChange = (newBackground) => {
    if (narrativeDataManager.backgrounds.includes(newBackground)) {
      setBackground(newBackground);
    } else {
      console.error(`Background non valido!`, newBackground);
    }
  };

  // Salva le modifiche
  const saveChanges = () => {
    const updatedNode = new NarratorNode(
      selectedNode.name,
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
        value={selectedNode.label}
        onChange={(e) => handleNameChange(e.target.value)}
        style={{ padding: "5px", marginTop: "10px" }}
      />

      <h4>Main Characters</h4>
      <CharacterEditor
        characters={mainCharacters}
        availableCharacters={narrativeDataManager.characters}
        handleCharactersChange={handleMainCharactersChange}
      />

      <h4>Background Characters</h4>
      <CharacterEditor
        characters={backgroundCharacters}
        availableCharacters={narrativeDataManager.characters}
        handleCharactersChange={handleBackgroundCharactersChange}
      />

      <h4>Objects</h4>
      <CharacterEditor
        characters={objects}
        availableCharacters={narrativeDataManager.objects}
        handleCharactersChange={handleObjectsChange}
      />

      <h4>Background</h4>
      <CharacterEditor
        characters={[background]}
        availableCharacters={narrativeDataManager.backgrounds}
        handleCharactersChange={handleBackgroundChange}
      />

      <button onClick={saveChanges} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </Col>
  );
};

export default NarratorNodeEditor;
