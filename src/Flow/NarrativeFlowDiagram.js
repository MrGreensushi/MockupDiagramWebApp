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
import { BaseGraphNodeData } from "../Nodes/NodesClasses/BaseGraphNodeData";
import SaveLoadManager from "../SaveLoad";
import CustomEdge from "../Edges/CustomEdge";
import BaseEdgeData from "../Edges/BaseEdgeData";
import SideTab from "../Layout/SideTab";
import NarratorNode from "../Nodes/NodesClasses/NarratorNode";
import NarratorNodeEditor from "../Nodes/NodeEditing/NarratorNodes/NarratorNodeEditor";
import CharacterForm from "../Features/CharacterForm";

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

const NarrativeFlowDiagram = ({ flow, onClickSetSubFlow }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null); // Nodo selezionato
  const [showSideTab, setShowSideTab] = useState(false);

  // useEffect(() => {
  //   setEdges([...flow.edges]);
  //   setNodes([...flow.nodes]);
  // }, [flow]);

  const createNewNode = () => {
    const id = uuidv4();
    const name="Node " + nodes.length;
    return {
      id: id,
      data: new NarratorNode(name,id),
      position: { x: Math.random() * 200, y: Math.random() * 200 },
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
     if (!(node instanceof NarratorNode || typeof node == "string")) {
       console.error(
         "Node to Add is not an instance of NarratorNode nor a String"
       );
       return;
     }
     const newGraphNode = createNewNode();
     if (node instanceof NarratorNode) {
       newGraphNode.data = node.copy();
     } else if (node instanceof String) {
       const existingNode = nodes.find((n) => n.id === node);
       newGraphNode.data= existingNode?.data.copy();
     }
     console.log("New Node: ", newGraphNode);
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
    if (!(updatedNode instanceof NarratorNode)) {
      throw new Error(updatedNode, " is not an instanceof BaseGraphNodeData");
    }

    setNodes((els) =>
      els.map((el) =>
        el.id === updatedNode.id ? { ...el, data: updatedNode } : el
      )
    );

    //Se il nodo modificato faceva parte di quelli prefatti, aggiorna il server!
    //Successivamente aggiorna anche i nodi importati se era uno dei nodi sel server
    // BackendComm.getNode(updatedNode, () => {
    //   BackendComm.postNode(updatedNode, updateImportedNode);
    // });
  };

  const onClickCopy = (node) => {
    addExistingNode(node);
  };

  const onClickEdit = () => {
    setShowSideTab(true);
  };

  const onClickDelete = (nodeId) => {
    console.log("Deleting node: ",nodeId)
    var newNodes = [];
    nodes.forEach((node) => {
      if (node.id !== nodeId) newNodes.push(node);
    });
    setNodes(newNodes);
  };

  return (
    <Container fluid style={{ height: "90vh", padding: "1%" }}>
      <Row style={{ height: "100%" }}>
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
                onClickOpenSubFlow={null}
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
            <CharacterForm />
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
          <NarratorNodeEditor
            selectedNode={selectedNode} // Pass the selected node
            handleNameChange={handleNameChange} // Pass the name change handler
            handleNodeUpdate={handleNodeUpdate} // Pass the node update handler
          />
        </SideTab>
      </Row>
    </Container>
  );
};

export default NarrativeFlowDiagram;
