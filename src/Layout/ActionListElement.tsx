import React, { isValidElement, ReactNode } from "react";
import { InputGroup } from "react-bootstrap";

function ActionListElement (props: {
  children: ReactNode,
  leftSide?: ReactNode,
  rightSide?: ReactNode,
}) {
  return (
    <InputGroup style={{flexWrap:"nowrap"}}>
      {props.leftSide}
      {isValidElement(props.children) ? 
        props.children
      :
        <InputGroup.Text className="d-flex flex-grow-1" style={{textWrap:"pretty", overflowWrap:"anywhere", justifyContent:"space-evenly"}}>
          {props.children}
        </InputGroup.Text>
      }
      {props.rightSide}
    </InputGroup>
  );
};

export default ActionListElement;
