import { ReactFlowJsonObject } from "@xyflow/react";
import Procedure from "./Procedure.ts";
import Activity from "./Activity";

class SubProcedure extends Procedure {
  parent: SubProcedure | undefined;
  activityParentId: string | undefined;

  constructor(
    flow: ReactFlowJsonObject = {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    title?: string,
    parent?: SubProcedure,
    activityParentId?: string
  ) {
    super(flow, title);
    this.parent = parent;
    this.activityParentId = activityParentId;
  }

  clone(): SubProcedure {
    return new SubProcedure(
      this.flow,
      this.title,
      this.parent,
      this.activityParentId
    );
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
    return JSON.stringify(this);
  }

  static fromJSON(json: string) {
    const obj = JSON.parse(json);
    return new SubProcedure(obj.flow, obj.title, obj.parent);
  }
}

export default SubProcedure;
