import React, { useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
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
    newName?: string,
    notes?: string
  ) => void;
}) {
  const [phrases, setPhrases] = useState<Phrase[]>(
    props.activity?.nodePhrases ?? []
  );

  const [details, setDetails] = useState(props.activity?.details ?? "");
  const [notes, setNotes] = useState(props.activity?.notes ?? "");

  const handleSave = (
    newPhrases?: Phrase[],
    newDetails?: string,
    newNotes?: string
  ) => {
    console.log("ActivityEditor:HandleSave");
    props.setActivity(
      props.activityId,
      newPhrases ?? phrases,
      newDetails ?? details,
      undefined,
      newNotes ?? notes
    );
  };

  const handlePhraseUpdate = (
    clipId: string,
    noviceText: string,
    intermediateText?: string,
    expertText?: string,
    newClipId?: string
  ) => {
    const newClip = newClipId ?? clipId;
    const novicePhrase = noviceText
      ? new Phrase(newClip, LevelsEnum.novice, noviceText)
      : undefined;
    const intermediatePhrase = intermediateText
      ? new Phrase(newClip, LevelsEnum.intermediate, intermediateText)
      : undefined;
    const expertPhrase = expertText
      ? new Phrase(newClip, LevelsEnum.expert, expertText)
      : undefined;

    setPhrases((oldPhrases) => {
      oldPhrases = updateOrAdd(oldPhrases, clipId, novicePhrase);
      oldPhrases = updateOrAdd(oldPhrases, clipId, intermediatePhrase);
      const newPhrases = updateOrAdd(oldPhrases, clipId, expertPhrase);
      handleSave(newPhrases);
      return newPhrases;
    });
  };

  const updateOrAdd = (arr: Phrase[], clipId: string, newPhrase?: Phrase) => {
    if (!newPhrase) return [...arr];

    const index = arr.findIndex(
      (x) => x.clipId === clipId && x.level === newPhrase.level
    );
    if (index < 0) return [...arr, newPhrase];
    arr[index] = newPhrase;
    return [...arr];
  };

  const handleDetailsUpdate = (newDet: string) => {
    setDetails(newDet);
    handleSave(undefined, newDet);
    // handleSave(undefined, newDet, undefined);
  };

  const handleNotesUpdate = (newNotes: string) => {
    setNotes(newNotes);
    handleSave(undefined, undefined, newNotes);
  };

  const removePhrase = (clipId: string) => {
    setPhrases((oldPhrases) => {
      const filtered = oldPhrases.filter((x) => x.clipId !== clipId);
      handleSave(filtered);
      return filtered;
    });
  };

  const instantiateActivityPhrase = (
    clipId: string,
    indexOfNovicePhrase: number,
    noviceText: string,
    intermediateText?: string,
    advanceText?: string
  ) => {
    return (
      <ActivityPhrases
        key={"ActivityPhrases:" + clipId}
        clipId={clipId}
        noviceText={noviceText}
        intermediateText={intermediateText}
        advanceText={advanceText}
        handlePhraseUpdate={handlePhraseUpdate}
        checkValidClipId={(value: string) =>
          checkClipIdName(value, indexOfNovicePhrase)
        }
        removePhrase={removePhrase}
      />
    );
  };

  const instantiateActivityPhrases = () => {
    //group all the prases based on their clipId (store the index in the array to use for checking the clipId)
    const groupedByClipId: Record<string, { index: number; phrase: Phrase }[]> =
      phrases.reduce((grouped, phrase, index) => {
        if (!grouped[phrase.clipId]) {
          grouped[phrase.clipId] = [];
        }
        grouped[phrase.clipId].push({ index, phrase });
        return grouped;
      }, {});

    //for each group instantiate an object containing all the information about each level of that clipId
    return Object.entries(groupedByClipId).map(([clipId, phrasesArr]) => {
      var noviceText = "";
      var intermediateText: string | undefined = undefined;
      var advanceText: string | undefined = undefined;
      var indexOfNovicePhrase = 0;
      Object.values(phrasesArr).forEach(({ index, phrase }) => {
        switch (phrase.level) {
          case LevelsEnum.novice:
            noviceText = phrase.text;
            indexOfNovicePhrase = index;
            break;
          case LevelsEnum.intermediate:
            intermediateText = phrase.text;
            break;
          case LevelsEnum.expert:
            advanceText = phrase.text;
            break;
        }
      });
      return instantiateActivityPhrase(
        clipId,
        indexOfNovicePhrase,
        noviceText,
        intermediateText,
        advanceText
      );
    });
  };

  const addNewPhrase = () => {
    setPhrases((prePhrases) => {
      const newClipId = "New Phrase" + prePhrases.length;
      const newPhrases = [
        ...prePhrases,
        new Phrase(newClipId, LevelsEnum.novice, ""),
      ];

      handleSave(newPhrases);
      return newPhrases;
    });
  };

  const checkClipIdName = (clip: string, indexOfNovicePhrase: number) => {
    return phrases.some(
      (x, index) =>
        x.clipId === clip &&
        x.level === LevelsEnum.novice &&
        index !== indexOfNovicePhrase
    );
  };

  return (
    <>
      <Tabs defaultActiveKey="Phrases">
        <Tab title="Phrases" eventKey="Phrases">
          {instantiateActivityPhrases()}
          <Button
            className="mt-2"
            style={{ alignSelf: "center" }}
            onClick={addNewPhrase}
          >
            +
          </Button>
        </Tab>
        <Tab title="Details" eventKey="Details">
          <ActivityDetails
            title="Details"
            text={details}
            handleValueUpdate={handleDetailsUpdate}
          />
        </Tab>
        <Tab title="Notes" eventKey="Notes">
          <ActivityDetails
            title="Notes"
            text={notes}
            handleValueUpdate={handleNotesUpdate}
          />
        </Tab>
      </Tabs>
    </>
  );
}

export default ActivityEditor;
