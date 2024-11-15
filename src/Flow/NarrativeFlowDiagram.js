import { useCallback, useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import {
  addEdge,
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  Panel,
  getIncomers,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid"; // Per generare id univoci
import SaveLoadManager from "./SaveLoad";
import SideTab from "../Layout/SideTab";
import NarratorNode from "../Nodes/NodesClasses/NarratorNode";
import NarratorNodeEditor from "../Features/NarratorNodeEditor";
import NarrativeNodeDiv from "../Nodes/NarrativeNodeDiv";
import OneLabelEdge from "../Edges/OneLabelEdge";
import SceneEditor from "../Layout/SceneEditor.tsx";

// const nodeTypes = {
//   ResizableNode,
// };

// const EdgeTypes = {
//   CustomEdge,
// };
// const BaseStyle = {
//   background: "#fff",
//   border: "1px solid black",
//   borderRadius: 2,
//   fontSize: 12,
// };
const TYPENAME = "CustomNode";

// const nodeTypes = (onClickDelete, onClickEdit,updateEdges) => ({
//   CustomNode: (nodeProps) => (
//     <NarrativeNodeDiv
//       {...nodeProps}
//       onClickDelete={onClickDelete}
//       onClickEdit={onClickEdit}
//       updateEdges={updateEdges}
//       //updateEdgesSourceHandles={updateEdgesSourceHandles}
//     />
//   ),
// });

const EDGETYPENAME = "CustomEdge";
// const edgeTypes = (handleEdgeDataUpdate) => ({
//   CustomEdge: (edgeProps) => (
//     <OneLabelEdge {...edgeProps} handleEdgeDataUpdate={handleEdgeDataUpdate} />
//   ),
// });

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

  const createNewNode = useCallback(() => {
    const id = uuidv4();
    const name = "Node " + nodes.length;
    return {
      id: id,
      data: new NarratorNode(name, id),
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      type: TYPENAME,
    };
  }, [nodes.length]);

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
      try {
        const existingNodeData = getNodeDataFromId(node);
        newGraphNode.data = existingNodeData.copy();
      } catch (error) {
        console.error(error);
        return;
      }
    }
    console.log("New Node: ", newGraphNode);
    setNodes((oldNodes) => [...oldNodes, newGraphNode]);
  };

  const onConnect = useCallback(
    (connection) => {
      connection.type = EDGETYPENAME;
      connection.label = null;

      //Trova una sourceHandle che non è gia occupata
      connection.sourceHandle = getFreeHandleId(connection.source);

      //update the NextNodes parametere inside the source Narrator node
      try {
        const sourceNodeData = getNodeDataFromId(connection.source);
        console.log("Source node data: ", sourceNodeData);
        sourceNodeData.NextNodes.push(connection.target);

        updateEdgesSourceHandles(sourceNodeData.id);
      } catch (error) {
        console.error(error);
      }

      console.log("Connection: ", connection);
      setEdges((eds) => addEdge(connection, eds));
    },
    [nodes, edges]
  );

  const handleEdgeDataUpdate = (edgeId, newData) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId ? { ...edge, label: newData } : edge
      )
    );
  };

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onNodeClick = (ev, element) => {
    if (element.type === TYPENAME) {
      try {
        const clickedNodeData = getNodeDataFromId(element.id);
        setSelectedNode(clickedNodeData);
      } catch (error) {
        console.error(error);
      }
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
    /*if (!(updatedNode instanceof NarratorNode)) {
      throw new Error(updatedNode, " is not an instanceof BaseGraphNodeData");
    }*/
    console.log(updatedNode);

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
    console.log(selectedNode);
    setShowSideTab(true);
  };

  const onClickDelete = (nodeId) => {
    console.log("Deleting node: ", nodeId);
    rfInstance.deleteElements({
      nodes: [{ id: nodeId }],
    });
  };

  const getNodeDataFromId = useCallback(
    (nodeId, checkForErrors = true) => {
      const node = nodes.find((x) => x.id === nodeId);

      if (!checkForErrors) return node;

      if (node === null || node === undefined)
        throw new Error("Node not found: ", nodeId);
      /*else if (!(node.data instanceof NarratorNode))
        throw new Error(
          "Node data is not an instance of NarratorNode: ",
          node.data
        );*/
      else return node.data;
    },
    [nodes]
  );

  const getOutgoingConnectionsFromNodeId = useCallback(
    (nodeId) => {
      return edges.filter((x) => x.source === nodeId);
    },
    [edges]
  );

  const onNodeDelete = useCallback(
    //for each node deleted remove its ID from the NEXT NODES array of the parents
    (deletedArray) => {
      deletedArray.forEach((deleted) => {
        console.log("deleted", deleted);
        const incomers = getIncomers(deleted, nodes, edges);

        incomers.forEach((node) => {
          node.data.removeNextNodeId(deleted.id);
        });

        //delete outgoing and ingoing edges:
        const newEdges = edges.filter(
          (x) => x.target !== deleted.id && x.source !== deleted.id
        );

        setEdges([...newEdges]);
      });
    },
    [nodes, edges]
  );

  const updateEdgesSourceHandles = (nodeId) => {
    const outgoingEdges = getOutgoingConnectionsFromNodeId(nodeId);

    // Controlla e aggiorna i sourceHandle duplicati
    const updatedEdges = outgoingEdges.map((edge, index) => {
      let newSourceHandle = edge.sourceHandle;
      let duplicateExists = false;

      // Incrementa finché non è unico
      do {
        duplicateExists = outgoingEdges.some(
          (otherEdge, otherIndex) =>
            otherIndex !== index && otherEdge.sourceHandle === newSourceHandle
        );
        if (duplicateExists) {
          newSourceHandle = String(parseInt(newSourceHandle, 10) + 1); // Incrementa il valore
        }
      } while (duplicateExists);

      return { ...edge, sourceHandle: newSourceHandle };
    });

    // Aggiorna gli edges con lo useState setEdges
    setEdges((prevEdges) =>
      prevEdges.map(
        (edge) =>
          updatedEdges.find((updatedEdge) => updatedEdge.id === edge.id) || edge
      )
    );
  };

  const getFreeHandleId = (nodeId) => {
    const outgoing = getOutgoingConnectionsFromNodeId(nodeId);
    var freeHandleId = undefined;
    var idCounter = 0;
    console.log("Outgoin: ", outgoing);
    while (freeHandleId === undefined && idCounter < 5) {
      if (!outgoing.some((x) => x.sourceHandle === `${idCounter}`))
        freeHandleId = `${idCounter}`;
      idCounter++;
    }
    return freeHandleId;
  };

  const nodeTypes = useMemo(
    () => ({
      CustomNode: (nodeProps) => (
        <NarrativeNodeDiv
          {...nodeProps}
          onClickDelete={onClickDelete}
          onClickEdit={onClickEdit}
        />
      ),
    }),
    [onClickDelete, onClickEdit]
  );

  const edgeTypes = useMemo(
    () => ({
      CustomEdge: (edgeProps) => (
        <OneLabelEdge
          {...edgeProps}
          handleEdgeDataUpdate={handleEdgeDataUpdate}
        />
      ),
    }),
    [handleEdgeDataUpdate]
  );

  return (
    <Container fluid style={{ height: "90vh", padding: "1%" }}>
      <Row style={{ height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setRfInstance}
          deleteKeyCode={"Backspace"} /* Cancella con il tasto Backspace */
          style={{ border: "1px solid black" }}
          onNodesDelete={onNodeDelete}
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
          {showSideTab &&
            <SceneEditor 
              sceneJson={selectedNode.sceneData}
              saveScene={(sceneJson) => handleNodeUpdate({...selectedNode, sceneData: sceneJson})}/>
          }
          {/*<NarratorNodeEditor
            selectedNode={selectedNode} // Pass the selected node
            handleNameChange={handleNameChange} // Pass the name change handler
            handleNodeUpdate={handleNodeUpdate} // Pass the node update handler
            getNodeDataFromId={getNodeDataFromId}
            getOutgoingConnectionsFromNodeId={getOutgoingConnectionsFromNodeId}
          />*/}
        </SideTab>
      </Row>
    </Container>
  );
};

export default NarrativeFlowDiagram;
