import React from "react";
import { StoryElementEnum, StoryElementEnumString, StoryElementType } from "../StoryElements/StoryElement.ts";
import { ListGroup } from "react-bootstrap";

function PromptAreaMenu(props: {
  elements: [StoryElementType, StoryElementEnum][];
  noElements: boolean;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>
  top: number;
  left: number;
  complete: (index: number) => void;
}) {
  return (
    <ListGroup
      className="prompt-area"
      style={{
        position: "fixed",
        top: props.top,
        left: props.left,
        border: "solid 1px gray",
        borderRadius: "3px",
        background: "white",
        cursor: "pointer",
        maxWidth: "15em",
        zIndex: "1500"
      }} >
      {props.noElements ?
        <PromptAreaMenuElement
        value={"Non sono presenti elementi nella storia attuale"}
        className={"no-mention"} />
      :
        props.elements.length === 0 ?
          <PromptAreaMenuElement
          value={"Nessuna corrispondenza"}
          className={"no-mention"} />
        :
          props.elements.map((element, idx) =>
            <PromptAreaMenuElement
              value={element[0].name}
              className={`${StoryElementEnumString[props.elements[idx][1]]}-mention ${props.index === idx ? "selected" : ""}`}
              onEnter={() => props.setIndex(idx)}
              onClick={() => props.complete(idx)}
              key={idx} />)

      }
    </ListGroup>
  );
}

function PromptAreaMenuElement(props: {
  value: string,
  className: string,
  selected?: boolean,
  onEnter?: () => void,
  onClick?: () => void
}) {
  return (
    <ListGroup.Item
      action
      className={props.className}
      style={{padding: "4px"}}
      onMouseEnter={e => {e.preventDefault(); props.onEnter?.()}}
      onMouseDown={e => {e.preventDefault(); props.onClick?.()}} >
      {props.value}
    </ListGroup.Item>
  );
}

export default PromptAreaMenu;