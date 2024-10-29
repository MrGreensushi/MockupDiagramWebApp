import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert, Modal } from "react-bootstrap";

const StoryElementForm = ({
  isIdUnique,
  getAvailableTypes,
  handleSubmitContainer,
}) => {
  const [isVariable, setIsVariable] = useState(null); // Controlla se COSTANTE o VARIABILE è selezionato
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [storyElementDescriptor, setStoryElementDescriptor] = useState(null);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [alertText, setAlertText] = useState("");
  const [showModal, setShowModal] = useState(false); // Stato per gestire la visibilità del modal
  const [showAlert, setShowAlert] = useState(false);
  const [isAlertError, setIsAlertError] = useState(false);

  const handleRadioChange = (e) => {
    setIsVariable(e.target.value === "variabile");
    setType(""); // Reset dropdown quando cambia la selezione
    setName("");
    setDescription("");
    setNotes("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Controlla se il nome non sia vuoto
    if (name === "") {
      setAlert(true, true, "Il nome non può essere vuoto");
      return;
    }

    // Controlla se il nome s unico
    if (!isIdUnique(name)) {
      setAlert(true, true, "Il nome inserito è già esistente.");
      return;
    }

    // Controlla se la tipologia non sia vuoto
    if (type === "" || type === null) {
      setAlert(true, true, "Il campo Tipologia non può essere vuoto");
      return;
    }

    // Effettua ulteriori operazioni di salvataggio qui
    handleSubmitContainer(storyElementDescriptor, name, description, notes);
    //setError(""); // Reset dell'errore se il form va a buon fine
    //alert(`Elemento aggiunto: Nome: ${name}, Tipo: ${type}, Note: ${notes}`);
    setAlert(true, false, "Elemento aggiunto con successo!");
  };

  const setAlert = (show, isError = false, text = "") => {
    setAlertText(text);
    setShowAlert(show);
    setIsAlertError(isError);
  };

  const handleDropdownSelect = (typeName) => {
    const value = availableTypes.find((x) => x.type == typeName);
    if (value === null || value === undefined) {
      setType("");
      setDescription("");
      setStoryElementDescriptor(null);
      return;
    }
    setType(value.type);
    setDescription(value.description);
    setStoryElementDescriptor(value);

    if (isVariable) return;
    setName(value.type);
  };

  const handleShowModal = (value) => {
    setShowModal(value);
    if (!value) return;

    setIsVariable(null);
    setType(""); // Reset dropdown quando cambia la selezione
    setName("");
    setDescription("");
    setNotes("");
    setAlert(false);
  };

  // Recupera le tipologie basate sulla selezione di COSTANTE o VARIABILE
  const availableTypes =
    isVariable !== null ? getAvailableTypes(isVariable) : [];
  console.log("AvailableTypes:", availableTypes);

  return (
    <>
      {/* Bottone per aprire il popup */}
      <Button
        variant="primary"
        onClick={() => handleShowModal(true)}
        style={{ maxWidth: "400px", marginTop: "10px", marginBottom: "10px" }}
      >
        Add
      </Button>
      {/* Modal che contiene il form */}
      <Modal show={showModal} onHide={() => handleShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi un nuovo elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>
                Scegli il tipo
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="radio"
                  label="Costante"
                  name="typeRadio"
                  value="costante"
                  onChange={handleRadioChange}
                />
                <Form.Check
                  type="radio"
                  label="Variabile"
                  name="typeRadio"
                  value="variabile"
                  onChange={handleRadioChange}
                />
              </Col>
            </Form.Group>

            {isVariable !== null && (
              <>
                <Form.Group controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Inserisci il nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isVariable}
                  />
                </Form.Group>

                <Form.Group controlId="formType">
                  <Form.Label>Tipologia</Form.Label>
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={(e) => handleDropdownSelect(e.target.value)}
                  >
                    <option value="">Seleziona una tipologia...</option>
                    {availableTypes.map((item, index) => (
                      <option key={index} value={item.type}>
                        {item.type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formDescription">
                  <Form.Label>Descrizione</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Aggiungi una descrizione"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formNotes">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Aggiungi delle note"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                {showAlert && (
                  <Alert
                    variant={isAlertError ? "danger" : "success"}
                    dismissible
                    onClose={() => setShowAlert(false)}
                  >
                    {alertText}
                  </Alert>
                )}
                <Button variant="primary" type="submit">
                  Aggiungi
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StoryElementForm;
