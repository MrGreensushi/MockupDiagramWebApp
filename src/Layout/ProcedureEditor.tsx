import React, { useCallback, useMemo, useState } from "react";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";
import Activity from "../Procedure/Activity.ts";

function ProcedureEditor() {
  const [procedures, setProcedures] = useState<Procedure[]>([new Procedure()]);
  const [activeProcedureId, setActiveProcedureId] = useState(procedures[0].id);

  const updateProcedure = (
    id: string,
    flow?: ReactFlowJsonObject,
    title?: string
  ) => {
    //Ogni volta che aggiorno una procedura devo aggiornare il parametro isSubProcedureEmpty dell'attività padre della procedura

    setProcedures((prevProcedures) =>
      prevProcedures.map((proc) => {
        if (proc.id === id) return proc.cloneAndSet(flow, title);
        return proc;
      })
    );
  };

  const getProcedure = useCallback(
    (id: string) => {
      const toRet = procedures.find((x) => x.id === id);
      if (!toRet) console.error("No procedure find with id: " + id);
      return toRet;
    },
    [procedures]
  );

  const handleSubmitActiveTitle = (title: string) => {
    updateProcedure(activeProcedureId, undefined, title);
  };

  const handleUpdateActiveFlow = (flow: ReactFlowJsonObject) => {
    updateProcedure(activeProcedureId, flow, undefined);

    //se la procedura era figlia di un attività, bisogna aggiornare il valore di empty dell'attività madre.

    //1. trovare nella procedura padre l'attività
    if (!activeProcedure.parentId) return;
    const parentProcedure = getProcedure(activeProcedure.parentId);
    if (!parentProcedure) return;

    //l'attività avra come subProcedureID l'id della procedura che stiamo aggiornando
    const activityParent =
      parentProcedure.getNodeByItsSubProcedureId(activeProcedureId);
    if (!activityParent) return;

    //evaluate the new nodes
    const newNodes = parentProcedure.flow.nodes.map((node) => {
      if (!node.data.activity) return node;
      const activity = node.data.activity as Activity;
      if (activity.subProcedureId !== activeProcedureId) return node;
      activity.isSubProcedureEmpty = flow.nodes.length <= 0;
      return { ...node, data: { ...node.data, activity: activity } };
    });

    const newFlow = { ...parentProcedure.flow, nodes: newNodes };
    updateProcedure(parentProcedure.id, newFlow, undefined);
  };

  const setActiveProcedure = (newProcedureId: string) => {
    //TODO: if subProcedure is empty add an output Node

    setActiveProcedureId(newProcedureId);
  };

  const addProcedure = (newProc: Procedure) => {
    setProcedures((prev) => [...prev, newProc]);
  };

  const activeProcedure: Procedure = useMemo(() => {
    const proc = getProcedure(activeProcedureId);
    return proc ?? new Procedure();
  }, [activeProcedureId]);

  return (
    <ProcedureFlowDiagram
      activeProcedure={activeProcedure}
      setActiveProcedure={setActiveProcedure}
      handleActiveProcedureUpdate={handleUpdateActiveFlow}
      handleSubmitTitle={handleSubmitActiveTitle}
      addProcedure={addProcedure}
      getProcedure={getProcedure}
      updateProcedureById={updateProcedure}
    />
  );
}

export default ProcedureEditor;
