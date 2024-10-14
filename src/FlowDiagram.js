import { useCallback, useState } from "react";
import {
  addEdge,
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { v4 as uuidv4 } from "uuid"; // Per generare id univoci
import ResizableNode from "./ResizableNode";
import NodeEditor from "./NodeEditing/NodeEditor";
import "@xyflow/react/dist/style.css";
import NodeImporter from "./NodeImporting/NodeImporter";
import SaveLoadManager from "./SaveLoad";

const nodeTypes = {
  ResizableNode,
};
const BaseStyle = {
  background: "#fff",
  border: "1px solid black",
  borderRadius: 2,
  fontSize: 12,
};

const FlowDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNode, setSelectedNode] = useState(null); // Nodo selezionato
  const [rfInstance, setRfInstance] = useState(null);

  const addNode = () => {
    const newNode = {
      id: uuidv4(),
      data: {
        label: `Nodo ${nodes.length + 1}`,
        descriptions: {
          // ENG: {
          //   Novice: '',
          //   Intermediate: '',
          //   Expert: '',
          // },
          ITA: {
            Novice: "",
            Intermediate: "",
            Expert: "",
          },
        },
        nodePhrases: {
          // ENG: {
          //   Novice: {},
          //   Intermediate: {},
          //   Expert: {},
          // },
          ITA: {
            Novice: {},
            Intermediate: {},
            Expert: {},
          },
        },
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "ResizableNode",
      style: BaseStyle,
    };
    setNodes((els) => [...els, newNode]);
  };

  const addExistingNode = (node) => {
    const newNode = {
      id: uuidv4(),
      data: {
        label: node.Name,
        descriptions: {
          // ENG: {
          //   Novice: '',
          //   Intermediate: '',
          //   Expert: '',
          // },
          ITA: node.ITA.descriptions,
        },
        nodePhrases: {
          // ENG: {
          //   Novice: {},
          //   Intermediate: {},
          //   Expert: {},
          // },
          ITA: node.ITA.nodePhrases,
        },
      },   
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "ResizableNode",
      style: BaseStyle,
    };
    console.log(newNode)
    setNodes((els) => [...els, newNode]);
  };

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeClick = (ev, element) => {
    if (element.type === "ResizableNode") setSelectedNode(element);
    console.log(element)
  };

  const onSelectionEnd = () => {
    setSelectedNode(null);
  };

  // Funzione per aggiornare il nome del nodo selezionato
  const handleNameChange = (e) => {
    const newLabel = e.target.value;
    setSelectedNode((node) => ({
      ...node,
      data: { ...node.data, label: newLabel },
    }));
    setNodes((els) =>
      els.map((el) =>
        el.id === selectedNode.id
          ? { ...el, data: { ...el.data, label: newLabel } }
          : el
      )
    );
  };

  // Function to handle node updates (descriptions and nodePhrases)
  const handleNodeUpdate = (updatedNode) => {
    setNodes((els) =>
      els.map((el) =>
        el.id === updatedNode.id
          ? { ...el, data: { ...el.data, ...updatedNode.data } }
          : el
      )
    );
    setSelectedNode(updatedNode); // Also update the selected node in state
    updateNodeServer(updatedNode)
  };


  const updateNodeServer = (updatedNode) => {
    
    
    const requestOptions={
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedNode.data)
    }
    console.log(requestOptions)

    fetch("/nodes/"+updatedNode["data"]["label"], requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
  };



  return (
      <div style={{ display: "flex", height: 600 }}>
        <div style={{ width: "75%" }}>
          <button onClick={addNode} style={{ marginBottom: "10px" }}>
            Aggiungi Nodo
          </button>
          <NodeImporter addExistingNode={addExistingNode} />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodeClick={onNodeClick}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onSelectionEnd={onSelectionEnd}
            onInit={setRfInstance}
            deleteKeyCode={"Backspace"} /* Cancella con il tasto Canc */
            style={{ width: "100%", height: "500px", border: "1px solid black" }}
            fitView
            >
            <SaveLoadManager
              rfInstance={rfInstance}
              />
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodeEditor
          selectedNode={selectedNode} // Pass the selected node
          handleNameChange={handleNameChange} // Pass the name change handler
          handleNodeUpdate={handleNodeUpdate} // Pass the node update handler
          />
        )}
      </div>
  );
};

export default FlowDiagram;
