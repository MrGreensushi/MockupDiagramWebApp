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
import ResizableNode from "../Nodes/ResizableNode";
import NodeEditor from "../Nodes/NodeEditing/NodeEditor";
import NodeImporter from "../Nodes/NodeImporting/NodeImporter";
import { BaseGraphNodeData } from "../Nodes/NodesClasses/BaseGraphNodeData";
import SaveLoadManager from "./SaveLoad";
import CustomEdge from "../Edges/CustomEdge";
import BaseEdgeData from "../Edges/BaseEdgeData";
import SideTab from "../Layout/SideTab";
import BackendComm from "../BackEndCommunication/BackendComm";
import FlowDescriptor from "./FlowDescriptor";
import StartEndNode from "../Nodes/StartEndNode";

// const nodeTypes = {
//   ResizableNode,
// };

// const EdgeTypes = {
//   CustomEdge,
// };
const BaseStyle = {
  background: "#fff",
  border: "1px solid black",
  borderRadius: 2,
  fontSize: 12,
};

const FlowDiagram = ({ flow, onClickSetSubFlow }) => {
  const [nodes, setNodes] = useState(flow.nodes);
  const [edges, setEdges] = useState(flow.edges);
  const [rfInstance, setRfInstance] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null); // Nodo selezionato
  const [importedNodes, setImportedNodes] = useState([]);

  const [showSideTab, setShowSideTab] = useState(false);

  //Initialize importedNodes
  useEffect(() => {
    BackendComm.getNodes((data) => {
      //Creo un array di BaseGraphNodeData a partire dalla risposta dal server
      var nodeArray = [];
      data.map((importedInfo) => {
        const newGraphNode =
          BaseGraphNodeData.initializeFromImportedInfo(importedInfo);
        nodeArray.push(newGraphNode);
      });
      setImportedNodes(nodeArray);
      console.log(nodeArray); // Set the nodes with the fetched data
    });
  }, []);

  useEffect(() => {
    setEdges([...flow.edges]);
    setNodes([...flow.nodes]);
  }, [flow]);

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
    BackendComm.getNode(updatedNode, () => {
      BackendComm.postNode(updatedNode, updateImportedNode);
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

  const onClickDelete = (nodeId) => {
    var newNodes = [];
    nodes.forEach((node) => {
      if (node.id !== nodeId) newNodes.push(node);
    });
    setNodes(newNodes);
  };

  const onClickOpenSubFlow = (nodeId) => {
    //
    const node = nodes.find((x) => x.id === nodeId);
    if (!node) throw new Error("NodeId not found: ", nodeId);

    const newFlow = createStartEndNodes(node);

    const subflow = node.data.subFlow
      ? node.subFlow
      : new FlowDescriptor(newFlow.edges, newFlow.nodes, node.data.label);

    const updatedFlow = new FlowDescriptor(
      edges,
      nodes,
      flow.name,
      flow.isMainFlow
    );

    console.log("Subflot to setActive: ", subflow);

    onClickSetSubFlow(updatedFlow, subflow);
  };

  const createStartEndNodes = (initialNode) => {
    const idStart = uuidv4();
    const idEnd = uuidv4();
    const xPos = 200;

    // // Ottieni le dimensioni del viewport
    // const viewportWidth = rfInstance.getViewport().x;
    // const viewportHeight = window.innerHeight;

    // // Margini di sicurezza per i nodi rispetto ai bordi del viewport
    // const margin = 50;
    // // Calcola la posizione X dei nodi, rispettando i bound del viewport
    // const startX = Math.max(-viewportWidth / 2 + margin, -300); // Massima posizione X per startNode, non oltre -300
    // const endX = Math.min(viewportWidth / 2 - margin, 300); // Massima posizione X per endNode, non oltre 300

    const startNode = {
      id: idStart,
      data: { isStart: true },
      position: { x: -xPos, y: 0 },
      type: "StartEndNode",
      style: BaseStyle,
    };
    const endNode = {
      id: idEnd,
      data: { isStart: false },
      position: { x: xPos, y: 0 },
      type: "StartEndNode",
      style: BaseStyle,
    };

    const edge = {
      id: "Start-End-Edge",
      source: idStart,
      target: idEnd,
      type: "CustomEdge",
      data: new BaseEdgeData(null, null),
    };

    const toRet = {
      nodes: [startNode, endNode],
      edges: [edge],
    };

    console.log("Start End initial Flow: ", toRet);
    return toRet;
  };

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
                onClickOpenSubFlow={onClickOpenSubFlow}
              />
            ),
            StartEndNode: (nodeProps) => <StartEndNode {...nodeProps} />,
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
          {flow.isMainFlow && (
            <SaveLoadManager
              rfInstance={rfInstance}
              setEdges={setEdges}
              setNodes={setNodes}
            />
          )}
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
