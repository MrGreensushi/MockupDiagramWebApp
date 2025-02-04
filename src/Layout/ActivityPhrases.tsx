import { useMemo, useState } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import React from "react";
import { LevelsEnum } from "../Procedure/Activity.ts";
import CollapsibleCard from "./CollapsibleCard.tsx";
import DynamicTextField from "./DynamicTextField.tsx";

function ActivityPhrases(props: {
  clipId: string;
  noviceText: string;
  intermediateText?: string;
  advanceText?: string;
  handlePhraseUpdate: (
    clipId: string,
    noviceText: string,
    intermediateText?: string,
    advanceText?: string,
    newClipId?: string
  ) => void;
  checkValidClipId: (clipId: string) => boolean;
  removePhrase: (clipId: string) => void;
}) {
  const oldClipId = props.clipId;
  const [clipId, setClipId] = useState(props.clipId);
  const [noviceText, setNoviceText] = useState(props.noviceText);
  const [intermediateText, setIntermediateText] = useState(
    props.intermediateText ?? ""
  );
  const [advanceText, setAdvanceText] = useState(props.advanceText ?? "");
  const [selectedLevel, setSelectedLevel] = useState(LevelsEnum.novice);
  const [showModal, setShowModal] = useState(false);

  const activeText = useMemo(() => {
    switch (selectedLevel) {
      case LevelsEnum.novice:
        return noviceText;
      case LevelsEnum.intermediate:
        return intermediateText;
      case LevelsEnum.expert:
        return advanceText;
    }
  }, [selectedLevel, noviceText, intermediateText, advanceText]);

  const handleChangeClipId = (value: string) => {
    console.log(value);
    setClipId(value);
    //update the phrase for all the levels
    updateAllPhrases(value);
  };

  const ifEmptyReturnUndefined = (value: string) => {
    return value === "" ? undefined : value;
  };

  const updateAllPhrases = (
    newClipId = clipId,
    newNovText = noviceText,
    newIntText = intermediateText,
    newAdvText = advanceText
  ) => {
    props.handlePhraseUpdate(
      oldClipId,
      newNovText,
      ifEmptyReturnUndefined(newIntText),
      ifEmptyReturnUndefined(newAdvText),
      oldClipId === newClipId ? undefined : newClipId
    );
  };
  const onTextUpdate = (newText: string) => {
    switch (selectedLevel) {
      case LevelsEnum.novice:
        setNoviceText(newText);
        updateAllPhrases(undefined, newText);
        break;
      case LevelsEnum.intermediate:
        setIntermediateText(newText);
        updateAllPhrases(undefined, undefined, newText);
        break;
      case LevelsEnum.expert:
        setAdvanceText(newText);
        updateAllPhrases(undefined, undefined, undefined, newText);
        break;
    }
  };

  return (
    <CollapsibleCard defaultOpen={clipId === "Description"}>
      <CollapsibleCard.Header>{clipId}</CollapsibleCard.Header>
      <CollapsibleCard.Body>
        <Tabs
          activeKey={selectedLevel}
          onSelect={(eventKey) => setSelectedLevel(eventKey as LevelsEnum)}
          fill
        >
          <Tab title="Novice" eventKey={LevelsEnum.novice} />
          <Tab title="Intermediate" eventKey={LevelsEnum.intermediate} />
          <Tab title="Expert" eventKey={LevelsEnum.expert} />
        </Tabs>
        <Form>
          <Form.Control
            as="textarea"
            rows={7}
            value={activeText}
            onChange={(e) => {
              onTextUpdate(e.target.value);
            }}
          />
        </Form>
      </CollapsibleCard.Body>
      <CollapsibleCard.Footer>
        {clipId !== "Description" && (
          <>
            <Button variant="danger" onClick={() => props.removePhrase(clipId)}>
              <i className="bi bi-trash3"></i>
            </Button>{" "}
            <Button onClick={() => setShowModal(true)}>
              Changle ClipID
              <ClipIdModal
                clipId={clipId}
                showModal={showModal}
                closeModal={setShowModal}
                handleChangeClipId={handleChangeClipId}
                checkValidClipId={props.checkValidClipId}
              />
            </Button>
          </>
        )}
      </CollapsibleCard.Footer>
    </CollapsibleCard>
  );
}

function ClipIdModal(props: {
  clipId: string;
  showModal: boolean;
  closeModal: () => void;
  handleChangeClipId: (value: string) => void;
  checkValidClipId: (value: string) => boolean;
}) {
  const [clipId, setClipId] = useState(props.clipId);
  const showModal = props.showModal;
  const handleClose = () => props.closeModal();
  const handleConfirm = () => {
    props.handleChangeClipId(clipId);
    handleClose(); // Chiude il modal dopo la conferma
  };
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Clip Id</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DynamicTextField
          initialValue={clipId}
          onChange={setClipId}
          isInvalid={(value: string) => props.checkValidClipId(value)}
          onSubmit={handleConfirm}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={props.checkValidClipId(clipId)}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ActivityPhrases;
