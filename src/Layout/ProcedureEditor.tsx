import React, { useState } from "react";
import SubProcedure from "../Procedure/SubProcedure.ts";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";

function ProcedureEditor() {
  const [procedure, setProcedure] = useState(new Procedure());
  const [subProcedure, setSubProcedure] = useState<SubProcedure | undefined>();

  const handleSubmitTitle = (title: string) => {
    setProcedure((prevProcedure) => {
      const newProcedure = prevProcedure.cloneAndSetTitle(title);
      console.log(newProcedure);
      return newProcedure;
    });
  };

  const handleSubProcedure = (newSubProcedure: SubProcedure) => {
    //TODO: if subProcedure is empty add an output Node
    console.log("handleSubProcedure");

    //update subProcedureParent
    newSubProcedure.parent =
      subProcedure ?? new SubProcedure(procedure.flow, procedure.title);
    setSubProcedure(newSubProcedure);
  };

  const handleProcedureUpdate = (reactFlowObject: ReactFlowJsonObject) => {
    setSubProcedure((prevSub) => {
      if (prevSub) {
        return prevSub.cloneAndAddFlow(reactFlowObject);
      }
      setProcedure((prevProcedure) =>
        prevProcedure.cloneAndAddFlow(reactFlowObject)
      );
      return prevSub;
    });
  };

  const handleActiveBackSubActivity = () => {
    const toRet = subProcedure?.parent?.parent
      ? subProcedure.parent
      : undefined;

    setSubProcedure(toRet);
  };

  const handleBackSubActivity = (sub: SubProcedure) => {
    handleProcedureUpdate(sub.flow);

    const newSub = sub.parent ? sub : undefined;
    setSubProcedure(newSub);
  };

  return (
    <ProcedureFlowDiagram
      procedure={
        subProcedure ?? new SubProcedure(procedure.flow, procedure.title)
      }
      setProcedure={setProcedure}
      handleSubProcedure={handleSubProcedure}
      handleProcedureUpdate={handleProcedureUpdate}
      handleBackSubActivity={handleBackSubActivity}
      handleSubmitTitle={handleSubmitTitle}
    />
  );
}

export default ProcedureEditor;
