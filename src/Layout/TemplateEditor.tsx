import React, { useCallback, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import StoryFlowChartEditor from "../Flow/StoryFlowChartEditor.tsx";
import StoryElements from "./StoryElements.tsx";
import Story from "../StoryElements/Story.ts";
import DynamicTextField from "./DynamicTextField.tsx";
import saveToDisk from "../Misc/SaveToDisk.ts";

function TemplateEditor(props: {
	stories: Map<string, Story>,
	setStories: React.Dispatch<React.SetStateAction<Map<string, Story>>>
}) {
	const { id } = useParams();

	const [localStory, setLocalStory] = useState(props.stories.get(id!)?.clone() ?? new Story([], [], []));
	const [dirty, setDirty] = useState(false);

	const navigate = useNavigate();

	const handleTitleChange = useCallback((title: string) => {
		setDirty(true);
		setLocalStory(story => story.cloneAndSetTitle(title));
	}, []);

	const handleSave = useCallback((id: string) => {
		props.setStories(
			stories => new Map(Array.from(stories).map(
				storyIter => {
					if (storyIter[0] === id)
						return [storyIter[0], localStory.clone()];
					else
						return storyIter;
				}
			)
		));
		setDirty(false);
	}, [props.setStories, localStory]);

	return (
		<Row style={{ height: "100%" }}>
			<Col xs={3}>
				<ButtonGroup size="lg">
					<Button variant="tertiary" onClick={() => navigate("/stories")}>
						<i className="bi bi-house"></i>
					</Button>
					<Button variant={dirty ? "primary" : "tertiary"} onClick={() => handleSave(id!)}>
						<i className="bi bi-floppy"></i>
					</Button>
					<Button variant="tertiary" onClick={() => saveToDisk(localStory.toJSON(), `${localStory.title}.story`, "application/json")}>
						<i className="bi bi-download"></i>
					</Button>
				</ButtonGroup>
				<StoryElements
					story={localStory}
					setStory={story => { setDirty(true); setLocalStory(story) }} />
			</Col>
			<Col className="template-editor" style={{ height: "90vh" }}>
				<DynamicTextField
					initialValue={localStory.title}
					onSubmit={handleTitleChange}
					baseProps={{ className: "story-title", size: "lg" }} />
				<Row style={{ alignItems: "stretch", width: "100%", height: "98%" }} className="gx-0">
					<StoryFlowChartEditor
						story={localStory}
						setStory={story => { setDirty(true); setLocalStory(story) }} />
				</Row>
			</Col>
		</Row>
	);
}

export default TemplateEditor;