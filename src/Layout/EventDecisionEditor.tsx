import React, { useEffect, useState } from "react";
import ActivityDetails from "./ActivityDetails.tsx";

function EventDecisionEditor(props: {
  notes: string;
  updateEventDecision: (newName?: string, notes?: string) => void;
}) {
  const [notes, setNotes] = useState(props.notes);

  useEffect(() => {
    setNotes(props.notes);
  }, [props.notes]);

  const handleNotesUpdate = (newDetails: string) => {
    console.log("EventDecisionEditor:handleDetailsUpdate");
    props.updateEventDecision(undefined, newDetails);
  };

  return (
    <ActivityDetails
      title="Notes"
      text={notes}
      handleValueUpdate={handleNotesUpdate}
    />
  );
}

export default EventDecisionEditor;
