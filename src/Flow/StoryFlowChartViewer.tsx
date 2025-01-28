import "@xyflow/react/dist/style.css";
import React, { useMemo } from "react";
import { Row } from "react-bootstrap";
import { Node, ReactFlow } from "@xyflow/react";
import SceneNode from "./SceneNode.tsx";
import Story from "../StoryElements/Story.ts";

function StoryFlowChartViewer (props: {
  story: Story,
  storyId: string,
}) {  
  const nodeTypes = useMemo(() => ({sceneNode: SceneNode}), []);
  return (
    <Row className="gx-0 h-100">
      <ReactFlow key={props.storyId}
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
        fitViewOptions={{minZoom: 0, padding: 0.025}}
        className="gx-0" />
    </Row>
  );
};

export default StoryFlowChartViewer;