import React, { useMemo, useState } from "react";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";

function ProcedureEditor() {
  const [procedures, setProcedures] = useState<Procedure[]>([new Procedure()]);
  const [activeProcedureId, setActiveProcedureId] = useState(procedures[0].id);

  const updateProcedure = (
    id: string,
    flow?: ReactFlowJsonObject,
    title?: string
  ) => {
    setProcedures((prevProcedures) =>
      prevProcedures.map((proc) => {
        if (proc.id === id) return proc.cloneAndSet(flow, title);
        return proc;
      })
    );
  };

  const handleSubmitActiveTitle = (title: string) => {
    updateProcedure(activeProcedureId, undefined, title);
  };

  const handleUpdateActiveFlow = (flow: ReactFlowJsonObject) => {
    updateProcedure(activeProcedureId, flow, undefined);
  };
  const setActiveProcedure = (newProcedureId: string) => {
    //TODO: if subProcedure is empty add an output Node
    setActiveProcedureId(newProcedureId);
  };

  const handleBackSubActivity = (procedureId: string) => {
    setActiveProcedureId(procedureId);
  };

  const activeProcedure: Procedure = useMemo(() => {
    const proc = procedures.find((x) => x.id === activeProcedureId);
    if (!proc)
      console.error("Nessuna procedura trovata con id: " + activeProcedureId);
    return proc ?? new Procedure();
  }, [activeProcedureId]);

  return (
    <ProcedureFlowDiagram
      activeProcedure={activeProcedure}
      setActiveProcedure={setActiveProcedure}
      handleProcedureUpdate={handleUpdateActiveFlow}
      handleBackSubActivity={handleBackSubActivity}
      handleSubmitTitle={handleSubmitActiveTitle}
    />
  );
}

export default ProcedureEditor;
