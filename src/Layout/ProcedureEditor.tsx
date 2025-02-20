import React, { createContext, useCallback, useMemo, useState } from "react";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";
import Activity from "../Procedure/Activity.ts";
import {
  getAllActivitiesDescriptionsFromProcedures,
  getProceduresFromJSON,
} from "../Misc/SaveToDisk.ts";

export const Procedures = createContext([new Procedure()]);

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
        if (proc.id === id) {
          const newPorc = proc.cloneAndSet(flow, title);
          return newPorc;
        }
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
  }, [activeProcedureId, getProcedure]);

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
    [setProcedures]
  );

  const resetEditor = useCallback(() => {
    const proc = new Procedure();
    setProcedures([proc]);
    setActiveProcedureId(proc.id);
  }, []);

  return (
    <Procedures.Provider value={procedures}>
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
    </Procedures.Provider>
  );
}

export default ProcedureEditor;
