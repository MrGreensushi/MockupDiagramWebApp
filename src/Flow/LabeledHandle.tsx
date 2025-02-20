"use client";
 
import React from "react";
import { Handle, HandleProps } from "@xyflow/react";

const flexDirections = {
  top: "flex-col",
  right: "flex-row-reverse",
  bottom: "flex-col-reverse",
  left: "flex-row",
};

const LabeledHandle = React.forwardRef<
  HTMLDivElement,
  HandleProps &
  React.HTMLAttributes<HTMLDivElement> &
  {
    title?: string;
    handleClassName?: string;
    labelClassName?: string;
  }
>(({ className, labelClassName, handleClassName, title, position, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      title={title}
      className={`handle-text ${flexDirections[position] ?? ""} ${className ?? ""}`}
    >
      <Handle position={position} className={handleClassName} {...props}/>
      <label className={`px-2 ${labelClassName ?? ""}`} style={{visibility: title ? "visible" : "hidden"}}>
        {title ? title : "Nessun titolo"}
      </label>
    </div>
  ),
);
 
LabeledHandle.displayName = "LabeledHandle";
 
export { LabeledHandle };