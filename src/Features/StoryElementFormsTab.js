import { Tabs, Tab } from "react-bootstrap";
import StoryElementContainerForm from "./StoryElementContainerForm";
import NarrativeDataManager from "../StoryElements/NarrativeDataManager";
import CharacterContainer from "../StoryElements/CharacterContainer";
import ObjectContainer from "../StoryElements/ObjectContainer";
import BackgroundContainer from "../StoryElements/BackgroundContainer";
import StoryElementComponent from "./StoryElementComponent";
import { useEffect, useState } from "react";

const StoryElementFormsTab = ({}) => {
  const [key, setKey] = useState("characters");
  const [elements, setElements] = useState([]);
  const narrativeDataManager = NarrativeDataManager.getInstance();

  useEffect(() => {
    switch (key) {
      case "characters":
        setElements([...narrativeDataManager.characterContainers]);
        break;
      case "objects":
        setElements([...narrativeDataManager.objectContainers]);
        break;
      case "backgrounds":
        setElements([...narrativeDataManager.backgroundContainers]);
        break;
      default:
        console.error("Tab key is not valid: ", key);
        break;
    }
  }, [key]);

  const handleSubmitCharacterContainerForm = (
    baseDescriptor,
    id,
    description,
    notes
  ) => {
    const character = new CharacterContainer(
      baseDescriptor,
      id,
      description,
      notes
    );
    narrativeDataManager.addCharacter(character);
    // Forza l'aggiornamento dello stato
    setElements([...narrativeDataManager.characterContainers]); // trigger rerender
  };

  const handleSubmitObjectContainerForm = (
    baseDescriptor,
    id,
    description,
    notes
  ) => {
    const object = new ObjectContainer(baseDescriptor, id, description, notes);
    narrativeDataManager.addObject(object);
    // Forza l'aggiornamento dello stato
    setElements([...narrativeDataManager.objectContainers]); // trigger rerender
  };

  const handleSubmitBackgroundContainerForm = (
    baseDescriptor,
    id,
    description,
    notes
  ) => {
    const object = new BackgroundContainer(
      baseDescriptor,
      id,
      description,
      notes
    );
    narrativeDataManager.addBackground(object);
    // Forza l'aggiornamento dello stato
    setElements([...narrativeDataManager.backgroundContainers]); // trigger rerender
  };

  const handlersMap = {
    characters: {
      isIdUnique: (id) => narrativeDataManager.isCharacterContainerIdUnique(id),
      getAvailableTypes: (isVariable) =>
        narrativeDataManager.getCharacterTypes(isVariable),
      handleSubmit: handleSubmitCharacterContainerForm,
    },
    objects: {
      isIdUnique: (id) => narrativeDataManager.isObjectContainerIdUnique(id),
      getAvailableTypes: (isVariable) =>
        narrativeDataManager.getObjectTypes(isVariable),
      handleSubmit: handleSubmitObjectContainerForm,
    },
    backgrounds: {
      isIdUnique: (id) =>
        narrativeDataManager.isBackgroundContainerIdUnique(id),
      getAvailableTypes: (isVariable) =>
        narrativeDataManager.getBackgroundTypes(isVariable),
      handleSubmit: handleSubmitBackgroundContainerForm,
    },
  };

  const currentHandlers = handlersMap[key] || {};

  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="characters" title="Characters"></Tab>
        <Tab eventKey="objects" title="Objects"></Tab>
        <Tab eventKey="backgrounds" title="Backgrounds"></Tab>
      </Tabs>
      {elements.map((element) => (
        <StoryElementComponent
          key={"Tab:StoryElement:" + element.id}
          element={element}
          additionalName="Tab"
        />
      ))}

      {currentHandlers.handleSubmit && (
        <StoryElementContainerForm
          isIdUnique={currentHandlers.isIdUnique}
          getAvailableTypes={currentHandlers.getAvailableTypes}
          handleSubmitContainer={currentHandlers.handleSubmit}
        />
      )}
    </>
  );
};

export default StoryElementFormsTab;
