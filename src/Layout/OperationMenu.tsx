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

  /**
   * Callback function to handle the download operation.
   * It retrieves a JSON string of the project
   * and then saves it to disk with the specified procedure title and a ".procedure" extension.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the save operation is complete.
   */
  const onSave = useCallback(async () => {
    const jsonString = props.getJSONFile();
    //downloadXML(jsonString);
    saveToDisk(jsonString, procedureTitle + ".procedure", "json");
  }, [rfInstance, procedureTitle, props.getJSONFile]);

  /**
   * Downloads a .zip file with all the xmls by sending the JSON of the project to the backend.
   *
   * @param {string} jsonProcedure - The JSON string representing the project to be sent to the backend.
   * @returns {Promise<void>} A promise that resolves when the download is complete.
   *
   * The function sends a POST request to the "/procedure" endpoint with the provided JSON procedure.
   * If the response is successful, it creates a blob from the response, generates a download link,
   * and triggers the download of the file named "xml_files.zip".
   * If the response is not successful, it logs an error message to the console.
   */
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

  /**
   * Loads a JSON file of a project to load and processes its content.
   *
   * @param {File} [file] - The file to be loaded. If no file is provided, the function will return early.
   *
   * @returns {Promise<void>} A promise that resolves when the file content is processed.
   *
   * @throws Will log an error to the console if there is an issue reading the file.
   */
  const onLoad = useCallback(async (file?: File) => {
    if (!file) return;

    try {
      const promiseText = file.text();
      promiseText.then((value) => props.loadJSONFile(value));
    } catch (err) {
      console.error(err);
    }
  }, []);

  /**
   * Imports Activity nodes from a .procedure file and updates categorized descriptions in the parent component.
   *
   * @param {File} [file] - The .procedure file to import. If no file is provided, the function will return early.
   * @returns {Promise<void>} A promise that resolves when the file has been processed and descriptions have been updated.
   *
   * @throws Will not throw an error, but will silently fail if an error occurs during file processing.
   */
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

  /**
   * Handles the selection of a language for translation.
   *
   * This function sets the loading state to true, sends a POST request to the server
   * to translate the project to the selected language. If an error occurs during the request, an alert is shown.
   * The loading state is set to false once the request is completed, regardless of success or failure.
   *
   * @param {string} langCode - The language code for the selected language.
   * @returns {Promise<void>} A promise that resolves when the translation process is complete.
   */
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
