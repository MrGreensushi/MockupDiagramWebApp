import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import StoryFlowDiagram from "../Flow/StoryFlowDiagram.tsx";
import StoryElements from "./StoryElements.tsx";
import Story from "../StoryElements/Story.ts";
import { initBlocks } from "../Blockly/Blocks.ts";

function StoryEditor() {
    const [story, setStory] = useState(new Story([], [], []));

    const [title, setTitle] = useState(story.title);
    const [titleFocus, setTitleFocus] = useState(false);

    useEffect(() => initBlocks(), []);

    const handleSubmit = () => {
        setTitleFocus(false);
        setStory(story => story.cloneAndSetTitle(title));
    }

    return (
        <Col>
            <Form onSubmit={e => {e.preventDefault(); handleSubmit()}}>
                <InputGroup>
                    <Form.Control 
                        value={title}
                        plaintext={!titleFocus}
                        readOnly={!titleFocus}
                        onChange={e => setTitle(e.target.value)}
                        onClick={() => setTitleFocus(true)}
                        onBlur={handleSubmit}
                        style={{textAlign:"center", textWrap:"pretty", flexWrap:"nowrap"}}
                        size="lg" />
                    {/*<Button variant="tertiary" hidden={titleFocus}>
                        <i className="bi bi-pencil" aria-label="edit title" />
                    </Button>*/}
                </InputGroup>                
            </Form>
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