import { React, memo, useEffect, useState } from "react";
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/react";
import BaseEdgeData from "./BaseEdgeData";

const EdgeLabel = ({
  transform,
  label,
  style,
  handleAddLabel,
  isStartLabel,
}) => {
  const [isEditing, setIsEditing] = useState(false); // Stato per modalità di modifica
  const [newLabel, setNewLabel] = useState(label); // Stato per il nuovo testo del label

  useEffect(()=>{
    setNewLabel(label); //keep NewLabel updated
  },[label])

  const handleNewLabel = () => {
    
    handleAddLabel("new Label", isStartLabel);
  };

  const modifiedStyle = () => {
    var newStyle = {
      ...style,
      transform: transform,
      pointerEvents: "all"
    };

    //if (label == null) newStyle = { ...newStyle, pointerEvents: "all" };
    return newStyle;
  };

  // Quando si fa doppio click, attiva la modalità di modifica
  const handleDoubleClick = () => {
    console.log("DoubleClick")
    if (newLabel != null) setIsEditing(true);
  };

  // Gestisce l'aggiornamento del testo quando si esce dall'input o si preme invio
  const handleBlur = () => {
    setIsEditing(false); // Esce dalla modalità di modifica
    if (newLabel !== label) {
      handleAddLabel(newLabel, isStartLabel); // Aggiorna il testo del label
    }
  };

  // Gestisce il tasto "Invio" per confermare il testo
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div
      style={modifiedStyle()}
      className="nodrag nopan"
      onDoubleClick={handleDoubleClick} // Aggiungi l'evento di doppio click
    >
      {isEditing ? (
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onBlur={handleBlur} // Quando si perde il focus, conferma il nuovo testo
          onKeyDown={handleKeyDown} // Gestisce il tasto "Enter"
          autoFocus // Imposta automaticamente il focus sull'input
        />
      ) : (
        label != null && label
      )}

      {label == null && <button onClick={handleNewLabel}>+</button>}
    </div>
  );
};

const CustomEdge = ({ id, data, handleEdgeDataUpdate, ...props }) => {
  const [edgePath] = getBezierPath(props);

  const labelStyle = {
    position: "absolute",
    background: "#ffcc00",
    padding: 5,
    borderRadius: 5,
    fontSize: 8,
    fontWeight: 700,
  };

  const handleDataUpdate = (newLabel, isStartLabel) => {
    const newdata = BaseEdgeData.initialize(data);
    if (isStartLabel) newdata.startLabel = newLabel;
    else newdata.endLabel = newLabel;
    handleEdgeDataUpdate(id, newdata);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} {...props} />
      <EdgeLabelRenderer>
        <EdgeLabel
          label={data.startLabel}
          style={labelStyle}
          transform={`translate(-50%, 10%) translate(${props.sourceX}px,${props.sourceY}px)`}
          handleAddLabel={handleDataUpdate}
          isStartLabel={true}
        />
        <EdgeLabel
          label={data.endLabel}
          style={labelStyle}
          transform={`translate(-50%, -110%) translate(${props.targetX}px,${props.targetY}px)`}
          handleAddLabel={handleDataUpdate}
          isStartLabel={false}
        />
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(CustomEdge);

// {data.startLabel && (
//     <EdgeLabel
//       label={data.startLabel}
//       style={labelStyle}
//       transform={`translate(-50%, 10%) translate(${props.sourceX}px,${props.sourceY}px)`}
//     />
//   )}
//   {data.endLabel && (
//     <EdgeLabel
//       label={data.endLabel}
//       style={labelStyle}
//       transform={`translate(-50%, -110%) translate(${props.targetX}px,${props.targetY}px)`}
//     />
//   )}
