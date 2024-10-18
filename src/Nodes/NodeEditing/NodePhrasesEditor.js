import { useState } from "react";
import DoubleClickModifies from "../../Features/DoubleClickModifies";

const NodePhrasesEditor = ({
  language,
  levels,
  nodePhrases,
  handleNodePhraseChange,
}) => {
  const handleNodePhraseUpdate = (level, newClipId, text, oldClipId) => {
    handleNodePhraseChange(language, level, newClipId, text, oldClipId);
  };

  return (
    <div>
      {levels.map((level) => (
        <div key={language + ":PhraseEditor:" + level}>
          <h6>{level}:</h6>
          {nodePhrases[language][level].map((element, index) => (
            /* <div
               key={
                 language + ":PhraseEditor:" + level + ":" + element["clipId"] ||
                 index
               }
             >
               <label>{element["clipId"]}</label>
               <textarea
                 value={element.text || ""}
                 onChange={(e) =>
                   handleNodePhraseChange(
                     language,
                     level,
                     element.clipId,
                     e.target.value
                   )
                 }
                 style={{
                   width: "100%",
                   padding: "5px",
                   marginBottom: "10px",
                 }}
               />
             </div>*/
            <NodePhraseEditor
              key={
                language + ":PhraseEditor:" + level + ":" + element["clipId"] ||
                language + ":PhraseEditor:" + level + ":" + index
              }
              clipId={element["clipId"]}
              phraseText={element.text}
              handlePhraseChange={(newClipId, newText) =>
                handleNodePhraseChange(
                  language,
                  level,
                  newClipId,
                  newText,
                  element["clipId"]
                )
              }
            />
          ))}

          <button
            onClick={() =>
              handleNodePhraseUpdate(
                level,
                "New Clip " + nodePhrases.count(language, level),
                "...",
                null
              )
            }
          >
            Add Clip Id
          </button>
        </div>
      ))}
    </div>
  );
};

const NodePhraseEditor = ({ clipId, phraseText, handlePhraseChange }) => {
  const style = { width: "100%", padding: "5px", marginBottom: "10px" };

  return (
    <div>
      <DoubleClickModifies
        value={clipId}
        style={style}
        updateFunction={(newClipId) =>
          handlePhraseChange(newClipId, phraseText)
        }
        divClassName={""}
      />
      <textarea
        value={phraseText || ""}
        onChange={(e) => handlePhraseChange(clipId, e.target.value)}
        style={style}
      />
    </div>
  );
};

export default NodePhrasesEditor;

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
