import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Row,
  useAccordionButton,
} from "react-bootstrap";
import React from "react";
import CollapsableToggle from "./CollapsableToggle.tsx";
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

  const handleOnBlur = useCallback(() => {
    props.handleValueUpdate(text);
  }, [text]);

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
              setText(e.target.value);
            }}
          />
        </Form>
      </CollapsibleCard.Body>
    </CollapsibleCard>
  );
}

export default ActivityDetails;
