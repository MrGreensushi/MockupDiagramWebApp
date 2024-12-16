import React, { useEffect, useState } from "react";
import { Form, FormControlProps } from "react-bootstrap";

function DynamicTextField(props: {
  initialValue?: string;
  focusOnDoubleClick?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  isInvalid?: (value: string) => boolean;
  baseProps?: FormControlProps;
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
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
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
        onClick={props.focusOnDoubleClick ? undefined : () => setFocus(true)}
        onDoubleClick={
          props.focusOnDoubleClick ? () => setFocus(true) : undefined
        }
        onBlur={handleSubmit}
        {...props.baseProps}
        style={{
          ...props.baseProps?.style,
          cursor: focus ? "text" : "inherit",
          userSelect: focus ? "auto" : "none",
        }}
      />
    </Form>
  );
}

export default DynamicTextField;
