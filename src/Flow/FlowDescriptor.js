class FlowDescriptor{
    constructor(initialEdges,initialNodes,name,isMainFlow=false){
        this.edges=initialEdges
        this.nodes=initialNodes
        this.name=name
        this.isMainFlow=isMainFlow
    }
}

export default FlowDescriptor;