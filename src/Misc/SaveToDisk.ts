import Activity from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";

function saveToDisk(object: any, fileName?: string, fileType?: string) {
  if (!object) return;
  const name = fileName ?? "Download";
  const type = fileType ?? "text/plain";

  const blob = new Blob([object], { type: type });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = name;
  link.click();
  link.remove();
}

const getProceduresFromJSON = (json: string) => {
  const parsedProcedures: any[] = JSON.parse(json);
  //must instantiate each parse object as Procedure
  const asProcedures = parsedProcedures.map((data) =>
    Procedure.fromParsedJSON(data)
  );

  return asProcedures;
};

const getAllActivitiesDescriptionsFromProcedures = (
  proceduresArray: Procedure[]
) => {
  var activities: Activity[] = [];
  proceduresArray.forEach((procedure) => {
    activities = activities.concat(getAllActivitiesFromProcedure(procedure));
  });

  const uniqueActivitites = activities.filter((activity, index) => {
    const ind = activities.findIndex((x) => x.name === activity.name);
    return ind === index;
  });
  return uniqueActivitites.map((activity) => activity.getActivityDescription());
};

const getAllActivitiesFromProcedure = (procedure: Procedure) => {
  const activityNodes = procedure.flow.nodes.filter(
    (node) => node.data.activity
  );
  const activities = activityNodes.map(
    (node) => node.data.activity as Activity
  );
  return activities;
};

const getActivitiesDescriptionFromJSON = (json: string) => {
  const asProcedures = getProceduresFromJSON(json);
  return getAllActivitiesDescriptionsFromProcedures(asProcedures);
};

export {
  saveToDisk,
  getProceduresFromJSON,
  getAllActivitiesDescriptionsFromProcedures,
  getAllActivitiesFromProcedure,
  getActivitiesDescriptionFromJSON,
};
