import React, { useState } from "react";

const CharacterEditor = ({ characters, availableCharacters, handleCharactersChange }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Stato per il personaggio selezionato

  const handleCheckboxChange = (character) => {
    const updatedCharacters = characters.includes(character)
      ? characters.filter((c) => c !== character)
      : [...characters, character];
    handleCharactersChange(updatedCharacters);
  };

  const handleAddCharacter = () => {
    if (selectedCharacter && !characters.includes(selectedCharacter)) {
      handleCharactersChange([...characters, selectedCharacter]);
      setSelectedCharacter(null); // Resetta la selezione dopo l'aggiunta
    }
  };

  // Filtra i personaggi già selezionati dalle opzioni disponibili
  const filteredAvailableCharacters = availableCharacters.filter(
    (character) => !characters.includes(character)
  );

  return (
    <div>
      {characters.map((character) => (
        <label key={character.name} style={{ display: "block", margin: "5px 0" }}>
          {character.name}
        </label>
      ))}

      {/* Selettore per l'aggiunta di un personaggio */}
      <div style={{ margin: "10px 0" }}>
        <select 
          value={selectedCharacter ? selectedCharacter.name : ""}
          onChange={(e) => {
            const character = filteredAvailableCharacters.find(c => c.name === e.target.value);
            setSelectedCharacter(character);
          }}
        >
          <option value="" disabled>Aggiungi un personaggio</option>
          {filteredAvailableCharacters.map((character) => (
            <option key={character.name} value={character.name}>
              {character.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddCharacter} style={{ marginLeft: "10px" }}>
          +
        </button>
      </div>
    </div>
  );
};

export default CharacterEditor;
