import React, { useState, useEffect } from "react";
import DescriptionEditor from "./DescriptionEditor";
import NodePhraseEditor from "./NodePhrasesEditor";
import { BaseGraphNodeData,Description,NodePhrase } from "../NodesClasses/BaseGraphNodeData";
import { Col } from "react-bootstrap";

const LEVELS = ["Novice", "Intermediate", "Expert"];

//selectedNode è un BaseGraphNodeData!
const NodeEditor = ({ selectedNode, handleNameChange, handleNodeUpdate }) => {
  const [descriptions, setDescriptions] = useState(
    Description.intialize(selectedNode.descriptions) || new Description()
  );
  const [nodePhrases, setNodePhrases] = useState(
    NodePhrase.intialize(selectedNode.nodePhrases) || new NodePhrase()
  );

  // Set descriptions and node phrases when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setDescriptions(Description.intialize(selectedNode.descriptions) || new Description());
      setNodePhrases(NodePhrase.intialize(selectedNode.nodePhrases) || new NodePhrase());
    }
    console.log("SelectedNode Changed: ", selectedNode);
    console.log(
      "Is selectedNode a baseCustoNode? ",
      selectedNode instanceof BaseGraphNodeData
    );
  }, [selectedNode]);

  // Handle description changes
  const handleDescriptionChange = (language, level, value) => {
    //Modificando direttamente descriptions REACT non si accorge che la variabile è cambiate
    //1. creo una nuova variabile con gli stess valori di descriptions
    const newDescription= Description.intialize(descriptions);
    //2. assegno i dati aggiornati 
    newDescription.updateDescription(language, level, value);
     //3. uso Set per far aggiornare su schermo i dati
    setDescriptions(newDescription)
    console.log("Description update: ", descriptions);
  };

  // Handle node phrase changes
  const handleNodePhraseChange = (language, level, clipId, value) => {
  
    //per far aggiornare il frontend bisogna creare una nuova variabile e poi usare Set..
    //1. creo una nuova variabile con gli stess valori di nodePhrases
    const newPhrases=NodePhrase.intialize(nodePhrases)
    //2. assegno i dati aggiornati 
    newPhrases.updateNodePhrase(language, level, clipId, value);
    //3. uso Set per far aggiornare su schermo i dati
    setNodePhrases(newPhrases);
    console.log("NodePhrase updated: ", selectedNode);
  };

  const saveChanges = () => {
    const updatedNode= BaseGraphNodeData.initialize(selectedNode);
    updatedNode.descriptions=descriptions;
    updatedNode.nodePhrases=nodePhrases;

    console.log("Node to save: ",updatedNode)
    handleNodeUpdate(updatedNode); // Call a function to save/update the node
  };

  return (
    <Col
      style={{
        padding: "1%",
        borderLeft: "1px solid #ddd",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h3>Modifica Nodo</h3>
      <label>Nome del nodo:</label>
      <input
        type="text"
        value={selectedNode.label}
        onChange={handleNameChange}
        style={{ padding: "5px", marginTop: "10px" }}
      />

      <h4>Descrizioni</h4>
      {Object.keys(descriptions).map((language) => (
        <DescriptionEditor
          key={language + ":DescriptionEditor"}
          language={language}
          levels={LEVELS}
          descriptions={descriptions}
          handleDescriptionChange={handleDescriptionChange}
        />
      ))}

      <h4>Node Phrases</h4>
      {Object.keys(descriptions).map((language) => (
        <NodePhraseEditor
          key={language + ":PhraseEditor"}
          language={language}
          levels={LEVELS}
          nodePhrases={nodePhrases}
          handleNodePhraseChange={handleNodePhraseChange}
        />
      ))}

      <button onClick={saveChanges} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </Col>
  );
};

export default NodeEditor;
