import { useCallback, useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import {
  addEdge,
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid"; // Per generare id univoci
import ResizableNode from "./Nodes/ResizableNode";
import NodeEditor from "./Nodes/NodeEditing/NodeEditor";
import NodeImporter from "./Nodes/NodeImporting/NodeImporter";
import { BaseGraphNodeData } from "./Nodes/NodesClasses/BaseGraphNodeData";
import SaveLoadManager from "./SaveLoad";
import CustomEdge from "./Edges/CustomEdge";
import BaseEdgeData from "./Edges/BaseEdgeData";
import SideTab from "./Layout/SideTab";

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
  const [rfInstance, setRfInstance] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null); // Nodo selezionato
  const [importedNodes, setImportedNodes] = useState([]);

  const [showSideTab, setShowSideTab] = useState(false);

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
    if (!(node instanceof BaseGraphNodeData || typeof node == "string")) {
      console.error(
        "Node to Add is not an instance of BaseGraphNodeData nor a String"
      );
      return;
    }

    const newGraphNode = createNewNode();

    if (node instanceof BaseGraphNodeData) {
      newGraphNode.data.assign(node);
    } else if (node instanceof String) {
      const existingNode = nodes.find((n) => n.id === node);
      newGraphNode = existingNode?.data.assign(existingNode);
    }

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
    (changes) => {
      // console.log("Changes: ",changes);
      // let idOfSelected = null;
      // changes.map((change) => {
      //   if (change.selected) idOfSelected = change.id;
      // });

      // if (idOfSelected) {
      //   setSelectedNode(nodes.find((node) => node.id === idOfSelected));
      // } else {
      //   setSelectedNode(null);
      // }

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onNodeClick = (ev, element) => {
    if (element.type === "ResizableNode") {
      const clickedNode = nodes.find((x) => x.id === element.id);
      //console.log("ClickedNode: ", clickedNode);
      setSelectedNode(clickedNode.data);
    }
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
          if (res.status == 404) {
            console.warn(updatedNode, " Is not on the server");
            return false;
          } else throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        if (!data) return;

        console.log("Updated Node was on the server: ", data);
        if (func) func(updatedNode);
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

  const onClickCopy = (node) => {
    addExistingNode(node);
  };

  const onClickEdit = () => {
    setShowSideTab(true);
  };

  const onClickDelete = useCallback(
    (nodeId) => {
      rfInstance.deleteElements(nodes.find((n) => n.id === nodeId));
    },
    [rfInstance]
  );

  return (
    <Container fluid style={{ height: "90vh", padding: "1%" }}>
      <Row style={{ height: "100%" }}>
        {/*<NodeImporter
            addExistingNode={addExistingNode}
            importedNodes={importedNodes}
            />*/}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          nodeTypes={{
            ResizableNode: (nodeProps) => (
              <ResizableNode
                {...nodeProps}
                onClickCopy={onClickCopy}
                onClickDelete={onClickDelete}
                onClickEdit={onClickEdit}
              />
            ),
          }}
          edgeTypes={{
            CustomEdge: (edgeProps) => (
              <CustomEdge
                {...edgeProps}
                handleEdgeDataUpdate={handleEdgeDataUpdate}
              />
            ),
          }}
          onInit={setRfInstance}
          deleteKeyCode={"Backspace"} /* Cancella con il tasto Backspace */
          style={{ border: "1px solid black" }}
          fitView
        >
          <Panel>
            <button onClick={addNode} style={{ marginBottom: "10px" }}>
              Aggiungi Nodo
            </button>
          </Panel>
          <SaveLoadManager
            rfInstance={rfInstance}
            setEdges={setEdges}
            setNodes={setNodes}
          />
          <Controls />
          <Background />
        </ReactFlow>

        <SideTab showSideTab={showSideTab} setShowSideTab={setShowSideTab}>
          <NodeEditor
            selectedNode={selectedNode} // Pass the selected node
            handleNameChange={handleNameChange} // Pass the name change handler
            handleNodeUpdate={handleNodeUpdate} // Pass the node update handler
          />
        </SideTab>
      </Row>
    </Container>
  );
};

export default FlowDiagram;
