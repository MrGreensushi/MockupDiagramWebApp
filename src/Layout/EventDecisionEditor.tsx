import React, { useEffect, useState } from "react";
import ActivityDetails from "./ActivityDetails.tsx";

function EventDecisionEditor(props: {
  details: string;
  updateEventDecision: (newName?: string, details?: string) => void;
}) {
  const [details, setDetails] = useState(props.details);

  useEffect(() => {
    setDetails(props.details);
  }, [props.details]);

  const handleDetailsUpdate = (newDetails: string) => {
    console.log("EventDecisionEditor:handleDetailsUpdate");
    props.updateEventDecision(undefined, newDetails);
  };

  return (
    <div style={{ paddingLeft: "0px" }}>
      <ActivityDetails
        text={details}
        handleDetailsUpdate={handleDetailsUpdate}
      />
    </div>
  );
}

export default EventDecisionEditor;
