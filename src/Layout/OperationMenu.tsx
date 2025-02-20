import { ReactFlowInstance } from "@xyflow/react";
import React, { useCallback, useMemo, useState, useContext } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Dropdown,
  Form,
  ListGroup,
  Modal,
  ModalBody,
  Spinner,
} from "react-bootstrap";

import {
  getActivitiesDescriptionFromJSON,
  saveToDisk,
} from "../Misc/SaveToDisk.ts";
import {
  CategorizedDescriptions,
  createCategorizedDescriptions,
} from "../Misc/CategorizedDescription.ts";
import { ActiveLanguage, ChangeActiveLanguage } from "../App.tsx";
import { LANGUAGES } from "../Procedure/Languages.ts";
import axios from "axios";

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
        <ConfirmModal onClick={() => props.resetEditor()}>
          Start new Project
        </ConfirmModal>
        <LoadModal onLoad={onLoad}>Load Procedure</LoadModal>
        <LanguageSelectionDropdown
          getJSONFile={props.getJSONFile}
          loadJSONFile={props.loadJSONFile}
        />
      </ButtonGroup>
    </ButtonToolbar>
  );
}

function ConfirmModal(props: { children: any; onClick: () => void }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        {props.children}
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Start new Project?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Warning! Current project will be discarded, all unsaved modifications
          will be lost.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              handleClose();
              props.onClick();
            }}
          >
            Yes, start new Project
          </Button>
          <Button variant="outline-secondary" onClick={handleClose}>
            No, keep current Project
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

function LanguageSelectionDropdown(props: {
  getJSONFile: () => string;
  loadJSONFile: (json: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Stato per il loading

  const onLanguageSelected = async (langCode: string) => {
    setLoading(true); // Mostra il loading
    try {
      const jsonString = props.getJSONFile();
      const response = await axios.post(
        "/translateProject/" + langCode,
        jsonString,
        { headers: { "Content-Type": "application/json" } }
      );
      props.loadJSONFile(JSON.stringify(response.data));
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false); // Nasconde il loading alla fine della richiesta
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Translate Content</Button>
      <Modal show={loading} centered>
        <Modal.Header>Loading translation...</Modal.Header>
        <Modal.Body style={{ alignSelf: "center" }}>
          <Spinner as="span" animation="border" />
        </Modal.Body>
      </Modal>
      <LanguageSelectModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={onLanguageSelected}
      />
    </>
  );
}

const LanguageSelectModal = (props: {
  show: boolean;
  handleClose: () => void;
  onSave: (langkey: string) => void;
}) => {
  const [targetLang, setTargetLang] = useState("");
  const [filterTarget, setFilterTarget] = useState("");

  const handleSave = () => {
    if (targetLang) {
      props.onSave(targetLang);
      props.handleClose();
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Translate Content</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label">
            Select the language to translate into
          </label>
          <Dropdown>
            <Dropdown.Toggle variant="success" className="w-100">
              {targetLang
                ? LANGUAGES[targetLang].charAt(0).toUpperCase() +
                  LANGUAGES[targetLang].slice(1)
                : "Select a language..."}
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="w-100"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                overflowX: "clip",
              }}
            >
              <Form.Control
                type="text"
                placeholder="Search..."
                value={filterTarget}
                onChange={(e) => setFilterTarget(e.target.value.toLowerCase())}
                className="m-2"
              />
              <Dropdown.Divider />
              {Object.entries(LANGUAGES)
                .filter((lang) => lang[1].toLowerCase().includes(filterTarget))
                .map((lang) => (
                  <Dropdown.Item
                    key={lang[0]}
                    onClick={() => setTargetLang(lang[0])}
                  >
                    {lang[1].charAt(0).toUpperCase() + lang[1].slice(1)}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default OperationMenu;
