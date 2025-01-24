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
		setLocalStory(story => {
		const newStory = story.clone();
		newStory.flow.nodes.map(
			node => {
				if (node.id === sceneId) {
					return {...node, data: {...node.data, scene: newScene.copy()}};
				} else {
					return node;
				}
			}
		);
		return newStory;
		});
	}, []);

	const onClickTabClose = useCallback((id: string) => {
		setOpenScenes(
			sceneIds => sceneIds?.filter(
				sceneId => sceneId !== id));
		setCurrentTab(undefined);
	}, []);

	const onClickEditNode = useCallback((id: string) => {
		if (!openScenes.includes(id))
			setOpenScenes(scenes => {
				const newScenes = Array.from(scenes);
				newScenes.push(id);
				return newScenes.sort();
			});
		setCurrentTab(id);
	}, [openScenes]);

	// Applies fixed width to StoryElements (allows collapsing father without rearranging children)
	useEffect(() => {
		const element = document.getElementById("story-elements-holder")!;
		const computedStyle = getComputedStyle(element);
		setStoryElementsWidth(element.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight));
	}, [])

	return (
		<Container className="h-100" fluid>
			<Button onClick={() => {setSideTab(s => !s)}}></Button>
			<Row style={{alignItems: "center", height: "10%"}}>
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
					<Col xs={3} style={{overflow:"hidden"}} id={"story-elements-holder"}>
						<div style={{width: `${storyElementsWidth}px`}}>
							<StoryElements
								story={localStory}
								setStory={story => { setDirty(true); setLocalStory(story) }}
								editMode={true} />
						</div>
					</Col>
				</Collapse>
				<Col className="utility-tabs">
					<Tabs
						activeKey={currentTab}
						onSelect={k => setCurrentTab(k ?? "structure")}
						unmountOnExit
						navbarScroll
						style={{flexWrap:"nowrap"}}>
						<Tab eventKey="structure" title={<div className="custom-nav-link">Struttura</div>}>
							<Row className="w-100 h-100 gx-0">
								<StoryFlowChartEditor
									story={localStory}
									setStory={story => { setDirty(true); setLocalStory(story) }}
									onClickEditNode={onClickEditNode}/>
							</Row>
						</Tab>
						{openScenes?.map(id => 
							<Tab eventKey={id} key={id} title={
								<div className="custom-nav-link"
									onDoubleClick={e => {e.preventDefault(); onClickTabClose(id)}}
									onAuxClick={e => {e.preventDefault(); onClickTabClose(id)}}>
									{(localStory.flow.nodes.find(node => node.id === id)?.data.label as string)}
								</div>}>
								<SceneEditor
									story={localStory}
									setStory={setLocalStory}
									scene={localStory.flow.nodes.find(node => node.id === id)?.data.scene as Scene}
									setScene={scene => {}}/>
							</Tab>
						)}
					</Tabs>
				</Col>
			</Row>
		</Container>
	);
}

export default TemplateEditor;