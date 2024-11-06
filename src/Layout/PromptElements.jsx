import PromptElement from "./PromptElement";

function PromptElements({elements, workspace}) {
    if (!elements || elements.length === 0) return;
    
    const checkType = (type) => 
        type === "SceneCharacterObject" ||
        type === "SceneObjectObject" ||
        type === "SceneLocationObject"

    let pendingSpace = false;
    const setPendingSpace = (state) => pendingSpace = state;
    
    let processedList = [];
    
    const setText = (id, text) => {
        const b = workspace.getBlockById(id);
        b.setOutputText(b, text);
    }
    
    for (let i = 0; i < elements.length; i++) {
        if (checkType(elements[i].type)) {
            const listElements = [elements[i]];
            for (let j=i+1; j < elements.length; j++, i++) {
                if (checkType(elements[j].type)) {
                    listElements.push(elements[j]);
                } else {
                    break;
                }
            }
            if (listElements.length == 1) {
                processedList.push(...listElements);
            } else {
                processedList.push({id: "List " + listElements[0].id, type: "List", elements: listElements});
            }
        } else {
            processedList.push(elements[i]);
        }
    }

    return(
        <div>
            {processedList.map((e, idx) => <PromptElement
                element={e}
                pendingSpace = {pendingSpace}
                setPendingSpace = {setPendingSpace}
                setText = {setText}
                key = {idx} />
            )}
        </div>
    )
}

export default PromptElements;