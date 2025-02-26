import React, { createContext, useCallback, useMemo, useState } from "react";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";
import Activity, { ActivityDescription } from "../Procedure/Activity.ts";
import {
  getAllActivitiesDescriptionsFromProcedures,
  getProceduresFromJSON,
} from "../Misc/SaveToDisk.ts";

export const Procedures = createContext([new Procedure()]);

function ProcedureEditor() {
  const [procedures, setProcedures] = useState<Procedure[]>([new Procedure()]);
  const [activeProcedureId, setActiveProcedureId] = useState(procedures[0].id);

  /**
   * Updates a procedure with the given id by optionally setting a new flow and/or title.
   *
   * @param id - The unique identifier of the procedure to update.
   * @param flow - (Optional) The new flow object to set for the procedure.
   * @param title - (Optional) The new title to set for the procedure.
   */
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

  /**
   * Retrieves a procedure by its ID from the list of procedures.
   *
   * @param {string} id - The ID of the procedure to retrieve.
   * @returns {Procedure | undefined} The procedure with the specified ID, or undefined if not found.
   * @throws Will log an error to the console if no procedure is found with the given ID.
   */
  const getProcedure = useCallback(
    (id: string) => {
      const toRet = procedures.find((x) => x.id === id);
      if (!toRet) console.error("No procedure find with id: " + id);
      return toRet;
    },
    [procedures]
  );

  /**
   * Changes the title of the active procedure.
   *
   * @param {string} title - The title submitted.
   */
  const handleSubmitActiveTitle = (title: string) => {
    updateProcedure(activeProcedureId, undefined, title);
  };

  /**
   * Changes the flow of the active procedure.
   *
   * @param {ReactFlowJsonObject} flow - The updated flow.
   */
  const handleUpdateActiveFlow = (flow: ReactFlowJsonObject) => {
    updateProcedure(activeProcedureId, flow, undefined);
  };

  /**
   * Changes the active procedure based on the new Procedure ID.
   *
   * @param {string} newProcedureId - ID of the new Active Procedure.
   */
  const setActiveProcedure = (newProcedureId: string) => {
    setActiveProcedureId(newProcedureId);
  };

  /**
   * Adds a new Procedure to the procedures array.
   *
   * @param {Procedure} newProc - New Procedure to add.
   */
  const addProcedure = (newProc: Procedure) => {
    setProcedures((prev) => [...prev, newProc]);
  };

  /**
   * Memoized function to get the active procedure based on the activeProcedureId.
   * If the procedure is not found, it returns a new Procedure instance.
   *
   * @type {Procedure}
   * @returns {Procedure} The active procedure or a new Procedure instance.
   */
  const activeProcedure: Procedure = useMemo(() => {
    const proc = getProcedure(activeProcedureId);
    return proc ?? new Procedure();
  }, [activeProcedureId, getProcedure]);

  /**
   * Converts the `procedures` object to a JSON string.
   *
   * @returns {string} The JSON string representation of the `procedures` object.
   */
  const getJSONFile = () => {
    var json = "";
    json = JSON.stringify(procedures);
    return json;
  };

  /**
   * Loads a JSON string, parses it into procedures, and updates the state `procedures` with the parsed procedures.
   *
   * @param json - The JSON string representing the procedures.
   */
  const loadJSONFile = (json: string) => {
    const asProcedures = getProceduresFromJSON(json);

    setProcedures(asProcedures);
    setActiveProcedureId(asProcedures[0].id);
  };

  /**
   * Memoized function to get all the activities descriptions from the procedures.
   *
   * @type {ActivityDescription[]}
   * @returns {ActivityDescription[]} All the activities descriptions from the procedures.
   */
  const getAllActivitiesDescriptions = useMemo(() => {
    return getAllActivitiesDescriptionsFromProcedures(procedures);
  }, [procedures]);

  /**
   * Updates all activities with the same name as the provided activity.
   *
   * This function uses a callback to update the state of procedures by mapping over the old procedures
   * and cloning each procedure while updating the flow node by name with the provided activity.
   *
   * @param {Activity} toCopy - The activity to copy and update in the procedures.
   */
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

  /**
   * Resets the editor by creating a new Procedure instance,
   * setting it as the only procedure in the state, and
   * updating the active procedure ID to the new procedure's ID.
   *
   * @function
   * @name resetEditor
   * @returns {void}
   */
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
