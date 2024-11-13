import {Edge, Node} from "@xyflow/react"

class FlowDescriptor{
    edges: Edge[];
    nodes: Node[];
    name: string;
    isMainFlow: boolean;

    constructor(name: string, isMainFlow?: boolean, initialNodes?: Node[], initialEdges?: Edge[]) {
        this.name = name;
        this.isMainFlow = isMainFlow ?? false;
        this.nodes = initialNodes ?? [];
        this.edges = initialEdges ?? [];
    }
}

export default FlowDescriptor;