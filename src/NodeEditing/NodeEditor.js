import React, { useState, useEffect } from "react";
import DescriptionEditor from "./DescriptionEditor";
import NodePhraseEditor from "./NodePhrasesEditor";

const LEVELS = ["Novice", "Intermediate", "Expert"];

const NodeEditor = ({ selectedNode, handleNameChange, handleNodeUpdate }) => {
  const [descriptions, setDescriptions] = useState(
    selectedNode.data.descriptions || {}
  );
  const [nodePhrases, setNodePhrases] = useState(
    selectedNode.data.nodePhrases || {}
  );

  // Set descriptions and node phrases when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setDescriptions(selectedNode.data.descriptions || {});
      setNodePhrases(selectedNode.data.nodePhrases || {});
    }
  }, [selectedNode]);

  // Handle description changes
  const handleDescriptionChange = (language, level, value) => {
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [language]: {
        ...prevDescriptions[language],
        [level]: value,
      },
    }));
  };

  // Handle node phrase changes
  const handleNodePhraseChange = (language, level, clipId, value) => {
    setNodePhrases((prevNodePhrases) => ({
      ...prevNodePhrases,
      [language]: {
        ...prevNodePhrases[language],
        [level]: {
          ...prevNodePhrases[language][level],
          [clipId]: value,
        },
      },
    }));
  };

  const saveChanges = () => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        descriptions,
        nodePhrases,
      },
    };
    handleNodeUpdate(updatedNode); // Call a function to save/update the node
  };

  return (
    <div
      style={{
        width: "25%",
        padding: "20px",
        borderLeft: "1px solid #ddd",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h3>Modifica Nodo</h3>
      <label>Nome del nodo:</label>
      <input
        type="text"
        value={selectedNode.data.label}
        onChange={handleNameChange}
        style={{ width: "100%", padding: "5px", marginTop: "10px" }}
      />

      <h4>Descrizioni</h4>
      {Object.keys(descriptions).map((language) => (
        <DescriptionEditor
          language={language}
          levels={LEVELS}
          descriptions={descriptions}
          handleDescriptionChange={handleDescriptionChange}
        />
      ))}

      <h4>Node Phrases</h4>
      {Object.keys(descriptions).map((language) => (
        <NodePhraseEditor
          language={language}
          levels={LEVELS}
          nodePhrases={nodePhrases}
          handleNodePhraseChange={handleNodePhraseChange}
        />
      ))}

      <button onClick={saveChanges} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </div>
  );
};

export default NodeEditor;
