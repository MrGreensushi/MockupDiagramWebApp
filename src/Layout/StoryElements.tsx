import { Tabs, Tab, Button, Col, ListGroup } from "react-bootstrap";
import StoryElementComponent from "./StoryElementComponent.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import React from "react";
import ElementModal from "./AddElementModal.tsx";
import Story from "../StoryElements/Story.ts";

const StoryElements = (props: {story: Story, setStory: React.Dispatch<React.SetStateAction<Story>>}) => {
  const [key, setKey] = useState(StoryElementEnum.character);
  const [elements, setElements] = useState(new Map<string, StoryElementType>());
  const [selectedElement, setSelectedElement] = useState<StoryElementType>();
  const [selectedElementId, setSelectedElementId] = useState<string>();
  
  const [modal, setModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");

  const onSelectElement = (id: string, element: StoryElementType) => {
    setSelectedElementId(id);
    setSelectedElement(element);
  }

  const onDeselectElement = () => {
    setSelectedElementId(undefined);
    setSelectedElement(undefined);
  }

  const onAddButtonClicked = () => {
    setModalAction("add");
    setModal(true);
    setSelectedElementId(undefined);
    setSelectedElement(undefined);
  }

  const onElementEditButtonClicked = (id: string, element: StoryElementType) => {
    onSelectElement(id, element)
    setModalAction("edit");
    setModal(true);
  }

  const onElementDeleteButtonClicked = (id: string) => {
    props.setStory(story => story.cloneAndDeleteElement(id));
    onDeselectElement();
  }

  const onSubmitNewElement = useCallback((newElement: StoryElementType) => {
    if (!props.story.canAddElement(newElement)) return false;
    props.setStory(story => story.cloneAndAddElement(newElement, key));
    onDeselectElement();
    return true;
  }, [key]);

  const onEditElement = useCallback((editedElement: StoryElementType) => {
    if (selectedElementId) {
      props.setStory(story => story.cloneAndSetElement(selectedElementId, editedElement, key));
      onDeselectElement();
      return true;
    }
    onDeselectElement();
    return false;
  }, [selectedElementId, key]);

  const dynamicElementModal = useMemo(() => (
    <ElementModal
      modal = {modal}
      setModal = {setModal}
      modalAction = {modalAction}
      elementType = {key}
      initialElement = {selectedElement}
      onSubmit = {modalAction === "add" ? onSubmitNewElement : onEditElement} />
  ), [key, modalAction, modal, selectedElement, onEditElement, onSubmitNewElement]);
  
  useEffect(() => 
    setElements(props.story.getTypeMapByEnum(key))
  , [key, props]);

  return (
    <>
      {dynamicElementModal}
      <Tabs
        activeKey={key}
        onSelect={k => setKey(Number.parseInt(k ?? "0"))}
        className="mb-3" >
        <Tab eventKey={StoryElementEnum.character} title="Personaggi">
          <Button onClick={onAddButtonClicked}>Aggiungi Personaggio</Button>
        </Tab>
        <Tab eventKey={StoryElementEnum.object} title="Oggetti">
          <Button onClick={onAddButtonClicked}>Aggiungi Oggetto</Button>
        </Tab>
        <Tab eventKey={StoryElementEnum.location} title="Luoghi">
          <Button onClick={onAddButtonClicked}>Aggiungi Luogo</Button>
        </Tab>
      </Tabs>
      <ListGroup variant="flush">
        {[...elements.keys()].map((id, idx) => (
          <ListGroup.Item key={idx}>
            <StoryElementComponent
              element={elements.get(id)!}
              elementType={key}
              onEditButtonClick={() => onElementEditButtonClicked(id, elements.get(id)!)}
              onDeleteButtonClick={() => onElementDeleteButtonClicked(id)} />
          </ListGroup.Item>
          ))
        }
      </ListGroup>
    </>
  );
};

export default StoryElements;
