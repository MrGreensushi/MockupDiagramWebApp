import { ReactFlowInstance, ReactFlowJsonObject } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Container,
  InputGroup,
  Modal,
  Nav,
  Navbar,
} from "react-bootstrap";
import SaveLoadManager from "../Flow/SaveLoad.tsx";
import Procedure from "../Procedure/Procedure.ts";

function OperationMenu(props: {
  addNode: () => void;
  addEventNode: () => void;
  addDecisionNode: () => void;
  restoreFlow: (flow: ReactFlowJsonObject, title: string) => void;
  rfInstance: ReactFlowInstance;
  procedureTitle: string;
  setProcedure: React.Dispatch<React.SetStateAction<Procedure>>;
}) {
  const [showModal, setShowModal] = useState(false);

  const rfInstance = props.rfInstance;
  const procedureTitle = props.procedureTitle;
  const setProcedure = props.setProcedure;
  const restoreFlow = props.restoreFlow;

  const onSave = useCallback(async () => {
    const newProcedure = new Procedure(
      {
        nodes: rfInstance.getNodes(),
        edges: rfInstance.getEdges(),
        viewport: rfInstance.getViewport(),
      },
      procedureTitle
    );
    const jsonString = newProcedure.toJSONMethod();
    // saveToDisk(
    //   jsonString,
    //   `${newProcedure.title}.procedure`,
    //   "application/json"
    // );
    downloadXML(jsonString);
  }, [rfInstance, procedureTitle]);

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
        restoreFlow(newStory.flow, newStory.title);
        setShowModal(false);
      } catch (err) {
        console.error(err);
      }
    },
    [restoreFlow, setProcedure]
  );

  return (
    <ButtonToolbar className="justify-center">
      <ButtonGroup>
        <Button
          className="operation-button"
          variant="outline-primary"
          onClick={props.addNode}
        >
          Add Activity
        </Button>
        <Button variant="outline-primary" onClick={props.addEventNode}>
          Add Event
        </Button>
        <Button variant="outline-primary" onClick={props.addDecisionNode}>
          Add Decision
        </Button>
        <Button
          variant="outline-primary"
          disabled={rfInstance ? false : true}
          onClick={onSave}
        >
          Savea Procedure
        </Button>
        <Button variant="outline-primary" onClick={() => setShowModal(true)}>
          Load Procedure
        </Button>

        <Modal show={showModal}>
          <Modal.Header>Select .procedure file</Modal.Header>
          <Modal.Body>
            <input
              type="file"
              accept=".procedure"
              onChange={(e) => onLoad((e.target as HTMLInputElement).files![0])}
            />
          </Modal.Body>
        </Modal>

        {/* <input
        type="file"
        accept=".procedure"
        onChange={(e) => onLoad((e.target as HTMLInputElement).files![0])}
      /> */}
      </ButtonGroup>
    </ButtonToolbar>
  );
}

export default OperationMenu;
