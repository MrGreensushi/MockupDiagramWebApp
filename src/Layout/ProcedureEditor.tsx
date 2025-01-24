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

    //update the activity parent of the procedure to know that it has a length > 0
    const parentProcedure = activeProcedure.parentId
      ? getProcedure(activeProcedure.parentId)
      : undefined;
    if (!parentProcedure) return;

    var flowParent = parentProcedure.flow;
    const newNodes = flowParent.nodes.map((x) => {
      const activity = x.data.activity as Activity;
      if (activity.subProcedureId !== activeProcedureId) return x;

      return {
        ...x,
        data: {
          ...x.data,
          activity: {
            ...x.data.activity,
            isSubProcedureEmpty: flow.nodes.length <= 0,
          },
        },
      };
    });

    flowParent = { ...flowParent, nodes: newNodes };

    updateProcedure(parentProcedure.id, flowParent);
  };

  const setActiveProcedure = (newProcedureId: string) => {
    //TODO: if subProcedure is empty add an output Node

    setActiveProcedureId(newProcedureId);
  };

  const addProcedure = (newProc: Procedure) => {
    setProcedures((prev) => [...prev, newProc]);
  };

  const handleBackSubActivity = (procedureId: string) => {
    setActiveProcedureId(procedureId);
  };

  const isProcedureEmpty = (procedureId: string) => {
    const procedure = getProcedure(procedureId);
    if (!procedure) return true;
    return procedure.isEmpty();
  };

  const activeProcedure: Procedure = useMemo(() => {
    const proc = getProcedure(activeProcedureId);
    return proc ?? new Procedure();
  }, [activeProcedureId]);

  return (
    <ProcedureFlowDiagram
      activeProcedure={activeProcedure}
      setActiveProcedure={setActiveProcedure}
      handleProcedureUpdate={handleUpdateActiveFlow}
      handleBackSubActivity={handleBackSubActivity}
      handleSubmitTitle={handleSubmitActiveTitle}
      addProcedure={addProcedure}
      getProcedure={getProcedure}
      isProcedureEmpty={isProcedureEmpty}
    />
  );
}

export default ProcedureEditor;
