import React, { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { LANGUAGES } from "../Procedure/Languages.ts";

export function ExtractXML(props: { getJSONFile: () => string }) {
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

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterTarget, setFilterTarget] = useState("");

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.filter((lang) => lang !== code)
        : [...prev, code]
    );
  };

  return (
    <>
      <Button variant="outline-primary" onClick={() => setShowModal(true)}>
        Extract XMLs
      </Button>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <h3>Select Languages for Export</h3>{" "}
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value.toLowerCase())}
            className="m-2"
          />
          <Container
            className="p-4"
            style={{ overflowY: "scroll", height: "55vh" }}
          >
            <Row>
              {Object.entries(LANGUAGES)
                .filter((lang) => lang[1].toLowerCase().includes(filterTarget))
                .map(([code, name]) => (
                  <Col xs={6} md={4} key={code} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      label={name.charAt(0).toUpperCase() + name.slice(1)}
                      checked={selectedLanguages.includes(code)}
                      onChange={() => toggleLanguage(code)}
                    />
                  </Col>
                ))}
            </Row>
          </Container>
          <div className="mt-4">
            <strong>Selected:</strong>{" "}
            {selectedLanguages.map((code) => LANGUAGES[code]).join(", ") ||
              "None"}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success">Extract XMLs</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
