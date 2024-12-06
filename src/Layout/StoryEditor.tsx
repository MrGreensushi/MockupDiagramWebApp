import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import StoryFlowDiagram from "../Flow/StoryFlowDiagram.tsx";
import StoryElements from "./StoryElements.tsx";
import Story from "../StoryElements/Story.ts";
import { initBlocks } from "../Blockly/Blocks.ts";
import DynamicTextField from "./DynamicTextField.tsx";

function StoryEditor() {
    const [story, setStory] = useState(new Story([], [], []));

    useEffect(() => initBlocks(), []);

    const handleSubmit = (title: string) => {
        setStory(story => story.cloneAndSetTitle(title));
    }

    return (
        <Col>
            <DynamicTextField
                initialValue={story.title}
                onSubmit={handleSubmit}
                baseProps={{size:"lg"}} />
            <Row>
                <Col xs={3}>
                <StoryElements 
                    story={story}
                    setStory={setStory} />
                </Col>
                <Col>
                <StoryFlowDiagram
                    story={story}
                    setStory={setStory}/>
                </Col>
            </Row>
        </Col>
    );
}

export default StoryEditor;