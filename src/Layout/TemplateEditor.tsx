import React, { useCallback, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import StoryFlowChartEditor from "../Flow/StoryFlowChartEditor.tsx";
import StoryElements from "./StoryElements.tsx";
import Story from "../StoryElements/Story.ts";
import DynamicTextField from "./DynamicTextField.tsx";
import saveToDisk from "../Misc/SaveToDisk.ts";
import Template from "../StoryElements/Template.ts";

function TemplateEditor(props: {
	stories: Map<string, Template>,
	setStory: (id: string, newStory: Story) => void,
}) {
	const { id } = useParams();

	const [localStory, setLocalStory] = useState(props.stories.get(id!)?.template.clone() ?? new Story());
	const [dirty, setDirty] = useState(false);

	const navigate = useNavigate();

	const handleTitleChange = useCallback((title: string) => {
		setDirty(true);
		setLocalStory(story => story.cloneAndSetTitle(title));
	}, []);

	const handleSave = useCallback((id: string) => {
		props.setStory(id, localStory);
		setDirty(false);
	}, [props.setStory, localStory]);

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
					setStory={story => { setDirty(true); setLocalStory(story) }}
					editMode={true} />
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