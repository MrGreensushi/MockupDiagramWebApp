import { ReactFlowJsonObject } from "@xyflow/react";
import Procedure from "./Procedure.ts";
import Activity from "./Activity.ts";
import { instantiateNodeFromJsonObj } from "../Misc/SaveToDisk.ts";

class SubProcedure extends Procedure {
  parent: SubProcedure | undefined;

  constructor(
    flow: ReactFlowJsonObject = {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    title?: string,
    parent?: SubProcedure
  ) {
    super(flow, title);
    this.parent = parent;
  }

  isEmpty(): boolean {
    return this.flow.nodes.length == 0;
  }

  clone(): SubProcedure {
    return new SubProcedure(this.flow, this.title, this.parent);
  }

  cloneAndAddFlow(flow: ReactFlowJsonObject): SubProcedure {
    this.flow = flow;
    return this.clone();
  }

  cloneAndSetTitle(title: string): SubProcedure {
    this.title = title;
    return this.clone();
  }

  toJSON() {
    const { parent, ...rest } = this;
    return { ...rest };
  }

  // static fromJSON(json: string) {
  //   const obj = JSON.parse(json);
  //   return new SubProcedure(obj.flow, obj.title, obj.parent);
  // }

  static fromJSONObject(
    json: any,
    parent: SubProcedure,
    callbacksActivity: any,
    callbacksEvent: any
  ): SubProcedure {
    const subProcedure = new SubProcedure(json.flow, json.title, parent);
    console.log("SubProcedure:FromJSONObject");

    if (subProcedure.flow.nodes.length === 0) return subProcedure;

    console.log(subProcedure.flow.nodes);

    const newNodes = instantiateNodeFromJsonObj(
      subProcedure.flow,
      subProcedure,
      callbacksActivity,
      callbacksEvent
    );

    subProcedure.cloneAndAddFlow({
      nodes: newNodes,
      edges: subProcedure.flow.edges,
      viewport: subProcedure.flow.viewport,
    });
    return subProcedure;
  }
}

export default SubProcedure;
