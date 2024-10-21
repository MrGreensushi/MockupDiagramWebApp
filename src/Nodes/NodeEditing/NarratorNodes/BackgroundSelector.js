import React from "react";

const BackgroundSelector = ({ background, availableBackgrounds, handleBackgroundChange }) => {
  return (
    <div>
      <label>Seleziona Background:</label>
      <select
        value={background}
        onChange={(e) => handleBackgroundChange(e.target.value)}
        style={{ display: "block", marginTop: "10px" }}
      >
        {availableBackgrounds.map((bg) => (
          <option key={bg} value={bg}>
            {bg}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BackgroundSelector;
