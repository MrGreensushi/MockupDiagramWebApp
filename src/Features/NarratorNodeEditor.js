import React, { useState, useEffect } from "react";
import ElementContainerPicker from "./ElementContainerPicker";
import NarrativeDataManager from "../StoryElements/NarrativeDataManager";
import { Col, Row } from "react-bootstrap";
import NarratorNode from "../Nodes/NodesClasses/NarratorNode";
import StoryElementContainerForm from "./StoryElementContainerForm";
import CharacterContainer from "../StoryElements/CharacterContainer";
import ObjectContainer from "../StoryElements/ObjectContainer";
import BackgroundContainer from "../StoryElements/BackgroundContainer";

// selectedNode è un NarratorNode
const NarratorNodeEditor = ({
  selectedNode,
  handleNodeUpdate,
  getNodeDataFromId,
  getOutgoingConnectionsFromNodeId,
}) => {
  const [nodeLabel, setNodeLabel] = useState(selectedNode.label || "");
  const [mainCharacters, setMainCharacters] = useState(
    selectedNode.mainCharacters || []
  );
  const [backgroundCharacters, setBackgroundCharacters] = useState(
    selectedNode.BackgroundCharacters || []
  );
  const [objects, setObjects] = useState(selectedNode.Objects || []);
  const [background, setBackground] = useState(selectedNode.Background || null);
  const [nextNodes, setNextNodes] = useState(selectedNode.NextNodes || []);
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
    // const validCharacters = updatedCharacters.filter(character =>
    //   narrativeDataManager.characterContainers.includes(character)
    // );
    setMainCharacters(updatedCharacters);
    console.log("Main characters updated: ", updatedCharacters);
  };

  // Funzioni per aggiornare i personaggi di sfondo
  const handleBackgroundCharactersChange = (updatedCharacters) => {
    const validCharacters = updatedCharacters.filter((character) =>
      narrativeDataManager.characterContainers.includes(character)
    );
    setBackgroundCharacters(validCharacters);
    console.log("Background characters updated: ", validCharacters);
  };

  // Funzioni per aggiornare gli oggetti
  const handleObjectsChange = (updatedObjects) => {
    const validObjects = updatedObjects.filter((object) =>
      narrativeDataManager.objectContainers.includes(object)
    );
    setObjects(validObjects);
    console.log("Objects updated: ", validObjects);
  };

  // Funzioni per aggiornare il background
  const handleBackgroundChange = (updatedBackgrounds) => {
    //Voglio solamente 1 possibile background e voglio che sia l'ultimo che sia stato selezionato!
    const newBackground = updatedBackgrounds[updatedBackgrounds.length - 1];
    console.log("New background: ", newBackground, updatedBackgrounds);

    if (narrativeDataManager.backgroundContainers.includes(newBackground)) {
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
    handleNodeUpdate(updatedNode); // Salva/aggiorna il nodo
  };

  const handleSubmitCharacterContainerForm = (
    baseDescriptor,
    id,
    description,
    notes
  ) => {
    const character = new CharacterContainer(
      baseDescriptor,
      id,
      description,
      notes
    );
    narrativeDataManager.addCharacter(character);
    // Forza l'aggiornamento dello stato
    setMainCharacters([...mainCharacters]); // trigger rerender
  };

  const handleSubmitObjectContainerForm = (
    baseDescriptor,
    id,
    description,
    notes
  ) => {
    const object = new ObjectContainer(baseDescriptor, id, description, notes);
    narrativeDataManager.addObject(object);
    // Forza l'aggiornamento dello stato
    setMainCharacters([...mainCharacters]); // trigger rerender
  };

  const handleSubmitBackgroundContainerForm = (
    baseDescriptor,
    id,
    description,
    notes
  ) => {
    const object = new BackgroundContainer(
      baseDescriptor,
      id,
      description,
      notes
    );
    narrativeDataManager.addBackground(object);
    // Forza l'aggiornamento dello stato
    setMainCharacters([...mainCharacters]); // trigger rerender
  };

  const centerText = { textAlign: "center" };
  const edges = getOutgoingConnectionsFromNodeId(selectedNode.id);
  return (
    <Col
      style={{
        padding: "1%",
        borderLeft: "1px solid #ddd",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h3 style={centerText}>Modifica NarratorNode</h3>

      <label>Nome del nodo:</label>
      <input
        type="text"
        value={nodeLabel}
        onChange={(e) => setNodeLabel(e.target.value)}
        style={{ padding: "5px", marginTop: "10px" }}
      />

      <h4 style={centerText}>Main Characters</h4>

      <ElementContainerPicker
        elements={mainCharacters}
        availableElements={narrativeDataManager.characterContainers.filter(
          (x) => backgroundCharacters.findIndex((y) => x.id === y.id) < 0
        )}
        handleElementsChange={handleMainCharactersChange}
      />

      <h4 style={centerText}>Background Characters</h4>
      <ElementContainerPicker
        elements={backgroundCharacters}
        availableElements={narrativeDataManager.characterContainers.filter(
          (x) => mainCharacters.findIndex((y) => x.id === y.id) < 0
        )}
        handleElementsChange={handleBackgroundCharactersChange}
      />

      <h4 style={centerText}>Objects</h4>
      <ElementContainerPicker
        elements={objects}
        availableElements={narrativeDataManager.objectContainers}
        handleElementsChange={handleObjectsChange}
      />

      <h4 style={centerText}>Background</h4>
      <ElementContainerPicker
        elements={background == null ? [] : [background]}
        availableElements={narrativeDataManager.backgroundContainers}
        handleElementsChange={handleBackgroundChange}
      />

      <h4 style={centerText}>Next nodes</h4>
      {nextNodes.map((targetNodeId, idx) => {
        const nodeData = getNodeDataFromId(targetNodeId);
        var edgeLabel;
        try {
          const edge =edges.find(x=>x.target===targetNodeId);
          edgeLabel = edge.label ? edge.label + ": " : "";
        } catch (error) {
          edgeLabel = "";
        }
        return (
          <p key={idx}>
            - {edgeLabel}
            {nodeData.label}
          </p>
        );
      })}

      <button onClick={saveChanges} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </Col>
  );
};

export default NarratorNodeEditor;
