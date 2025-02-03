import { useCallback, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import React from "react";

function ActivityDetails(props: {
  title: string;
  text: string;
  handleValueUpdate: (value: string) => void;
}) {
  const [text, setText] = useState(props.text);

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleOnBlur = useCallback(() => {
    props.handleValueUpdate(text);
  }, [text]);

  return (
    <Card className="p-0" onBlur={handleOnBlur}>
      <Card.Header>{props.title}</Card.Header>
      <Card.Body>
        <Form>
          <Form.Control
            as="textarea"
            rows={7}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ActivityDetails;
