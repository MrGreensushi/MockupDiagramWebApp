import { Background, Handle, HandleType, Position } from "@xyflow/react";
import React, { useMemo } from "react";

function NamedHandle(props: {
  id: string;
  className?: string;
  handlePosition: Position;
  handleStyle?: React.CSSProperties;
  positionText?: React.CSSProperties;
  text: string;
  type: HandleType;
}) {
  const textStyle = useMemo(() => {
    var style: React.CSSProperties = {
      fontSize: "10px",
      textAlign: "center",
      position: "absolute",
      ...props.positionText,
    };

    return style;
  }, [props.positionText]);

  return (
    <div className={props.className}>
      <Handle
        className={props.className}
        type={props.type}
        position={props.handlePosition}
        style={props.handleStyle}
        id={props.id}
      />
      <div style={textStyle}>{props.text}</div>
    </div>
  );
}

export default NamedHandle;
