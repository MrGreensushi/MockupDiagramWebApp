import { useCallback } from "react";
import {
  Edge,
  Node,
  Panel,
  ReactFlowInstance,
  ReactFlowJsonObject,
} from "@xyflow/react";
import saveToDisk from "../Misc/SaveToDisk.ts";
import React from "react";
import Procedure from "../Procedure/Procedure.ts";

function SaveLoadManager(props: {
  rfInstance: ReactFlowInstance;
  procedureTitle: string;
  setProcedure: React.Dispatch<React.SetStateAction<Procedure>>;
  restoreFlow: (flow: ReactFlowJsonObject, title: string) => void;
}) {
  return <></>;
}

export default SaveLoadManager;
