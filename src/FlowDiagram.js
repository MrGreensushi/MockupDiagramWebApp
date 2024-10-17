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
import SaveLoadManager from "./SaveLoad";
import CustomEdge from "./Edges/CustomEdge";
import BaseEdgeData from "./Edges/BaseEdgeData";

const nodeTypes = {
  ResizableNode,
};

const EdgeTypes = {
  CustomEdge,
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

  const [rfInstance, setRfInstance] = useState(null);

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
        //Creo un array di BaseGraphNodeData a partire dalla risposta dal server
        var nodeArray = [];
        data.map((importedInfo) => {
          const newGraphNode =
            BaseGraphNodeData.initializeFromImportedInfo(importedInfo);
          nodeArray.push(newGraphNode);
        });
        setImportedNodes(nodeArray);
        console.log(nodeArray); // Set the nodes with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const createNewNode = () => {
    const id = uuidv4();
    return {
      id: id,
      data: new BaseGraphNodeData(id, "Nodo " + (nodes.length + 1)),
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
    if (!(node instanceof BaseGraphNodeData))
      console.error("Node to Add is not an instace of BaseGraphNodeData");

    const newGraphNode = createNewNode();
    newGraphNode.data.assign(node);
    console.log("New Graph Node: ", newGraphNode);

    setNodes((oldNodes) => [...oldNodes, newGraphNode]);
  };

  const onConnect = useCallback((connection) => {
    connection.type = "CustomEdge";
    connection.data = new BaseEdgeData(null, null);

    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleEdgeDataUpdate = (edgeId, newData) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId ? { ...edge, data: newData } : edge
      )
    );
  };

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

    //Se il nodo modificato faceva parte di quelli prefatti, aggiorna il server!
    //Successivamente aggiorna anche i nodi importati se era uno dei nodi sel server
    checkIfNodeIsOnServer(updatedNode, updateNodeServer);
  };

  const checkIfNodeIsOnServer = (updatedNode, func) => {
    fetch("/nodes/" + updatedNode.label)
      .then((res) => {
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
          //Se l'errore è 404 vuol dire che il nodo non esisteva
          if(res.status==404){
            console.warn(updatedNode," Is not on the server")
            return false;
          }
          else
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        if(!data) 
          return;

        console.log("Updated Node was on the server: ", data);
        if (func) 
          func(updatedNode);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const updateNodeServer = (updatedNode) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: updatedNode.stringify(),
    };
    console.log("Update server node Request: ", requestOptions);

    fetch("/nodes/" + updatedNode.label, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("The update on the server was a Success: ", data);
        updateImportedNode(updatedNode); //Aggiorna il nodo importato sul frontend
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateImportedNode = (updateNode) => {
    updateNode.id = undefined;

    var newNodes = [];
    importedNodes.forEach((node) => {
      if (node.label === updateNode.label) newNodes.push(updateNode);
      else newNodes.push(node);
    });

    setImportedNodes(newNodes);
    console.log("Updated imported Nodes: ", newNodes);
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
          edgeTypes={{
            CustomEdge: (edgeProps) => (
              <CustomEdge
                {...edgeProps}
                handleEdgeDataUpdate={handleEdgeDataUpdate}
              />
            ),
          }}
          onSelectionEnd={onSelectionEnd}
          onInit={setRfInstance}
          deleteKeyCode={"Backspace"} /* Cancella con il tasto Canc */
          style={{ width: "100%", height: "500px", border: "1px solid black" }}
          fitView
        >
          <SaveLoadManager
            rfInstance={rfInstance}
            setEdges={setEdges}
            setNodes={setNodes}
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
