import React, { useMemo, useState } from "react";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import { Col, ListGroup } from "react-bootstrap";

const unselectedStyle = {background: "#EEEEEE", color: "black"};

function PromptAreaMenu(props: {
  elements: [StoryElementType, StoryElementEnum][];
  noElements: boolean;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>
  top: number;
  left: number;
  complete: (index: number) => void;
  styles: {background: string, color: string}[];
}) {
  return (
    <ListGroup
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
        style={unselectedStyle} />
      :
        props.elements.length === 0 ?
          <PromptAreaMenuElement
          value={"Nessuna corrispondenza"}
          style={unselectedStyle} />
        :
          props.elements.map((element, idx) =>
            <PromptAreaMenuElement
              value={element[0].name}
              style={props.styles[element[1]]}
              selected={props.index === idx}
              onEnter={() => props.setIndex(idx)}
              onClick={() => props.complete(idx)}
              key={idx} />)

      }
    </ListGroup>
  );
}

function PromptAreaMenuElement(props: {
  value: string,
  style: {background: string, color: string},
  selected?: boolean,
  onEnter?: () => void,
  onClick?: () => void
}) {
  return (
    <ListGroup.Item
      style={{
        ...props.style,
        ...(props.selected && {background: props.style.color, color: props.style.background}),
        padding: "4px"
      }}
      onMouseEnter={e => {e.preventDefault(); props.onEnter?.()}}
      onMouseDown={e => {e.preventDefault(); props.onClick?.()}} >
      {props.value}
    </ListGroup.Item>
  );
}

export default PromptAreaMenu;