import { useEffect, useState } from "react";
import { Card, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";
import React from "react";
import { LevelsEnum, Phrase } from "../Procedure/Activity.ts";
import DynamicTextField from "./DynamicTextField.tsx";

function ActivityDetails(props: {
  phrase: Phrase;
  handlePhraseUpdate: (clipId: string, level: LevelsEnum, text: string) => void;
}) {
  const textWidth = "25%";
  const [clipId, setClipId] = useState(props.phrase.clipId);
  const [level, setLevel] = useState(props.phrase.level);
  const [text, setText] = useState(props.phrase.text);

  const handleOnBlur = () => {
    console.log("ActivityDetails:OnBlur");
    props.handlePhraseUpdate(clipId, level, text);
  };

  return (
    <Card onBlur={handleOnBlur}>
      <Card.Header>
        <Row>
          <Col xs={10}>
            <DynamicTextField
              initialValue={clipId}
              onChange={setClipId}
              //onSubmit={props.handlePhraseClipIdUpdate}
            />
          </Col>
          <Col xs={2}>
            <Dropdown
              onSelect={(eventKey) => {
                setLevel(eventKey as LevelsEnum);
              }}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {level}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Object.values(LevelsEnum).map((element, index) => (
                  <Dropdown.Item eventKey={element} active={element === level}>
                    {element}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Form>
          <InputGroup>
            <InputGroup.Text style={{ width: textWidth }}>
              Testo
            </InputGroup.Text>
            <Form.Control
              as="textarea"
              style={{ maxHeight: "10em" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ActivityDetails;
