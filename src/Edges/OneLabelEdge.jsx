import { React, memo, useEffect, useState } from "react";
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/react";
import BaseEdgeData from "./BaseEdgeData";
import DoubleClickModifies from "../Features/DoubleClickModifies";

const EdgeLabel = ({ transform, label, style, handleAddLabel }) => {
  const handleNewLabel = () => {
    handleAddLabel("new Label");
  };

  const modifiedStyle = () => {
    var newStyle = {
      ...style,
      transform: transform,
      pointerEvents: "all",
    };

    return newStyle;
  };

  return (
    <>
      {label != null && (
        <DoubleClickModifies
          style={modifiedStyle()}
          divClassName={"nodrag nopan"}
          updateFunction={(newValue) => {
            handleAddLabel(newValue);
          }}
          value={label}
        />
      )}

      {label == null && (
        <div style={modifiedStyle()} className="nodrag nopan">
          <button onClick={handleNewLabel}>+</button>
        </div>
      )}
    </>
  );
};

const OneLabelEdge = ({ id, label, handleEdgeDataUpdate, ...props }) => {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  const labelStyle = {
    position: "absolute",
    background: "#ffcc00",
    padding: 5,
    borderRadius: 5,
    fontSize: 8,
    fontWeight: 700,
  };

  const handleDataUpdate = (newLabel) => {
    handleEdgeDataUpdate(id, newLabel);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} {...props} />
      <EdgeLabelRenderer>
        <EdgeLabel
          label={label}
          style={labelStyle}
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
          handleAddLabel={handleDataUpdate}
        />
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(OneLabelEdge);
