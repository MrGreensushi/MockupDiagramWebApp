import {
  Handle,
  Position,
  NodeToolbar,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { memo, useEffect, useState, useCallback } from "react";
import { Button, ButtonGroup } from "react-bootstrap";


const theme = {
  bg: "#fff",
  primary: "#ff0072",

  nodeBg: "#f2f2f5",
  nodeColor: "#222",
  nodeBorder: "#222",

  minimapMaskBg: "#f2f2f5",

  controlsBg: "#fefefe",
  controlsBgHover: "#eee",
  controlsColor: "#222",
  controlsBorder: "#ddd",
};

// const NarrativeNodeDiv = ({ data, selected, onClickEdit, onClickDelete }) => {
//   const maxHandlesCount = 5;
//   return (
//     <div className={`narrative-node ${selected ? "selected" : ""}`}>
//       {data.label}
//       <Handle type="target" position={Position.Top} />
//       {/* Render degli Handle source */}
//       {Array.from({ length: maxHandlesCount }).map((value, idx) => {
//         const leftPosition = `${(idx + 1) * (100 / (maxHandlesCount + 1))}%`;
//         const opacityClass = data.NextNodes.length > idx ? ":show" : "";
//         return (
//           <div  key={idx} className="handleDiv">
//             <Handle
//               className={`handle${opacityClass}`}
//               key={idx}
//               type="source"
//               position={Position.Bottom}
//               id={`${idx}`}
//               style={{ left: leftPosition }}
//             />
//           </div>
//         );
//       })}
//       <NodeToolbar>
//         <ButtonGroup>
//           <Button variant="secondary" onClick={onClickEdit}>
//             <i className="bi bi-pencil" aria-label="edit" />
//           </Button>
//           <Button variant="secondary" onClick={() => onClickDelete(data.id)}>
//             <i className="bi bi-trash3" aria-label="delete" />
//           </Button>
//         </ButtonGroup>
//       </NodeToolbar>
//     </div>
//   );
// };

const NarrativeNodeDiv = ({ data, selected, onClickEdit, onClickDelete }) => {
  return (
    <div className={`narrative-node ${selected ? "selected" : ""}`}>
      {data.label}
      <Handle type="target" position={Position.Top} />
      <DinamicSourceHandles
        id={data.id}
        initialHandleCount={data.NextNodes.length}
      />
      <NodeToolbar>
        <ButtonGroup>
          <Button variant="secondary" onClick={onClickEdit}>
            <i className="bi bi-pencil" aria-label="edit" />
          </Button>
          <Button variant="secondary" onClick={() => onClickDelete(data.id)}>
            <i className="bi bi-trash3" aria-label="delete" />
          </Button>
        </ButtonGroup>
      </NodeToolbar>
    </div>
  );
};

const DinamicSourceHandles = ({ id, initialHandleCount }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [handleCount, setHandleCount] = useState(initialHandleCount);

  const onConnect = () => {
    setHandleCount((prevCount) => prevCount + 1);

    setTimeout(() => {

      try {
        console.log("Trying to update node internals");
        updateNodeInternals(id);
        console.log("Awaited");
    } catch (error) {
        console.error("Error in updateNodeInternals:", error);
    }
      console.log("Inside setTimeout");
      updateNodeInternals(id);
      console.log("Awaited")
    }, 100);
  };

  return (
    <>
      {handleCount > 0 ? (
        Array.from({ length: handleCount }).map((_, index) => {
          const leftPosition = `${(index + 1) * (100 / (handleCount + 1))}%`;
          return (
            <Handle
              key={index}
              type="source"
              position="bottom"
              id={`${index}`}
              style={{ left: leftPosition }}
              onConnect={onConnect}
            />
          );
        })
      ) : (
        <Handle
          key="0"
          type="source"
          position="bottom"
          id={`${0}`}
          onConnect={onConnect}
        />
      )}
    </>
  );
};

export default memo(NarrativeNodeDiv);
