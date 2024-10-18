class BaseEdgeData{
    constructor(startLabel,endLabel){
        this.startLabel=startLabel;
        this.endLabel=endLabel;
    }

    static initialize(copyFrom){
        const newData=new BaseEdgeData(copyFrom.startLabel,copyFrom.endLabel)
        return newData
    }
}

export default BaseEdgeData;