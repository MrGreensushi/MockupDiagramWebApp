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

import {
  getActivitiesDescriptionFromJSON,
  getProceduresFromJSON,
  saveToDisk,
} from "../Misc/SaveToDisk.ts";
import {
  CategorizedDescriptions,
  createCategorizedDescriptions,
} from "../Misc/CategorizedDescription.ts";

function OperationMenu(props: {
  addNode: () => void;
  addEventNode: () => void;
  addDecisionNode: () => void;
  rfInstance: ReactFlowInstance;
  procedureTitle: string;
  getJSONFile: () => string;
  loadJSONFile: (json: string) => void;
  resetEditor: () => void;
  updateCategorizedDescriptions: (toAdd: CategorizedDescriptions) => void;
}) {
  const rfInstance = props.rfInstance;
  const procedureTitle = props.procedureTitle;

  const onSave = useCallback(async () => {
    const jsonString = props.getJSONFile();
    //downloadXML(jsonString);
    saveToDisk(jsonString, procedureTitle + ".procedure", "json");
  }, [rfInstance, procedureTitle, props.getJSONFile]);

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

  const extractXMLs = () => {
    const jsonString = props.getJSONFile();
    downloadXML(jsonString);
  };

  const onLoad = useCallback(async (file?: File) => {
    if (!file) return;

    try {
      const promiseText = file.text();
      promiseText.then((value) => props.loadJSONFile(value));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const importNodesFromXML = async (file?: File) => {
    if (!file) return;
    try {
      const promiseText = file.text();
      promiseText.then((value) => {
        const descriptions = getActivitiesDescriptionFromJSON(value);
        const categorized = createCategorizedDescriptions(
          file.name.slice(0, file.name.length - ".procedure".length),
          descriptions
        );

        props.updateCategorizedDescriptions(categorized);
      });
    } catch (error) {}
  };

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
          Save Procedure
        </Button>
        <Button variant="outline-primary" onClick={extractXMLs}>
          Extract XMLs
        </Button>
        <LoadModal onLoad={importNodesFromXML}>Import Nodes</LoadModal>
        <Button variant="outline-primary" onClick={() => props.resetEditor()}>
          Start new Project
        </Button>
        <LoadModal onLoad={onLoad}>Load Procedure</LoadModal>
      </ButtonGroup>
    </ButtonToolbar>
  );
}

function LoadModal(props: {
  onLoad: (file?: File) => Promise<void>;
  children: any;
}) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleClose();
    props.onLoad((e.target as HTMLInputElement).files![0]);
  };
  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        {props.children}
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select .procedure file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept=".procedure" onChange={handleInput} />
        </Modal.Body>
      </Modal>
    </>
  );
}
export default OperationMenu;
