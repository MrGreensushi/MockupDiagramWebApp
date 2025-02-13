import React, { useEffect, useState } from "react";
import { Col, Form, FormControlProps, Row } from "react-bootstrap";

function DynamicTextField(props: {
  initialValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  isInvalid?: (value: string) => boolean;
  baseProps?: FormControlProps;
  disable?: boolean;
}) {
  const [value, setValue] = useState(props.initialValue ?? "");
  const [focus, setFocus] = useState(false);

  const handleSubmit = () => {
    if (
      (props.isInvalid !== undefined && !props.isInvalid(value)) ||
      props.isInvalid === undefined
    ) {
      props.onSubmit?.(value);
      setFocus(false);
    }
  };

  useEffect(() => {
    if (props.initialValue) setValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <Form
      id={"Id:" + value}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Row className="justify-content-center">
        {!props.disable && (
          <Col xs={1} style={{ alignContent: "center" }}>
            <i className="bi bi-pencil"></i>
          </Col>
        )}
        <Col xs={11}>
          <Form.Control
            className={"dynamic-text-field"}
            value={value}
            plaintext={!focus}
            readOnly={!focus}
            isInvalid={props.isInvalid?.(value)}
            onChange={(e) => {
              setValue(e.target.value);
              props.onChange?.(e.target.value);
            }}
            onClick={() => setFocus(true)}
            onBlur={handleSubmit}
            {...props.baseProps}
            style={{
              ...props.baseProps?.style,
              cursor: focus ? "text" : "inherit",
              userSelect: focus ? "auto" : "none",
            }}
            disabled={props.disable}
          />
        </Col>
      </Row>
    </Form>
  );
}

export default DynamicTextField;
