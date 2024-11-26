import { Tabs, Tab, Button } from "react-bootstrap";
import StoryElementComponent from "./StoryElement.tsx";
import { useEffect, useState } from "react";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import React from "react";
import AddElementModal from "./AddElementModal.tsx";
import Story from "../StoryElements/Story.ts";

const StoryElements = (props: {story: Story, setStory: React.Dispatch<React.SetStateAction<Story>>}) => {
  const [key, setKey] = useState(StoryElementEnum.character);
  const [elements, setElements] = useState(new Array<StoryElementType>());
  
  const [characterModal, setCharacterModal] = useState(false);
  const [objectModal, setObjectModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  
  const onSubmitNewElement = (newElement: StoryElementType) => {
    if (!props.story.canAddElement(newElement)) return false;
    props.setStory(oldStory => oldStory.cloneAndAddElement(newElement));
    return true;
  }

  useEffect(() => 
    setElements([...props.story.getTypeIteratorByEnum(key)])
  , [key, props.story]);

  return (
    <>
      <Tabs
        activeKey={key}
        onSelect={k => setKey(Number.parseInt(k ?? "0"))}
        className="mb-3" >
        <Tab eventKey={StoryElementEnum.character} title="Personaggi">
          <Button onClick={() => setCharacterModal(true)}>Aggiungi Personaggio</Button>
          <AddElementModal
            modal={characterModal}
            setModal={setCharacterModal}
            type={StoryElementEnum.character}
            onSubmit={onSubmitNewElement} />
        </Tab>
        <Tab eventKey={StoryElementEnum.object} title="Oggetti">
          <Button onClick={() => setObjectModal(true)}>Aggiungi Oggetto</Button>
          <AddElementModal
            modal={objectModal}
            setModal={setObjectModal}
            type={StoryElementEnum.object}
            onSubmit={onSubmitNewElement} />
        </Tab>
        <Tab eventKey={StoryElementEnum.location} title="Luoghi">
          <Button onClick={() => setLocationModal(true)}>Aggiungi Luogo</Button>
          <AddElementModal
            modal = {locationModal}
            setModal = {setLocationModal}
            type = {StoryElementEnum.location}
            onSubmit = {onSubmitNewElement} />
        </Tab>
      </Tabs>
      <div style={{paddingBottom:"1rem"}}></div>
      {elements.map((element, idx) => (
        <StoryElementComponent
          element={element}
          additionalName="Tab"
          key={idx}
        />
      ))}
    </>
  );
};

export default StoryElements;
