import { useCallback, useEffect, useState } from "react";
import { Card, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";
import React from "react";
import { LevelsEnum, Phrase } from "../Procedure/Activity.ts";
import DynamicTextField from "./DynamicTextField.tsx";

function ActivityDetails(props: {
  text: string;
  handleDetailsUpdate: (value: string) => void;
}) {
  const textWidth = "12%";
  const [text, setText] = useState(props.text);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleOnBlur = useCallback(() => {
    if (!dataChanged) return;

    console.log("ActivityDetails:OnBlur");
    props.handleDetailsUpdate(text);

    setDataChanged(false);
  }, [text]);

  return (
    <Card className="p-0" onBlur={handleOnBlur}>
      <Card.Header>Details</Card.Header>
      <Card.Body>
        <Form>
          <Form.Control
            as="textarea"
            style={{ maxHeight: "10em" }}
            value={text}
            onChange={(e) => {
              setDataChanged(true);
              setText(e.target.value);
            }}
          />
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ActivityDetails;
