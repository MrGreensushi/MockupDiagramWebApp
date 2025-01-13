import "@xyflow/react/dist/style.css";
import React, { useMemo } from "react";
import { Row } from "react-bootstrap";
import { ReactFlow } from "@xyflow/react";
import SceneNode from "./SceneNode.tsx";
import Story from "../StoryElements/Story.ts";

function StoryFlowChartViewer (props: {story: Story, id: string}) {  
  const nodeTypes = useMemo(() => ({sceneNode: SceneNode}), []);
  return (
    <Row style={{ height: "100%" }} className="gx-0">
      <ReactFlow key={props.id}
        nodes={props.story.flow.nodes.map(node => {return {...node, selected: false}}) ?? []}
        edges={props.story.flow.edges ?? []}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{minZoom: 0}}
        style={{ border: "1px solid black" }}
        className="gx-0" />
    </Row>
  );
};

export default StoryFlowChartViewer;