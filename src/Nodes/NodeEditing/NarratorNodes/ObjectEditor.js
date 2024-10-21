import React from "react";

const ObjectEditor = ({ objects, availableObjects, handleObjectsChange }) => {
  const handleCheckboxChange = (object) => {
    const updatedObjects = objects.includes(object)
      ? objects.filter((o) => o !== object)
      : [...objects, object];
    handleObjectsChange(updatedObjects);
  };

  return (
    <div>
      {availableObjects.map((object) => (
        <label key={object} style={{ display: "block", margin: "5px 0" }}>
          <input
            type="checkbox"
            checked={objects.includes(object)}
            onChange={() => handleCheckboxChange(object)}
          />
          {object}
        </label>
      ))}
    </div>
  );
};

export default ObjectEditor;
