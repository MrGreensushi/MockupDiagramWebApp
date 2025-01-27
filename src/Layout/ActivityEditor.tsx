import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ActivityPhrases from "./ActivityPhrases.tsx";

import Activity, { LevelsEnum, Phrase } from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";
import ActivityDetails from "./ActivityDetails.tsx";

function ActivityEditor(props: {
  procedure: Procedure;
  activityId: string;
  activity: Activity;
  setActivity: (
    id: string,
    newPhrases?: Phrase[],
    details?: string,
    newName?: string
  ) => void;
}) {
  const [phrases, setPhrases] = useState<Phrase[]>(
    props.activity?.nodePhrases ?? []
  );

  const [details, setDetails] = useState(props.activity?.details ?? "");

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

  const handleSave = (newPhrases?: Phrase[], newDetails?: string) => {
    console.log("ActivityEditor:HandleSave");
    props.setActivity(
      props.activityId,
      newPhrases ?? phrases,
      newDetails ?? details
    );
  };

  const handlePhraseUpdate = (
    id: number,
    clipId: string,
    level: LevelsEnum,
    text: string
  ) => {
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

    setPhrases((oldPhrases) => {
      const newPhrases = oldPhrases.map((phrase, index) =>
        index !== id ? phrase : new Phrase(clipId, level, text)
      );
      handleSave(newPhrases);
      return newPhrases;
    });
  };

  const handleDetailsUpdate = (newDet: string) => {
    setDetails(newDet);
    handleSave(undefined, newDet);
    // handleSave(undefined, newDet, undefined);
  };

  const removePhrase = (phraseIndex: number) => {
    setPhrases((oldPhrases) => {
      oldPhrases.splice(phraseIndex, 1);
      handleSave(oldPhrases);
      return oldPhrases;
    });
  };

  const instantiateActivityPhrase = (
    index: number,
    phrase: Phrase,
    unavailableLvl: boolean[]
  ) => {
    return (
      <ActivityPhrases
        key={"ActivityPhrases:" + props.activityId + ":" + index}
        phrase={phrase}
        unavailableLevels={unavailableLvl}
        handlePhraseUpdate={(clipId: string, level: LevelsEnum, text: string) =>
          handlePhraseUpdate(index, clipId, level, text)
        }
        checkValidClipId={(name: string, level: LevelsEnum) =>
          checkClipIdName(name, level, index)
        }
        removePhrase={() => removePhrase(index)}
      />
    );
  };

  const addNewPhrase = () => {
    setPhrases((prePhrases) => {
      const newPhrases = [
        ...prePhrases,
        new Phrase("Nuovo", LevelsEnum.novice, ""),
      ];

      handleSave(newPhrases);
      return newPhrases;
    });
  };

  const checkClipIdName = (name: string, level: LevelsEnum, id: number) => {
    return phrases.some(
      (x, index) => x.clipId === name && id !== index && x.level === level
    );
  };

  return (
    <div style={{ paddingLeft: "0px" }}>
      <ActivityDetails
        text={details}
        handleDetailsUpdate={handleDetailsUpdate}
      />

      {phrases.map((phrase, index) =>
        instantiateActivityPhrase(
          index,
          phrase,
          unavailableLvls.find((x) => x.clipId === phrase.clipId)
            ?.unavailableLevels ?? [true, false, false]
        )
      )}
      <Button
        className="mt-2"
        style={{ alignSelf: "center" }}
        onClick={addNewPhrase}
      >
        +
      </Button>
    </div>
  );
}

export default ActivityEditor;
