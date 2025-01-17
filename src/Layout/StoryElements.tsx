import { Tabs, Tab, Button, ListGroup, InputGroup, Badge } from "react-bootstrap";
import ActionListElement from "./ActionListElement.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import React from "react";
import ElementModal from "./AddElementModal.tsx";
import Story from "../StoryElements/Story.ts";

const StoryElements = (props: {
  story: Story,
  setStory: React.Dispatch<React.SetStateAction<Story>>,
  editMode: boolean
}) => {
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
    if (!props.story.canAddElement(newElement, key)) return false;
    props.setStory(story => story.cloneAndAddElement(newElement, key));
    onDeselectElement();
    return true;
  }, [key, props.story, props.setStory]);

  const onEditElement = useCallback((editedElement: StoryElementType) => {
    if (selectedElementId) {
      props.setStory(story => story.cloneAndSetElement(selectedElementId, editedElement, key));
      onDeselectElement();
      return true;
    }
    onDeselectElement();
    return false;
  }, [selectedElementId, key, props.setStory]);

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
    setElements(props.story.getTypeMap(key))
  , [key, props]);

  return (
    <>
      {dynamicElementModal}
      <Tabs
        activeKey={key}
        onSelect={k => setKey(Number.parseInt(k ?? "0"))}
        className="mb-2" >
        <Tab eventKey={StoryElementEnum.character} title={<>Personaggi <Badge>{props.story.characters.size}</Badge></>}>
          {props.editMode && <Button onClick={onAddButtonClicked}>Aggiungi Personaggio</Button> }
        </Tab>
        <Tab eventKey={StoryElementEnum.object} title={<>Oggetti <Badge>{props.story.objects.size}</Badge></>}>
          {props.editMode && <Button onClick={onAddButtonClicked}>Aggiungi Oggetto</Button> }
        </Tab>
        <Tab eventKey={StoryElementEnum.location} title={<>Luoghi <Badge>{props.story.locations.size}</Badge></>}>
          {props.editMode && <Button onClick={onAddButtonClicked}>Aggiungi Luogo</Button> }
        </Tab>
      </Tabs>
      <ListGroup variant="flush">
        {[...elements.keys()].map((id, idx) => (
          <ListGroup.Item key={idx}>
            <ActionListElement
              leftSide={ props.editMode && 
                <Button variant="danger" onClick={() => onElementDeleteButtonClicked(id)}>
                  <i className="bi bi-trash" aria-label="delete" /> 
                </Button>}
              rightSide={ props.editMode &&
                <Button variant="secondary" onClick={() => onElementEditButtonClicked(id, elements.get(id)!)}>
                  <i className="bi bi-pencil" aria-label="edit" /> 
                </Button>}>
                <InputGroup.Text className={`d-flex flex-grow-1 ${elements.get(id)!.isVariable ? "bg-warning-subtle" : ""}`} style={{textWrap:"pretty", overflowWrap:"anywhere", justifyContent:"space-evenly"}}>
                  {elements.get(id)!.name}
                </InputGroup.Text>
            </ActionListElement>
          </ListGroup.Item>
          ))
        }
      </ListGroup>
    </>
  );
};

export default StoryElements;
