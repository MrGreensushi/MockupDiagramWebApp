import React, { useCallback, useMemo, useState } from "react";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";
import Activity from "../Procedure/Activity.ts";
import {
  getAllActivitiesDescriptionsFromProcedures,
  getProceduresFromJSON,
} from "../Misc/SaveToDisk.ts";

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
    updateSubProcedureIsEmptyInParentActivity(activeProcedure, flow);
  };

  const updateSubProcedureIsEmptyInParentActivity = (
    childProcedure: Procedure,
    childFlow: ReactFlowJsonObject
  ) => {
    //se la procedura era figlia di un attività, bisogna aggiornare il valore di hasSubProcedure dell'attività parente.
    //1. Recuperare la procedura padre dal parentId
    const parentProcedureId = childProcedure.parentId;
    if (!parentProcedureId) return;
    const parentProcedure = getProcedure(parentProcedureId);
    if (!parentProcedure) return;

    //2. aggiornare il valore di isSubProcedureEmpty dell'attività padre
    const newNodes = parentProcedure.flow.nodes.map((node) => {
      //Se non è un nodo attività non fare nulla
      if (!node.data.activity) return node;
      const activity = node.data.activity as Activity;
      //Assicurati che l'attività abbia come subProcedureId quella del figlio in esame
      if (activity.subProcedureId !== childProcedure.id) return node;
      activity.isSubProcedureEmpty = childFlow.nodes.length <= 0;
      return { ...node, data: { ...node.data, activity: activity } };
    });

    //3. aggiornare la procedura padre
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
  }, [activeProcedureId, procedures]);

  const getJSONFile = () => {
    var json = "";
    json = JSON.stringify(procedures);
    return json;
  };

  const loadJSONFile = (json: string) => {
    const asProcedures = getProceduresFromJSON(json);

    setProcedures(asProcedures);
    setActiveProcedureId(asProcedures[0].id);
  };

  const getAllActivitiesDescriptions = useMemo(() => {
    return getAllActivitiesDescriptionsFromProcedures(procedures);
  }, [procedures]);

  const updateActivitiesWithSameName = useCallback(
    (toCopy: Activity) => {
      setProcedures((oldProcedures) =>
        oldProcedures.map((oldProcedure) =>
          oldProcedure.cloneAndSet(oldProcedure.updateFlowNodeByName(toCopy))
        )
      );
    },
    [procedures]
  );

  const resetEditor = useCallback(() => {
    const proc = new Procedure();
    setProcedures([proc]);
    setActiveProcedureId(proc.id);
  }, []);

  return (
    <ProcedureFlowDiagram
      activeProcedure={activeProcedure}
      setActiveProcedure={setActiveProcedure}
      handleActiveProcedureUpdate={handleUpdateActiveFlow}
      handleSubmitTitle={handleSubmitActiveTitle}
      addProcedure={addProcedure}
      getProcedure={getProcedure}
      updateProcedureById={updateProcedure}
      getJSONFile={getJSONFile}
      loadJSONFile={loadJSONFile}
      activityDescriptions={getAllActivitiesDescriptions}
      updateActivitiesWithSameName={updateActivitiesWithSameName}
      resetEditor={resetEditor}
    />
  );
}

export default ProcedureEditor;
