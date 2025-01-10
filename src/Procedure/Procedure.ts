import { ReactFlowJsonObject } from "@xyflow/react";

class Procedure {
  flow: ReactFlowJsonObject;
  title: string;

  constructor(
    flow: ReactFlowJsonObject = {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    title?: string
  ) {
    this.flow = flow;
    this.title = title ?? "Procedura senza titolo";
  }

  clone(): Procedure {
    return new Procedure(this.flow, this.title);
  }

  cloneAndAddFlow(flow: ReactFlowJsonObject): Procedure {
    this.flow = flow;
    return this.clone();
  }

  cloneAndSetTitle(title: string): Procedure {
    this.title = title;
    return this.clone();
  }

  toJSONMethod() {
    return JSON.stringify(this);
  }

  static fromJSON(json: string) {
    const obj = JSON.parse(json);
    return new Procedure(obj.flow, obj.title);
  }
}

export default Procedure;
