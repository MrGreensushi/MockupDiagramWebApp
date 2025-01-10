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
    if (!isEventNode) return { strokeWidth: 2 };
    return {
      strokeWidth: 2,
      strokeDasharray: "5,5",
      stroke: isTriggerHandle ? "blue" : "red",
    };
  }, [isEventNode, isTriggerHandle]);

  const label = useMemo(() => {
    if (!isEventNode) return undefined;
    return isTriggerHandle ? "Triggers" : "Interrupts";
  }, [isEventNode, isTriggerHandle]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={handleStyle}
        className={`react-flow__edge-path`}
        data-testid={`edge-${id}`}
        markerEnd={markerEnd}
      />
    </>
  );
}

export default CustomEdge;
