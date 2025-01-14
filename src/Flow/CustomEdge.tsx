import React, { useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  MarkerType,
} from "@xyflow/react";

function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
  } = props;

  // Determina lo stile in base al tipo del nodo sorgente
  const isEventNode = data?.sourceNodeType === "eventNode";
  const isDecisionNode = data?.sourceNodeType === "decisionNode";
  const isTriggerHandle = props.sourceHandleId === "trigger-handle";

  // Calcola il percorso dell'edge
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleStyle = useMemo(() => {
    if (!isEventNode || !isDecisionNode) return {};
    return {
      stroke: isTriggerHandle ? "blue" : "red",
    };
  }, [isEventNode, isTriggerHandle]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={handleStyle}
        className={`react-flow__edge-path ${data?.sourceNodeType} ${props.sourceHandleId}`}
        data-testid={`edge-${id}`}
        markerEnd={markerEnd}
      />
    </>
  );
}

export default CustomEdge;
