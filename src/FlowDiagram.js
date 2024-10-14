import { useCallback, useState, useEffect } from "react";
import {
  addEdge,
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
} from "@xyflow/react";
import { v4 as uuidv4 } from "uuid"; // Per generare id univoci
import ResizableNode from "./Nodes/ResizableNode";
import NodeEditor from "./Nodes/NodeEditing/NodeEditor";
import "@xyflow/react/dist/style.css";
import NodeImporter from "./Nodes/NodeImporting/NodeImporter";
import { BaseGraphNodeData } from "./Nodes/NodesClasses/BaseGraphNodeData";

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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [selectedNode, setSelectedNode] = useState(null); // Nodo selezionato
  const [importedNodes, setImportedNodes] = useState([]);

  //Initialize importedNodes
  useEffect(() => {
    fetch("/nodes")
      .then((res) => {
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        setImportedNodes(data);
        console.log(data); // Set the nodes with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const createNewNode = () => {
    const id = uuidv4();
    return {
      id: id,
      data: new BaseGraphNodeData(id, "Nodo " + nodes.length + 1),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: "ResizableNode",
      style: BaseStyle,
    };
  };

  const addNode = () => {
    const newNode = createNewNode();
    console.log("New Graph node: ", newNode);
    setNodes((els) => [...els, newNode]);
  };

  const addExistingNode = (node) => {
    const importedNodeInfo = BaseGraphNodeData.initializeFromImportedInfo(node);
    console.log("Imported Node Info: ", importedNodeInfo);

    const newGraphNode = createNewNode();
    newGraphNode.data.assign(importedNodeInfo);
    console.log("New Graph Node: ", newGraphNode);

    setNodes((oldNodes) => [...oldNodes, newGraphNode]);
  };

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onNodeClick = (ev, element) => {
    if (element.type === "ResizableNode") {
      const clickedNode = nodes.find((x) => x.id === element.id);
      console.log("ClickedNode: ", clickedNode);
      setSelectedNode(clickedNode.data);
    }
  };

  const onSelectionEnd = () => {
    setSelectedNode(null);
  };

  // Funzione per aggiornare il nome del nodo selezionato
  const handleNameChange = (e) => {
    const newLabel = e.target.value;

    // update nodes
    const newNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        return {
          ...node, // Copia il nodo esistente
          data: {
            ...node.data, // Copia i dati esistenti
            label: newLabel, // Modifica il label
          },
        };
      }
      return node;
    });
    setNodes(newNodes);

    //selectedNode is a BaseGraphNodeData!
    selectedNode.label = newLabel;
    console.log("Nodes Updated: ", selectedNode);
  };

  // Function to handle node updates (descriptions and nodePhrases)
  const handleNodeUpdate = (updatedNode) => {
    if (!(updatedNode instanceof BaseGraphNodeData)) {
      throw new Error(updatedNode, " is not an instanceof BaseGraphNodeData");
    }

    setNodes((els) =>
      els.map((el) =>
        el.id === updatedNode.id ? { ...el, data: updatedNode } : el
      )
    );
    //setSelectedNode(updatedNode); // Also update the selected node in state
    //updateImportedNodes(updatedNode.data); //Updated the button of the node importer
    //updateNodeServer(updatedNode);
  };

  const updateImportedNodes = (updatedNode) => {
    console.log("ImportedNodes ", importedNodes);
    console.log("Node to update: ", updatedNode);

    setImportedNodes((els) =>
      els.map((el) =>
        el.Name === updatedNode.label
          ? {
              ...el,
              descriptions: { ...updatedNode.descriptions },
              nodePhrases: { ...updatedNode.nodePhrases },
            }
          : el
      )
    );
  };

  const updateImportedNode = (oldNode, updatedNode) => {
    return {
      ...oldNode,
      ENG: {},
    };
  };

  const updateNodeServer = (updatedNode) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNode.data),
    };
    console.log(requestOptions);

    fetch("/nodes/" + updatedNode["data"]["label"], requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success: ", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ display: "flex", height: 600 }}>
      <div style={{ width: "75%" }}>
        <button onClick={addNode} style={{ marginBottom: "10px" }}>
          Aggiungi Nodo
        </button>
        <NodeImporter
          addExistingNode={addExistingNode}
          importedNodes={importedNodes}
        />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onSelectionEnd={onSelectionEnd}
          deleteKeyCode={"Backspace"} /* Cancella con il tasto Canc */
          style={{ width: "100%", height: "500px", border: "1px solid black" }}
          fitView
        >
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
