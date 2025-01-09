import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import * as Blockly from 'blockly/core';
import { useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';
import { baseToolboxCategories, BlocklyCanvas, convertFromEnumToObjectType, populateCustomToolbox, workspaceConfiguration } from "../Blockly/BlocklyConfiguration.tsx";
import SceneDetails from "./SceneDetails.tsx";
import ElementModal from "./AddElementModal.tsx";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import { PromptElementType } from "./PromptElement.tsx";
import Scene from "../StoryElements/Scene.ts";
import Story from "../StoryElements/Story.ts";
import PromptArea from "./PromptArea.tsx";

function SceneEditor(props: {
	story: Story,
	setStory: React.Dispatch<React.SetStateAction<Story>>,
	scene: Scene,
	setScene: (newScene: Scene) => void,
}) {
	const [promptElements, setPromptElements] = useState<PromptElementType[]>([]);
	const [modal, setModal] = useState(false);
	const [modalType, setModalType] = useState(StoryElementEnum.character);

	const blocklyRef = useRef(null);

	const [title, setTitle] = useState(props.scene?.details.title ?? "");
	const [summary, setSummary] = useState(props.scene?.details.summary ?? "");
	const [time, setTime] = useState(props.scene?.details.time ?? "");
	const [weather, setWeather] = useState(props.scene?.details.weather ?? "");
	const [tone, setTone] = useState(props.scene?.details.tone ?? "");
	const [value, setValue] = useState(props.scene?.details.value ?? "");
	const [blocks, setBlocks] = useState<[string, StoryElementEnum][]>([]);

	const handleWorkspaceChange = useCallback((workspace: Blockly.Workspace) => {
		let workspaceString = javascriptGenerator.workspaceToCode(workspace);
		if (workspaceString.endsWith(",")) {
			workspaceString = workspaceString.slice(0, -1);
		}
		const workspaceObject: PromptElementType[] = JSON.parse("[" + workspaceString + "]");
		setPromptElements(workspaceObject);
	}, []);

	const { workspace } = useBlocklyWorkspace({
		ref: blocklyRef,
		toolboxConfiguration: baseToolboxCategories,
		workspaceConfiguration: workspaceConfiguration,
		onWorkspaceChange: handleWorkspaceChange,
		initialJson: props.scene ? props.scene.workspace : undefined
	});

	const handleSave = () => {
		const newScene = new Scene(workspace!, title, summary, time, weather, tone, value);
		props.setScene(newScene);
	}

	const onClickAdd = (type: StoryElementEnum) => {
		setModalType(type);
		setModal(true);
	}

	const onSubmitNewElement = (newElement: StoryElementType, type: StoryElementEnum): boolean => {
		if (!props.story.canAddElement(newElement, type)) return false;
		props.setStory(story => story.cloneAndAddElement(newElement, type))
		workspace?.refreshToolboxSelection();
		return true;
	}

	const handleBlur = () => {
		handleSave();
	}

	useEffect(() => {
		if (workspace) populateCustomToolbox(props.story, workspace, onClickAdd);
	}, [props.story, workspace]);

	useEffect(() => {
		if (workspace) {
			workspace.clear();
			let stack: Blockly.BlockSvg | undefined;
			blocks.forEach(blockInfo => {
				const block = workspace.newBlock(convertFromEnumToObjectType(blockInfo[1]));
				block.setFieldValue(blockInfo[0], blockInfo[1] === null ? "TextContent" : "SceneObjectName");

				if (stack) stack.nextConnection.connect(block.previousConnection);
				block.initSvg();
				stack = block;
			});
			workspace.render();
			workspace.scrollCenter()
		}
	}, [blocks])

	return (
		<Col>
			<ElementModal
				modal={modal}
				setModal={setModal}
				modalAction="add"
				elementType={modalType}
				onSubmit={element => onSubmitNewElement(element, modalType)} />
			<Row>
				<Col xs={6}>
					<BlocklyCanvas
						blocklyRef={blocklyRef}
						onBlur={handleBlur} />
				</Col>
				<Stack gap={2} style={{width:"50%"}}>
					<SceneDetails
						title={title}
						setTitle={setTitle}
						summary={summary}
						setSummary={setSummary}
						time={time}
						setTime={setTime}
						weather={weather}
						setWeather={setWeather}
						tone={tone}
						setTone={setTone}
						value={value}
						setValue={setValue}
						onBlur={handleBlur} />
					<PromptArea
						initialText={
							promptElements.map(e => {
								if (e.type === "SceneCharacterObject" || e.type === "SceneObjectObject" || e.type === "SceneLocationObject") return `@${e.outputText}`
								else return e.outputText ?? ""
							}).join("")
						}
						story={props.story}
						setBlocks={setBlocks}
						onBlur={handleBlur} />
				</Stack>
			</Row>
		</Col>
	);
}

export default SceneEditor;