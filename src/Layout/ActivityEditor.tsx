import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ActivityDetails from "./ActivityDetails.tsx";

import Activity, { LevelsEnum, Phrase } from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";

function ActivityEditor(props: {
  procedure: Procedure;
  setStory: React.Dispatch<React.SetStateAction<Procedure>>;
  activity: Activity;
  setActivity: (newActivity: Activity) => void;
}) {
  const [name, setName] = useState(props.activity?.name ?? "");
  const [phrases, setPhrases] = useState(props.activity?.nodePhrases ?? []);

  const handleSave = () => {
    console.log("ActivityEditor:HandleSave");
    setPhrases((prevValue) => {
      const newActivity = new Activity(name, prevValue);
      props.setActivity(newActivity);
      return prevValue;
    });
  };

  const handePhraseUpdate = (
    id: number,
    clipId: string,
    level: LevelsEnum,
    text: string
  ) => {
    console.log("ActivityEditor:HandlePhraseUpdate");
    setPhrases((prevPhrases) =>
      prevPhrases.map((phrase, index) => {
        if (index != id) return { ...phrase };
        console.log("PrhaseModified: " + clipId + " " + level + " " + text);
        const newPhrase = new Phrase(clipId, level, text);
        return { ...newPhrase };
      })
    );
  };

  return (
    <Col onBlur={handleSave}>
      <Row>
        <Col>
          {phrases.map((phrase, index) => (
            <ActivityDetails
              key={index}
              phrase={phrase}
              handlePhraseUpdate={(
                clipId: string,
                level: LevelsEnum,
                text: string
              ) => handePhraseUpdate(index, clipId, level, text)}
            />
          ))}
        </Col>
      </Row>
      <Button
        onClick={() =>
          setPhrases((prePhrases) => [
            ...prePhrases,
            new Phrase("Nuovo", LevelsEnum.novice, ""),
          ])
        }
      >
        +
      </Button>
    </Col>
  );
}

export default ActivityEditor;
