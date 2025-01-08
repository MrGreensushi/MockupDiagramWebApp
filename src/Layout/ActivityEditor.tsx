import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ActivityDetails from "./ActivityDetails.tsx";

import Activity, { LevelsEnum, Phrase } from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";

function ActivityEditor(props: {
  procedure: Procedure;
  activity: Activity;
  setActivity: (newActivity: Activity) => void;
}) {
  const [name, setName] = useState(props.activity?.name ?? "");
  const [phrases, setPhrases] = useState(props.activity?.nodePhrases ?? []);

  const availableLevelsForClipId = (clipId: string) => {
    var toRet = [true, true, true];

    //use Set per avere il dato aggiornato
    var filtered = phrases.filter((x) => x.clipId === clipId);
    toRet = [
      filtered.some((x) => x.level === LevelsEnum.novice),
      filtered.some((x) => x.level === LevelsEnum.intermediate),
      filtered.some((x) => x.level === LevelsEnum.expert),
    ];

    return toRet;
  };

  const evaluateUnavailableLvls = (phrases: Phrase[]) => {
    var clipIds = [...new Set(phrases.map((x) => x.clipId))];
    var unavailableLevels: { clipId: string; unavailableLevels: boolean[] }[] =
      [];
    clipIds.forEach((clipId) => {
      var lvls = availableLevelsForClipId(clipId);
      unavailableLevels.push({ clipId: clipId, unavailableLevels: lvls });
    });

    return unavailableLevels;
  };

  let unavailableLvls = useMemo(() => {
    return evaluateUnavailableLvls(phrases);
  }, [phrases]);

  const handleSave = (newActivity: Activity) => {
    console.log("ActivityEditor:HandleSave");
    console.log(newActivity);
    props.setActivity(newActivity);
  };

  const handlePhraseUpdate = useCallback(
    (id: number, clipId: string, level: LevelsEnum, text: string) => {
      //check already existing clip and level
      const sameClipandLevel = phrases.filter(
        (x, index) => x.clipId === clipId && x.level === level && index !== id
      );
      if (sameClipandLevel.length > 0) {
        console.warn(
          `Same clip ${clipId} and level ${level}: ${sameClipandLevel.length}`
        );
        return;
      }

      setPhrases((prevPhrases) => {
        const newPhrases = prevPhrases.map((phrase, index) =>
          index !== id ? phrase : new Phrase(clipId, level, text)
        );

        handleSave(new Activity(name, props.activity.subProcedure, newPhrases));
        return newPhrases;
      });
    },
    []
  );

  const instantiateActivitiesDetails = () => {
    return phrases.map((phrase, index) =>
      instantiateActivityDetails(
        index,
        phrase,
        unavailableLvls.find((x) => x.clipId === phrase.clipId)
          ?.unavailableLevels ?? [true, false, false]
      )
    );
  };

  const instantiateActivityDetails = (
    index: number,
    phrase: Phrase,
    unavailableLvl: boolean[]
  ) => {
    return (
      <ActivityDetails
        key={index}
        phrase={phrase}
        unavailableLevels={unavailableLvl}
        handlePhraseUpdate={(clipId: string, level: LevelsEnum, text: string) =>
          handlePhraseUpdate(index, clipId, level, text)
        }
        checkValidClipId={(name: string, level: LevelsEnum) =>
          checkClipIdName(name, level, index)
        }
      />
    );
  };

  const addNewPhrase = () => {
    setPhrases((prePhrases) => {
      const newPhrases = [
        ...prePhrases,
        new Phrase("Nuovo", LevelsEnum.novice, ""),
      ];

      handleSave(new Activity(name, props.activity.subProcedure, newPhrases));
      return newPhrases;
    });
  };

  const checkClipIdName = (name: string, level: LevelsEnum, id: number) => {
    return phrases.some(
      (x, index) => x.clipId === name && id !== index && x.level === level
    );
  };

  return (
    <Col>
      <Row>
        <Col>{instantiateActivitiesDetails()}</Col>
      </Row>
      <Button onClick={addNewPhrase}>+</Button>
    </Col>
  );
}

export default ActivityEditor;
