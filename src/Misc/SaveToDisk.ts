import { ReactFlowJsonObject } from "@xyflow/react";
import Activity from "../Procedure/Activity.ts";
import SubProcedure from "../Procedure/SubProcedure.ts";

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

function instantiateNodeFromJsonObj(
  flow: ReactFlowJsonObject,
  parent: SubProcedure,
  activityCallbacks: any,
) {
  return [...flow.nodes].map((node) => {
    if (node.type === "activityNode")
      return {
        ...node,
        data: {
          ...node.data,
          activity: Activity.fromJSONObject(
            node.data.activity,
            parent,
            activityCallbacks
          ),
         
          onClickSubProcedure: activityCallbacks.onClickSubProcedure,
        },
      };

    // if (node.type === "eventNode")
    return {
      ...node,
      data: {
        ...node.data,
      },
    };
  });
}
export default saveToDisk;
export { instantiateNodeFromJsonObj };
