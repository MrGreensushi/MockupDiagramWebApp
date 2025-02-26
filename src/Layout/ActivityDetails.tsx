import { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import React from "react";
import CollapsibleCard from "./CollapsibleCard.tsx";

function ActivityDetails(props: {
  title: string;
  text: string;
  handleValueUpdate: (value: string) => void;
}) {
  const [text, setText] = useState(props.text);

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  return (
    <CollapsibleCard defaultOpen={true}>
      <CollapsibleCard.Header>{props.title}</CollapsibleCard.Header>
      <CollapsibleCard.Body>
        <Form>
          <Form.Control
            as="textarea"
            rows={7}
            value={text}
            onChange={(e) => {
              props.handleValueUpdate(e.target.value);
            }}
          />
        </Form>
      </CollapsibleCard.Body>
    </CollapsibleCard>
  );
}

export default ActivityDetails;
