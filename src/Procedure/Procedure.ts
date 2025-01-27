import { ReactFlowJsonObject } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import Activity from "./Activity.ts";

class Procedure {
  id: string;
  flow: ReactFlowJsonObject;
  title: string;
  parentId?: string;

  constructor(
    flow: ReactFlowJsonObject = {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    title?: string,
    id?: string,
    parentId?: string
  ) {
    this.flow = flow;
    this.title = title ?? "Procedura senza titolo";
    this.id = id ?? uuidv4();
    this.parentId = parentId;
  }

  clone(): Procedure {
    return new Procedure(this.flow, this.title, this.id, this.parentId);
  }

  cloneAndSet(
    flow = this.flow,
    title = this.title,
    id = this.id,
    parentId = this.parentId
  ) {
    this.flow = flow;
    this.title = title;
    this.id = id;
    this.parentId = parentId;
    return this.clone();
  }

  toJSONMethod() {
    return JSON.stringify(this);
  }

  static fromParsedJSON(object: any) {
    const flow = object.flow;

    //each activity node must be instantiate as Activity class
    const nodes = flow.nodes.map((node) => {
      const activity = node.data.activity;
      if (!activity) return node;

      const parsedActivity = Activity.fromJSONObject(activity);
      return { ...node, data: { activity: parsedActivity } };
    });

    const newFlow = { ...flow, nodes: nodes };

    return new Procedure(newFlow, object.title, object.id, object.parentId);
  }

  isEmpty() {
    return this.flow.nodes.length <= 0;
  }

  getNodeById(id: string) {
    return this.flow.nodes.find((x) => x.id === id);
  }
  getNodeByItsSubProcedureId(id: string) {
    return this.flow.nodes.find((x) => {
      const activity = x.data?.activity as Activity;
      if (!activity) return false;

      return activity.subProcedureId === id;
    });
  }
}

export default Procedure;
