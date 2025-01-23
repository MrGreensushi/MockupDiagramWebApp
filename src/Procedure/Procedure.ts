import { ReactFlowJsonObject } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

class Procedure {
  id: string;
  flow: ReactFlowJsonObject;
  title: string;

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
  }

  clone(): Procedure {
    return new Procedure(this.flow, this.title, this.id);
  }

  cloneAndSet(flow = this.flow, title = this.title, id = this.id) {
    this.flow = flow;
    this.title = title;
    this.id = id;
    return this.clone();
  }

  toJSONMethod() {
    return JSON.stringify(this);
  }

  static fromJSON(json: string) {
    const obj = JSON.parse(json);
    return new Procedure(obj.flow, obj.title, obj.id);
  }
}

export default Procedure;
