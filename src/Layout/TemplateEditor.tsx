import React, { useCallback, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Collapse, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import StoryFlowChartEditor from "../Flow/StoryFlowChartEditor.tsx";
import StoryElements from "./StoryElements.tsx";
import Story from "../StoryElements/Story.ts";
import DynamicTextField from "./DynamicTextField.tsx";
import saveToDisk from "../Misc/SaveToDisk.ts";
import Template from "../StoryElements/Template.ts";
import Scene from "../StoryElements/Scene.ts";
import SceneEditor from "./SceneEditor.tsx";

function TemplateEditor(props: {
	stories: Map<string, Template>,
	setStory: (id: string, newStory: Story) => void,
}) {
	const { id } = useParams();

	const [localStory, setLocalStory] = useState(props.stories.get(id!)?.template.clone() ?? new Story());
	const [openScenes, setOpenScenes] = useState<string[]>([]);
	const [currentTab, setCurrentTab] = useState<string>();

	const [sideTab, setSideTab] = useState(true);
	const [storyElementsWidth, setStoryElementsWidth] = useState(0);

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

	const onSceneEdited = useCallback((sceneId: string, newScene: Scene) => {
		setLocalStory(story => story.cloneAndSetScene(sceneId, newScene));
	}, []);

	const onClickTabClose = useCallback((id: string) => {
		setOpenScenes(
			sceneIds => sceneIds?.filter(
				sceneId => sceneId !== id));
		if (currentTab === id) setCurrentTab(undefined);
	}, [currentTab]);

	const onClickEditNode = useCallback((id: string) => {
		if (!openScenes.includes(id))
			setOpenScenes(scenes => {
				const newScenes = Array.from(scenes);
				newScenes.push(id);
				return newScenes.sort();
			});
		setCurrentTab(id);
	}, [openScenes]);

	// Applies fixed width to StoryElements (allows collapsing parent without rearranging children)
	useEffect(() => {
		const element = document.getElementById("story-elements-holder")!;
		const computedStyle = getComputedStyle(element);
		setStoryElementsWidth(element.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight));
	}, []);

	return (
		<Container className="h-100" fluid>
			<Row style={{alignItems: "center", height: "10%"}}>
				<Col xs={2}>
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
				</Col>
				<Col>
					<DynamicTextField
						initialValue={localStory.title}
						onSubmit={handleTitleChange}
						baseProps={{ className: "story-title", size: "lg" }} />
				</Col>
			</Row>
			
			<Row style={{height: "90%"}}>
				<Collapse in={sideTab} dimension="width">
					<Col xs={2} className="h-100 px-0 custom-tabs" style={{overflow:"hidden"}} id={"story-elements-holder"}>
						<div className="h-100" style={{width: `${storyElementsWidth}px`}}>
							<StoryElements
								story={localStory}
								setStory={story => { setDirty(true); setLocalStory(story) }}
								editMode={true} />
						</div>
					</Col>
				</Collapse>
				<Col className="pe-0 custom-tabs" style={{position:"relative"}}>
					<Button
						size="lg"
						onClick={() => setSideTab(s => !s)}
						style={{position:"absolute", left:"-1em", top:"5%", zIndex:"10"}}>
						<i className="bi bi-person-lines-fill" />
					</Button>
					<Tabs
						activeKey={currentTab}
						onSelect={k => setCurrentTab(k ?? "structure")}
						navbarScroll
						style={{flexWrap:"nowrap"}}>
						<Tab
							eventKey="structure"
							title={<div className="custom-nav-link">Struttura</div>}
							unmountOnExit>
							<Row className="w-100 h-100 gx-0">
								<StoryFlowChartEditor
									story={localStory}
									setStory={story => { setDirty(true); setLocalStory(story) }}
									onClickEditNode={onClickEditNode}/>
							</Row>
						</Tab>
						{openScenes?.map(id => 
							<Tab eventKey={id} key={id} title={
								<div className="custom-nav-link">
									{(localStory.flow.nodes.find(node => node.id === id)?.data.label as string)}
									<i className="bi bi-x-lg close-button" onClick={(e) => {e.preventDefault(); e.stopPropagation(); onClickTabClose(id)}} style={{pointerEvents:"all"}}></i>
								</div>}
								unmountOnExit>
								<SceneEditor
									story={localStory}
									setStory={setLocalStory}
									scene={localStory.flow.nodes.find(node => node.id === id)?.data.scene as Scene}
									setScene={newScene => onSceneEdited(id, newScene)}/>
							</Tab>
						)}
					</Tabs>
				</Col>
			</Row>
		</Container>
	);
}

export default TemplateEditor;