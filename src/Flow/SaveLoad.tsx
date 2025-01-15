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
import axios from "axios";

function SaveLoadManager(props: {
  rfInstance: ReactFlowInstance;
  procedure: Procedure;
  setProcedure: React.Dispatch<React.SetStateAction<Procedure>>;
  nodes: Node[];
  edges: Edge[];
  restoreFlow: (flow: ReactFlowJsonObject) => void;
}) {
  const rfInstance = props.rfInstance;
  const procedure = props.procedure;
  const setProcedure = props.setProcedure;
  const nodes = props.nodes;
  const edges = props.edges;
  const restoreFlow = props.restoreFlow;

  const onSave = useCallback(async () => {
    const newProcedure = new Procedure(
      { nodes: nodes, edges: edges, viewport: rfInstance.getViewport() },
      procedure.title
    );
    const jsonString = newProcedure.toJSONMethod();
    saveToDisk(
      jsonString,
      `${newProcedure.title}.procedure`,
      "application/json"
    );
    downloadXML(jsonString);
  }, [rfInstance, procedure, edges, nodes]);

  async function downloadXML(jsonProcedure: string) {
    const response = await fetch("/procedure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonProcedure, // I dati da inviare al backend
    });

    if (response.ok) {
      //saveToDisk(response, "xml_files.zip", "application/json");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "xml_files.zip"; // Nome del file ZIP da scaricare
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error("Errore nel download dei file XML");
    }
  }

  const onLoad = useCallback(
    async (file?: File) => {
      if (!file) return;

      try {
        const newStory = Procedure.fromJSON(await file.text());
        console.log(newStory);
        setProcedure(newStory);
        restoreFlow(newStory.flow);
      } catch (err) {
        console.error(err);
      }
    },
    [restoreFlow, setProcedure]
  );

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Salva Procedura</button>
      <input
        type="file"
        accept=".procedure"
        onChange={(e) => onLoad((e.target as HTMLInputElement).files![0])}
      />
    </Panel>
  );
}

export default SaveLoadManager;
