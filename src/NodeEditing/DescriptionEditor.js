const DescriptionEditor = ({ language, levels, descriptions, handleDescriptionChange }) => {
  return (
    <div key={language}>
      <h5>Lingua: {language}</h5>
      {levels.map((level) => (
        <div key={level}>
          <label>{level} Description:</label>
          <textarea
            value={descriptions[language]?.[level] || ""}
            onChange={(e) =>
              handleDescriptionChange(language, level, e.target.value)
            }
            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default DescriptionEditor;