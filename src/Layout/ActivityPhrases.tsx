import { useCallback, useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, InputGroup } from "react-bootstrap";
import React from "react";
import { LevelsEnum, Phrase } from "../Procedure/Activity.ts";
import DynamicTextField from "./DynamicTextField.tsx";

function ActivityPhrases(props: {
  phrase: Phrase;
  unavailableLevels: boolean[];
  handlePhraseUpdate: (clipId: string, level: LevelsEnum, text: string) => void;
  checkValidClipId: (name: string, level: LevelsEnum) => boolean;
  removePhrase: () => void;
}) {
  const [clipId, setClipId] = useState(props.phrase.clipId);
  const [level, setLevel] = useState(props.phrase.level);
  const [text, setText] = useState(props.phrase.text);

  const handleChangeLevel = useCallback(
    (newLevel: LevelsEnum) => {
      if (newLevel === level) return;

      setLevel(newLevel);
      props.handlePhraseUpdate(clipId, newLevel, text);
    },
    [level]
  );

  const handleInvalidClipId = (newClipId: string) => {
    return props.checkValidClipId(newClipId, level);
  };

  const handleChangeClipId = (value: string) => {
    console.log(value);
    setClipId(value);
    props.handlePhraseUpdate(value, level, text);
  };

  return (
    <Card className="mt-2 p-0">
      <Card.Header>
        <DynamicTextField
          initialValue={clipId}
          onChange={handleChangeClipId}
          isInvalid={handleInvalidClipId}
          disable={props.phrase.clipId === "Description"}
        />
      </Card.Header>
      <Card.Body>
        <Form>
          <InputGroup>
            <Form.Control
              as="textarea"
              style={{ maxHeight: "15em" }}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                props.handlePhraseUpdate(clipId, level, e.target.value);
              }}
            />
          </InputGroup>
        </Form>

        <Dropdown
          className="level-selection"
          onSelect={(eventKey) => handleChangeLevel(eventKey as LevelsEnum)}
        >
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {level}
          </Dropdown.Toggle>

          <Dropdown.Menu className="level-selection-menu">
            {Object.values(LevelsEnum).map((element, index) => (
              <Dropdown.Item
                className="level-selection-menu-item"
                key={"dropdown-" + element}
                eventKey={element}
                active={element === level}
                disabled={props.unavailableLevels[index]}
              >
                {element}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>
      <Card.Footer>
        {" "}
        {clipId !== "Description" && (
          <Button variant="danger" onClick={props.removePhrase}>
            <i className="bi bi-trash3"></i>
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}

export default ActivityPhrases;
