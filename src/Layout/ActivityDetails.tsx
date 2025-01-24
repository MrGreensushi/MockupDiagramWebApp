import { useCallback, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import React from "react";
import { Phrase } from "../Procedure/Activity.ts";

function ActivityDetails(props: {
  text: string;
  handleDetailsUpdate: (
    newPhrases?: Phrase[],
    details?: string,
    newName?: string
  ) => void;
}) {
  const [text, setText] = useState(props.text);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleOnBlur = useCallback(() => {
    if (!dataChanged) return;

    console.log("ActivityDetails:OnBlur");
    props.handleDetailsUpdate(undefined, undefined, text);

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
