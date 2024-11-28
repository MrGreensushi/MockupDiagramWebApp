import React from "react";
import { InputGroup, Button } from "react-bootstrap";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement";

function StoryElementComponent (props: {
  element: StoryElementType,
  elementType: StoryElementEnum,
  onEditButtonClick: () => void,
  onDeleteButtonClick: () => void
}) {
  return (
    <InputGroup style={{width:"100%", flexWrap:"nowrap"}}>
      <Button variant="danger" onClick={props.onDeleteButtonClick}>
        <i className="bi bi-trash" aria-label="delete" /> 
      </Button>
      <InputGroup.Text className="d-flex flex-grow-1" style={{textWrap:"pretty", overflowWrap:"anywhere"}}>
        {props.element.name}
      </InputGroup.Text>
      <Button variant="secondary" onClick={props.onEditButtonClick}>
        <i className="bi bi-pencil" aria-label="edit" /> 
      </Button>
    </InputGroup>
  );
};

export default StoryElementComponent;
