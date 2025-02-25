import React, { useMemo } from "react";
import { StoryElementEnum, StoryElementEnumString, StoryElement } from "../StoryElements/StoryElement.ts";
import { ListGroup, Tab, Tabs } from "react-bootstrap";

const maxElementsShown = 8;

function PromptAreaMenu(props: {
  elements: [StoryElement, StoryElementEnum][];
  noElements: boolean;
  index: number;
  top: number;
  left: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>
  complete: (index: number) => void;
}) {
  const elements = useMemo(() => {
    if (props.noElements) {
      return <PromptAreaMenuElement
        value={"Non sono presenti elementi nella storia attuale"}
        className={"no-mention"} />
    }
    if (props.elements.length === 0) {
      return <PromptAreaMenuElement
        value={"Nessuna corrispondenza"}
        className={"no-mention"} />
    }
    if (props.elements.length <= maxElementsShown) {
      return props.elements.map((element, idx) =>
        <PromptAreaMenuElement
          value={element[0].name}
          className={`${StoryElementEnumString[element[1]]}-mention ${props.index === idx ? "selected" : ""}`}
          onEnter={() => props.setIndex(idx)}
          onClick={() => props.complete(idx)}
          key={idx} />);
    }
    return <Tabs defaultActiveKey={StoryElementEnum.character}>
      {[StoryElementEnum.character, StoryElementEnum.object, StoryElementEnum.location].map(type => 
        <Tab eventKey={type} title={type} key={type}>
          {props.elements.filter(element => element[1] === type).map((element, idx) => 
            <PromptAreaMenuElement
              value={element[0].name}
              className={`${StoryElementEnumString[element[1]]}-mention ${props.index === idx ? "selected" : ""}`}
              onEnter={() => props.setIndex(idx)}
              onClick={() => props.complete(idx)}
              key={idx} />)}
        </Tab>
      )}
    </Tabs>
  }, [props.noElements, props.elements, props.index]);

  return (
    <ListGroup
      className="prompt-area-menu"
      style={{transform: `translate(min(${props.left}px, calc(100vw - 100%)), max(${props.top}px - 100%, 0px))`}}>
      {elements}
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
      action={!!props.onClick}
      className={props.className}
      onMouseEnter={e => {e.preventDefault(); props.onEnter?.()}}
      onMouseDown={e => {e.preventDefault(); props.onClick?.()}}>
      {props.value}
    </ListGroup.Item>
  );
}

export default PromptAreaMenu;