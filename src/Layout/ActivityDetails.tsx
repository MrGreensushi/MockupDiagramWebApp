import { useCallback, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import React from "react";

function ActivityDetails(props: {
  text: string;
  handleDetailsUpdate: (details: string) => void;
}) {
  const [text, setText] = useState(props.text);

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleOnBlur = useCallback(() => {
    props.handleDetailsUpdate(text);
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
              setText(e.target.value);
            }}
          />
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ActivityDetails;
