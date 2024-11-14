import React, { useState } from "react";
import StoryElementComponent from "./StoryElementComponent.tsx";

const ElementContainerPicker = ({
  elements,
  availableElements,
  handleElementsChange,
}) => {
  const handleAddElement = (selectedElement) => {
    handleElementsChange([...elements, selectedElement]);
  };

  // Filtra i personaggi già selezionati dalle opzioni disponibili
  const filteredAvailableElements = availableElements.filter(
    (element) => !elements.some((x) => x.id === element.id)
  );

  return (
    <div>
      {elements.map((element) => (
        <StoryElementComponent
          key={"StoryElement:" + element.id}
          element={element}
        />
      ))}

      {/* Selettore per l'aggiunta di un personaggio */}
      <div style={{ margin: "10px 0" , textAlign:"center"}}>
        <select
          value={""}
          onChange={(e) => {
            const element = filteredAvailableElements.find(
              (c) => c.id === e.target.value
            );
            handleAddElement(element);
          }}
        >
          <option value="" disabled>
            Aggiungi elemento
          </option>
          {filteredAvailableElements.map((element) => (
            <option key={"Option: " + element.id} value={element.id}>
              {element.id}
            </option>
          ))}
        </select>
        {/* <button onClick={} style={{ marginLeft: "10px" }}>
          +
        </button> */}
      </div>
    </div>
  );
};

export default ElementContainerPicker;
