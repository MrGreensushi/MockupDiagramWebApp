import React, { useEffect, useState } from "react";
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

  /**
   * Updates the activity in the parent ccmponent with the new phrases, details, and notes.
   *
   * @param {Phrase[]} [newPhrases] - Optional new phrases to update the activity with. If not provided, the current phrases are used.
   * @param {string} [newDetails] - Optional new details to update the activity with. If not provided, the current details are used.
   * @param {string} [newNotes] - Optional new notes to update the activity with. If not provided, the current notes are used.
   */
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

  /**
   * Updates the phrases for a given clip ID with the provided text for the different levels.
   * After the update is done, it sends the new phrases to the parent component.
   *
   * @param {string} clipId - The ID of the clip to update.
   * @param {string} noviceText - The text for the novice level.
   * @param {string} [intermediateText] - The text for the intermediate level (optional).
   * @param {string} [expertText] - The text for the expert level (optional).
   * @param {string} [newClipId] - A new clip ID to replace the original clip ID (optional).
   */
  const handlePhraseUpdate = (
    clipId: string,
    noviceText: string,
    intermediateText?: string,
    expertText?: string,
    newClipId?: string
  ) => {
    const newClip = newClipId ?? clipId;
    const novicePhrase =
      noviceText !== undefined
        ? new Phrase(newClip, LevelsEnum.novice, noviceText)
        : undefined;
    const intermediatePhrase =
      intermediateText !== undefined
        ? new Phrase(newClip, LevelsEnum.intermediate, intermediateText)
        : undefined;
    const expertPhrase =
      expertText !== undefined
        ? new Phrase(newClip, LevelsEnum.expert, expertText)
        : undefined;

    setPhrases((oldPhrases) => {
      var newPhrases = updateOrAdd(oldPhrases, clipId, novicePhrase);
      newPhrases = updateOrAdd(newPhrases, clipId, intermediatePhrase);
      newPhrases = updateOrAdd(newPhrases, clipId, expertPhrase);
      handleSave(newPhrases);
      return newPhrases;
    });
  };

  /**
   * Updates or adds a new phrase to the array of phrases.
   *
   * @param {Phrase[]} arr - The array of phrases.
   * @param {string} clipId - The clip ID to match the phrase.
   * @param {Phrase} [newPhrase] - The new phrase to add or update.
   * @returns {Phrase[]} A new array with the updated or added phrase.
   */
  const updateOrAdd = (arr: Phrase[], clipId: string, newPhrase?: Phrase) => {
    if (!newPhrase) return [...arr];

    const index = arr.findIndex(
      (x) => x.clipId === clipId && x.level === newPhrase.level
    );
    if (index < 0) return [...arr, newPhrase];
    var copy = [...arr];
    copy[index] = newPhrase;
    return [...copy];
  };

  /**
   * Updates the details state and triggers the save handler with the new details.
   *
   * @param {string} newNotes - The new notes to be set and saved.
   */
  const handleDetailsUpdate = (newDet: string) => {
    setDetails(newDet);
    handleSave(undefined, newDet);
  };

  /**
   * Updates the notes state and triggers the save handler with the new notes.
   *
   * @param {string} newNotes - The new notes to be set and saved.
   */
  const handleNotesUpdate = (newNotes: string) => {
    setNotes(newNotes);
    handleSave(undefined, undefined, newNotes);
  };

  /**
   * Removes a phrase from the list of phrases based on the provided clipId.
   *
   * @param {string} clipId - The unique identifier of the clip to be removed.
   * @returns {void}
   */
  const removePhrase = (clipId: string) => {
    setPhrases((oldPhrases) => {
      const filtered = oldPhrases.filter((x) => x.clipId !== clipId);
      handleSave(filtered);
      return filtered;
    });
  };

  /**
   * Instantiates an ActivityPhrases component with the provided parameters.
   *
   * @param {string} clipId - The unique identifier for the clip.
   * @param {number} indexOfNovicePhrase - The index of the novice phrase.
   * @param {string} noviceText - The text for the novice level.
   * @param {string} [intermediateText] - The text for the intermediate level (optional).
   * @param {string} [advanceText] - The text for the advanced level (optional).
   * @returns {JSX.Element} The instantiated ActivityPhrases component.
   */
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

  /**
   * Groups phrases by their clipId and instantiate an ActivityPhrases component containing information about each level of that clipId.
   *
   * @returns An array of ActivityPhrases components, each containing information about the novice, intermediate, and expert levels of a clipId.
   *
   * The function performs the following steps:
   * 1. Groups all the phrases based on their clipId and stores the index in the array for checking the clipId.
   * 2. For each group, it creates an object containing all the information about each level of that clipId.
   * 3. Uses the `instantiateActivityPhrase` function to create an ActivityPhrases component for each object.
   */
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

  /**
   * Adds a new phrase to the list of phrases.
   *
   * This function generates a new phrase with a unique ID based on the current length of the phrases array,
   * sets its level to novice, and initializes it with an empty string. The new phrase is then added to the
   * existing list of phrases, and the updated list is saved using the handleSave function.
   *
   * @returns {void}
   */
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

  /**
   * Checks if a given clip ID are associated other novice level phrases.
   *
   * @param clip - The clip ID to check.
   * @param indexOfNovicePhrase - The index of the novice phrase to exclude from the check.
   * @returns `true` if there is another novice level phrase with the same clip ID, `false` otherwise.
   */
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
