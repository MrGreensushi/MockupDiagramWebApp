import { v4 as uuidv4 } from "uuid";
import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  ReactFlowInstance,
  Edge,
  NodeChange,
  Node,
  addEdge,
  Connection,
  EdgeChange,
  applyEdgeChanges,
  ReactFlowJsonObject,
  MarkerType,
  Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ActivityNode, { ActivityNodeObject } from "./ActivityNode.tsx";
import Procedure from "../Procedure/Procedure.ts";
import Activity, {
  ActivityDescription,
  Phrase,
} from "../Procedure/Activity.ts";
import LoadNodes from "../Layout/LoadedNodes.tsx";
import EventNode, { EventNodeObject } from "./EventNode.tsx";
import CustomEdge from "./CustomEdge.tsx";
import DecisionNode, { DecisionNodeObject } from "./DecisionNode.tsx";
import TitleBar from "../Layout/TitleBar.tsx";
import OperationMenu from "../Layout/OperationMenu.tsx";
import NodeEditor from "./NodeEditor.tsx";
import {
  CategorizedDescriptions,
  createCategorizedDescriptions,
} from "../Misc/CategorizedDescription.ts";
import { ActiveLanguage } from "../App.tsx";

function ProcedureFlowDiagram(props: {
  activeProcedure: Procedure;
  setActiveProcedure: (procedureId: string) => void;
  handleActiveProcedureUpdate: (
    ReactFlowJsonObject: ReactFlowJsonObject
  ) => void;
  handleSubmitTitle: (title: string) => void;
  addProcedure: (newProcedure: Procedure) => void;
  getProcedure: (procedureId: string) => Procedure | undefined;
  updateProcedureById: (
    id: string,
    flow?: ReactFlowJsonObject,
    title?: string
  ) => void;
  getJSONFile: () => string;
  loadJSONFile: (json: string) => void;
  activityDescriptions: ActivityDescription[];
  updateActivitiesWithSameName: (toCopy: Activity) => void;
  resetEditor: () => void;
}) {
  const [nodes, setNodes] = useState<Node[]>(
    props.activeProcedure.flow.nodes ?? []
  );
  const [edges, setEdges] = useState<Edge[]>(
    props.activeProcedure.flow.edges ?? []
  );
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [selectedNodeId, setSelectedNodeId] = useState<string>();

  const [categorizedDescriptions, setCategorizedDescriptions] = useState<
    CategorizedDescriptions[]
  >([
    createCategorizedDescriptions(
      "Current Procedure",
      props.activityDescriptions
    ),
  ]);

  const flowRef = useRef(null);

  const propsFlow = props.activeProcedure.flow;

  const activeLanguage = useContext(ActiveLanguage);

  useEffect(() => {
    console.log("updated flow from editor");
    setNodes(propsFlow.nodes);
    setEdges(propsFlow.edges);
  }, [propsFlow]);

  useEffect(() => {
    setCategorizedDescriptions((old) =>
      old
        .filter((x) => x.category !== "Current Procedure")
        .concat(
          createCategorizedDescriptions(
            "Current Procedure",
            props.activityDescriptions
          )
        )
    );
  }, [props.activityDescriptions]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nodes) => applyNodeChanges(changes, nodes));
  }, []);

  const onNodesDelete = useCallback(
    (nodesToRemove: Node[]) => {
      var filtered = nodes.filter(
        (node) =>
          !nodesToRemove.find((nodeToRemove) => node.id === nodeToRemove.id)
      );
      saveNewNodes(filtered);
    },
    [nodes]
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((edges) => applyEdgeChanges(changes, edges));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    const type = getTypeNodeFromId(connection.source);

    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          markerEnd: { type: MarkerType.ArrowClosed },
          data: { sourceNodeType: type },
          type: "customEdge",
        },
        eds
      )
    );
  }, []);

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    setSelectedNodeId(undefined);
  }, []);

  /**
   * Update the procedure in the ProcedureEditor component by copying the rfInstance component.
   *
   * @remarks
   * This function assumes that `rfInstance` is not null or undefined.
   */
  const saveActiveProcedure = () => {
    console.log("SaveActiveProcedure");
    props.handleActiveProcedureUpdate(rfInstance!.toObject());
  };

  /**
   * Update the procedure in the ProcedureEditor component based on the input node array.
   *
   * @param {Node[]} newNodes - An array of new nodes to be saved.
   * @returns {void}
   */
  const saveNewNodes = (newNodes: Node[]) => {
    console.log("saveNewNodes");
    const viewport: Viewport = rfInstance
      ? rfInstance.getViewport()
      : { x: 0, y: 0, zoom: 1 };
    const reactJSONObject: ReactFlowJsonObject = {
      nodes: newNodes,
      edges: edges,
      viewport: viewport,
    };
    props.handleActiveProcedureUpdate(reactJSONObject);
  };

  /**
   * Changes the active procedure in the ProcedureEditor component to the specified procedure ID.
   *
   * This function performs the following actions:
   * 1. Saves the current active procedure.
   * 2. Resets the selected node ID to undefined.
   * 3. Sets the new active procedure using the provided procedure ID.
   *
   * @param procedureId - The ID of the procedure to set as active.
   */
  const changeActiveProcedure = (procedureId: string) => {
    saveActiveProcedure();
    setSelectedNodeId(undefined);
    //open the new sub procedure
    props.setActiveProcedure(procedureId);
  };

  const onNodeDoubleClick = useCallback(
    (_, node: Node) => {
      const activity = node.data.activity as Activity;
      if (!activity) return;

      // if the node is an activity node set the active procedure to the subProcedureId
      changeActiveProcedure(activity.subProcedureId);
    },
    [changeActiveProcedure]
  );

  //#region ActivityNode

  /**
   * Creates a new procedure with the given title and parent procedure ID.
   * Generates a unique ID for the new procedure and adds it to the list of procedures.
   *
   * @param title - The title of the new procedure.
   * @param parentProcedureId - The ID of the parent procedure.
   * @returns The newly created procedure.
   */
  const createNewProcedure = (title: string, parentProcedureId: string) => {
    //create new subProcedure and update the activity
    const id = uuidv4();
    const procedure = new Procedure(undefined, title, id, parentProcedureId);
    props.addProcedure(procedure);
    return procedure;
  };

  /**
   * Updates an activity by its ID with new phrases, details, name, and notes.
   *
   * @param {string} id - The ID of the activity to update.
   * @param {Phrase[]} [newPhrases] - Optional new phrases to update the activity with.
   * @param {string} [details] - Optional new details to update the activity with.
   * @param {string} [newName] - Optional new name to update the activity with.
   * @param {string} [newNotes] - Optional new notes to update the activity with.
   *
   * @returns {void}
   *
   * @throws Will log an error if no activity with the given ID is found.
   * @throws Will log an error if the node with the given ID is not an activity.
   */
  const updateActivityById = (
    id: string,
    newPhrases?: Phrase[],
    details?: string,
    newName?: string,
    newNotes?: string
  ) => {
    var cloneNodes: Node[] = [];
    setNodes((updatedNodes) => {
      cloneNodes = updatedNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          activity: node.data.activity,
        },
      }));
      return updatedNodes;
    });

    const index = cloneNodes.findIndex((x) => x.id === id);
    if (index < 0) {
      console.error("No activity with ID: " + id);
      return;
    }
    const activityToUpdate = cloneNodes[index].data.activity as Activity;
    if (!activityToUpdate) {
      console.error("Node" + id + " is not an activity");
      return;
    }

    const updatedActivity = activityToUpdate.cloneAndSet(
      newPhrases,
      details,
      newName,
      newNotes
    );

    cloneNodes[index].data.activity = updatedActivity;
    saveNewNodes([...cloneNodes]);
    props.updateActivitiesWithSameName(updatedActivity);
  };

  /**
   * Creates a new activity node with a unique ID, label, position, and associated sub-procedure.
   *
   * @param {ActivityDescription} [activityDescription] - Optional description of the activity.
   * @returns {ActivityNodeObject} The newly created activity node object.
   *
   * @remarks
   * - Generates a unique ID for the node using `uuidv4()`.
   * - The label is either the name from `activityDescription` or a default "Procedure" label with an incremented number.
   * - Creates a new sub-procedure associated with the node.
   * - Calculates the position of the node based on the center of the flow diagram or defaults to (0, 0).
   */
  const createNewActivityNode = useCallback(
    (activityDescription?: ActivityDescription) => {
      const id = uuidv4();
      const label =
        activityDescription?.name ?? "Procedure " + (nodes.length + 1);

      //create new Procedure to set as subProcedure of this node
      const subProcedure = createNewProcedure(label, props.activeProcedure.id);

      const position =
        rfInstance && flowRef.current
          ? rfInstance.screenToFlowPosition({
              x: (flowRef.current as Element).getBoundingClientRect().width / 2,
              y:
                (flowRef.current as Element).getBoundingClientRect().height / 2,
            })
          : { x: 0, y: 0 };
      const obj: ActivityNodeObject = {
        id: id,
        position: {
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        },
        data: {
          activity: new Activity(
            label,
            subProcedure.id,
            activityDescription?.content
          ),
        },
        type: "activityNode",
      };
      return obj;
    },
    [rfInstance, nodes.length, changeActiveProcedure]
  );

  /**
   * Instantiates a new activity node.
   * Then saves the new list of nodes using the `saveNewNodes` function.
   *
   */
  const addNode = useCallback(() => {
    const newNode = createNewActivityNode();
    saveNewNodes([...nodes, newNode]);
  }, [createNewActivityNode, nodes, saveNewNodes]);

  /**
   * Instantiates a new activity node based on the provided activity description.
   * Then saves the new list of nodes using the `saveNewNodes` function.
   *
   * @param {ActivityDescription} activityDescription - The description of the activity to instantiate.
   */
  const instantiateActivity = (activityDescription: ActivityDescription) => {
    const newNode = createNewActivityNode(activityDescription);
    saveNewNodes([...nodes, newNode]);
  };

  //#endregion

  const nodeTypes = useMemo(
    () => ({
      activityNode: ActivityNode,
      eventNode: EventNode,
      decisionNode: DecisionNode,
    }),
    []
  );

  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  /**
   * Retrieves the type of a node based on its ID.
   *
   * @param {string} id - The ID of the node to find.
   * @returns {string} The type of the node with the specified ID.
   */
  const getTypeNodeFromId = (id: string) => {
    var node = nodes[0];
    //setNodes has always the updated value
    setNodes((prevNodes) => {
      node = prevNodes.find((x) => x.id === id) ?? prevNodes[0];
      return prevNodes;
    });
    return node.type;
  };

  //#region EventNode & DecisionNode

  /**
   * Callback function to handle changes to an event or decision node.
   *
   * @param id - The unique identifier of the node to be updated.
   * @param newName - (Optional) The new name for the node. If not provided, the existing name will be retained.
   * @param newDetails - (Optional) The new details for the node. If not provided, the existing details will be retained.
   */
  const onEventOrDecisionChanged = useCallback(
    (id: string, newName?: string, newDetails?: string) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                name: newName ?? node.data.name,
                details: newDetails ?? node.data.details,
              },
            };
          } else {
            return node;
          }
        })
      );
    },
    []
  );

  const updatedActiveEventOrDecision = useCallback(
    (newName?: string, newDetails?: string) => {
      if (!selectedNodeId) return;
      onEventOrDecisionChanged(selectedNodeId, newName, newDetails);
    },
    [selectedNodeId, onEventOrDecisionChanged]
  );

  /**
   * Creates a new event node object with a unique ID, label, data, and position.
   * The position is calculated based on the center of the flow reference element.
   *
   * @returns {EventNodeObject} The newly created event node object.
   */
  const createNewEventNode = useCallback(() => {
    const id = uuidv4();
    const label = "Event " + nodes.length;
    const data = { name: label, details: "" };
    const position =
      rfInstance && flowRef.current
        ? rfInstance.screenToFlowPosition({
            x: (flowRef.current as Element).getBoundingClientRect().width / 2,
            y: (flowRef.current as Element).getBoundingClientRect().height / 2,
          })
        : { x: 0, y: 0 };
    const obj: EventNodeObject = {
      id: id,
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0,
      },
      data: data,
      type: "eventNode",
    };
    return obj;
  }, [rfInstance, nodes.length]);

  /**
   * Adds a new event node to the existing list of nodes.
   */
  const addEventNode = () => {
    const newNode = createNewEventNode();
    saveNewNodes([...nodes, newNode]);
  };

  /**
   * Creates a new decision node object with a unique ID, label, data, and position.
   * The position is calculated based on the center of the current flow diagram.
   *
   * @returns {DecisionNodeObject} The newly created decision node object.
   *
   * @callback
   */
  const createNewDecisionNode = useCallback(() => {
    const id = uuidv4();
    const label = "Decision " + nodes.length;
    const data = { name: label, details: "" };
    const position =
      rfInstance && flowRef.current
        ? rfInstance.screenToFlowPosition({
            x: (flowRef.current as Element).getBoundingClientRect().width / 2,
            y: (flowRef.current as Element).getBoundingClientRect().height / 2,
          })
        : { x: 0, y: 0 };
    const obj: DecisionNodeObject = {
      id: id,
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0,
      },
      data: data,
      type: "decisionNode",
    };
    return obj;
  }, [rfInstance, nodes.length]);

  /**
   * Adds a new decision node to the existing list of nodes.
   */
  const addDecisionNode = () => {
    const newNode = createNewDecisionNode();
    saveNewNodes([...nodes, newNode]);
  };
  //#endregion

  /**
   * Adds a new CategorizedDescription to the existing list of CategorizedDescriptions.
   */
  const updateCategorizedDescriptions = (toAdd: CategorizedDescriptions) => {
    setCategorizedDescriptions((previous) => [...previous, toAdd]);
  };
  return (
    <Container fluid>
      <Row>
        <TitleBar
          activeProcedure={props.activeProcedure}
          changeActiveProcedure={changeActiveProcedure}
          handleSubmitTitle={props.handleSubmitTitle}
          getProcedure={props.getProcedure}
        />

        <OperationMenu
          addNode={addNode}
          addEventNode={addEventNode}
          addDecisionNode={addDecisionNode}
          rfInstance={rfInstance!}
          procedureTitle={
            props.activeProcedure.title ?? "Procedure senza titolo"
          }
          getJSONFile={() => {
            saveActiveProcedure();
            return props.getJSONFile();
          }}
          loadJSONFile={props.loadJSONFile}
          resetEditor={props.resetEditor}
          updateCategorizedDescriptions={updateCategorizedDescriptions}
        />
      </Row>
      <Row className="p-2">
        <Col xs={2}>
          <LoadNodes
            instantiateActvity={instantiateActivity}
            categorizedDescriptions={categorizedDescriptions}
          />
        </Col>
        <Col>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={setRfInstance}
            onPaneClick={onPaneClick}
            deleteKeyCode={["Backspace", "Delete"]}
            style={{ border: "1px solid black" }}
            ref={flowRef}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodesDelete={onNodesDelete}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </Col>

        <Col xs={3}>
          <NodeEditor
            key={"NodeEditor:" + selectedNodeId + ":" + activeLanguage}
            procedure={props.activeProcedure}
            selectedNode={
              selectedNodeId ? rfInstance?.getNode(selectedNodeId) : undefined
            }
            updateActivity={updateActivityById}
            updateEventOrDecision={updatedActiveEventOrDecision}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default ProcedureFlowDiagram;
