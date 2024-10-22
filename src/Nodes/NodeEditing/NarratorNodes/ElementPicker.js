import React, { useState } from "react";
import StoryElementComponent from "./StoryElementComponent";

const ElementPicker = ({
  elements,
  availableElements,
  handleElementsChange,
}) => {
  const handleAddElement = (selectedElement) => {
    if (selectedElement && !elements.includes(selectedElement)) {
      handleElementsChange([...elements, selectedElement]);
    }
  };

  // Filtra i personaggi già selezionati dalle opzioni disponibili
  const filteredAvailableElements = availableElements.filter(
    (element) => !elements.includes(element)
  );

  return (
    <div>
      {elements.map((element) => (
        <StoryElementComponent key={"StoryElement:" +element.type} element={element} />
      ))}

      {/* Selettore per l'aggiunta di un personaggio */}
      <div style={{ margin: "10px 0" }}>
        <select
          value={""}
          onChange={(e) => {
            const element = filteredAvailableElements.find(
              (c) => c.type === e.target.value
            );
            handleAddElement(element);
          }}
        >
          <option value="" disabled>
            Aggiungi elemento
          </option>
          {filteredAvailableElements.map((element) => (
            <option key={"Option: "+element.type} value={element.type}>
              {element.type}
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

export default ElementPicker;
