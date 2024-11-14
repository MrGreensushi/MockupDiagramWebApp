import { Tabs, Tab, Button } from "react-bootstrap";
import NarrativeDataManager from "../StoryElements/NarrativeDataManager.ts";
import StoryElementComponent from "./StoryElementComponent.tsx";
import { Component, useEffect, useState } from "react";
import { CharacterElement, LocationElement, ObjectElement, StoryElement, StoryElementEnum } from "../StoryElements/StoryElement.ts";
import React from "react";
import AddElementModal from "../Layout/AddElementModal.tsx";

const StoryElementFormsTab = () => {
  const [key, setKey] = useState(StoryElementEnum.character);
  const [elements, setElements] = useState(new Array<StoryElement>());
  
  const [characterModal, setCharacterModal] = useState(false);
  const [objectModal, setObjectModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  
  const narrativeDataManager = NarrativeDataManager.getInstance();

  const onSubmitNewCharacter = (newCharacter: StoryElement) => {
    narrativeDataManager.addCharacter(newCharacter as CharacterElement);
  }
  const onSubmitNewObject = (newObject: StoryElement) => {
    narrativeDataManager.addObject(newObject as ObjectElement);
  }
  const onSubmitNewLocation = (newLocation: StoryElement) => {
    narrativeDataManager.addLocation(newLocation as LocationElement);
  }

  useEffect(() => {
    switch (key) {
      case StoryElementEnum.character:
        setElements([...narrativeDataManager.characters]);
      break;
      case StoryElementEnum.object:
        setElements([...narrativeDataManager.objects]);
      break;
      case StoryElementEnum.location:
        setElements([...narrativeDataManager.locations]);
      break;
      default:
        console.error("Tab key is not valid: ", key);
      break;
    }
  }, [key]);

  return (
    <>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(Number.parseInt(k ?? "0"))}
        className="mb-3" >
        <Tab eventKey={StoryElementEnum.character} title="Personaggi">
          <Button onClick={() => setCharacterModal(true)}>Aggiungi Personaggio</Button>
          <AddElementModal
            modal={characterModal}
            setModal={setCharacterModal}
            type={StoryElementEnum.character}
            onSubmit={onSubmitNewCharacter} />
        </Tab>
        <Tab eventKey={StoryElementEnum.object} title="Oggetti">
          <Button onClick={() => setObjectModal(true)}>Aggiungi Oggetto</Button>
          <AddElementModal
            modal={objectModal}
            setModal={setObjectModal}
            type={StoryElementEnum.object}
            onSubmit={onSubmitNewObject} />
        </Tab>
        <Tab eventKey={StoryElementEnum.location} title="Luoghi">
          <Button onClick={() => setLocationModal(true)}>Aggiungi Luogo</Button>
          <AddElementModal
            modal = {locationModal}
            setModal = {setLocationModal}
            type = {StoryElementEnum.location}
            onSubmit = {onSubmitNewLocation} />
        </Tab>
      </Tabs>
      <div style={{paddingBottom:"1rem"}}></div>
      {elements.map((element) => (
        <StoryElementComponent
          key={"Tab:StoryElement:" + element.id}
          element={element}
          additionalName="Tab"
        />
      ))}
    </>
  );
};

export default StoryElementFormsTab;
