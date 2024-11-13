import { Tabs, Tab, Button } from "react-bootstrap";
import StoryElementContainerForm from "./StoryElementContainerForm";
import NarrativeDataManager from "../StoryElements/NarrativeDataManager.ts";
import CharacterContainer from "../StoryElements/CharacterContainer";
import ObjectContainer from "../StoryElements/ObjectContainer";
import BackgroundContainer from "../StoryElements/BackgroundContainer";
import StoryElementComponent from "./StoryElementComponent";
import { Component, useEffect, useState } from "react";
import { CharacterElement, LocationElement, ObjectElement, StoryElement, StoryElementEnum } from "../StoryElements/StoryElement.ts";
import React from "react";
import AddElementModal from "../Layout/AddElementsModal.tsx";

const StoryElementFormsTab = () => {
  const [key, setKey] = useState(StoryElementEnum.character);
  const [elements, setElements] = useState(new Array<StoryElement>());
  
  const [characterModal, setCharacterModal] = useState(false);
  const [objectModal, setObjectModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  
  const narrativeDataManager = NarrativeDataManager.getInstance();

  const commonHeaderString = "Aggiungi un nuovo ";

  const onSubmitNewCharacter = (newCharacter: StoryElement) => {
    narrativeDataManager.addCharacter(newCharacter as CharacterElement);
  }
  const onSubmitNewObject = (newObject: StoryElement) => {
    narrativeDataManager.addObject(newObject as ObjectElement);
  }
  const onSubmitNewLocation = (newLocation: StoryElement) => {
    narrativeDataManager.addBackground(newLocation as LocationElement);
  }

  useEffect(() => {
    switch (key) {
      case StoryElementEnum.character:
        setElements([...narrativeDataManager.characters]);
      break;
      case StoryElementEnum.object:
        setElements([...narrativeDataManager.objects]);
      break;
      case StoryElementEnum.background:
        setElements([...narrativeDataManager.backgrounds]);
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
        onSelect={(k) => setKey(Number.parseInt(k))}
        className="mb-3" >
        <Tab eventKey={StoryElementEnum.character} title="Personaggi">
          <Button onClick={() => setCharacterModal(true)}>Aggiungi Personaggio</Button>
          <AddElementModal
            modal={characterModal}
            setModal={setCharacterModal}
            type={StoryElementEnum.character}
            title={commonHeaderString + "personaggio"}
            onSubmit={onSubmitNewCharacter} />
        </Tab>
        <Tab eventKey={StoryElementEnum.object} title="Oggetti">
          <Button onClick={() => setObjectModal(true)}>Aggiungi Oggetto</Button>
          <AddElementModal
            modal={objectModal}
            setModal={setObjectModal}
            type={StoryElementEnum.object}
            title={commonHeaderString + "oggetto"}
            onSubmit={onSubmitNewObject} />
        </Tab>
        <Tab eventKey={StoryElementEnum.background} title="Luoghi">
          <Button onClick={() => setLocationModal(true)}>Aggiungi Luogo</Button>
          <AddElementModal
            modal = {locationModal}
            setModal = {setLocationModal}
            type = {StoryElementEnum.background}
            title = {commonHeaderString + "luogo"}
            onSubmit = {onSubmitNewLocation} />
        </Tab>
      </Tabs>
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
