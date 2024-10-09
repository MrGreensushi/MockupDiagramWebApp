import { useState } from "react";

const NodePhraseEditor = ({
  language,
  levels,
  nodePhrases,
  handleNodePhraseChange,
}) => {
  const booleanValues = {};
  levels.forEach((element) => {
    booleanValues[element] = false;
  });

  const [clipIdToAdd, SetClipIdToAdd] = useState(booleanValues);
  const [selectedClipId,setSelectedClipId]=useState({})

  const HandleAddingClipId = (level) => {
    handleNodePhraseChange(language, level, "New Clip " + Object.keys(nodePhrases[language][level]).length, "...")
  };

  const HandleSelectedClipId=(text)=>{
    setSelectedClipId((previousSelectedClipId)=>({
      ...previousSelectedClipId,
      //[clipId]:text
    }));
  }

  return (
    <div>
      {levels.map((level) => (
        <div key={level}>
          <h6>{level}:</h6>
          {Object.keys(nodePhrases[language][level] || {}).map((clipId) => (
            <div key={clipId}>
              <label>{clipId}</label>
              <textarea
                value={nodePhrases[language][level][clipId] || ""}
                onChange={(e) =>
                  handleNodePhraseChange(
                    language,
                    level,
                    clipId,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "5px",
                  marginBottom: "10px",
                }}
              />
            </div>
          ))}

      
          <button onClick={() => HandleAddingClipId(level)}>Add Clip Id</button>
        </div>
      ))}
    </div>
  );
};

export default NodePhraseEditor;

/*{ <h4>Node Phrases</h4>;
{
  Object.keys(nodePhrases).map((language) => (
    <div key={language}>
      <h5>Lingua: {language}</h5>
      {Object.keys(nodePhrases[language] || {}).map((level) => (
        <div key={level}>
          <h6>{level} Node Phrases:</h6>
          {Object.keys(nodePhrases[language][level] || {}).map((clipId) => (
            <div key={clipId}>
              <label>{clipId}:</label>
              <textarea
                value={nodePhrases[language][level][clipId] || ""}
                onChange={(e) =>
                  handleNodePhraseChange(
                    language,
                    level,
                    clipId,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "5px",
                  marginBottom: "10px",
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ));
} }
*/
