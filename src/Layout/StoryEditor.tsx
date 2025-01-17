import { Button, Card, Col, ListGroup, Row, Spinner, Stack } from "react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Story from "../StoryElements/Story.ts";
import ActionListElement from "./ActionListElement.tsx";
import StoryFlowChartViewer from "../Flow/StoryFlowChartViewer.tsx";
import Template from "../StoryElements/Template.ts";
import TemplateDetails from "./TemplateDetails.tsx";

function StoryEditor(props: {
	stories: Map<string, Template>,
	setStories: React.Dispatch<React.SetStateAction<Map<string, Template>>>
}) {
	const [id, setId] = useState<string>();
	const [template, setTemplate] = useState<Template>();
	const [fileUploading, setFileUploading] = useState(false);

	const navigate = useNavigate();

	const fileUpload = useRef<HTMLInputElement>(null);

	const onClickDelete = useCallback((id: string) => {
		props.setStories(stories => {
			const newStories = new Map(stories);
			newStories.delete(id);
			return newStories})
	}, [props.setStories]);
	
	const onUpload = useCallback(async (files?: FileList) => {
		if (!files) return;
		try {
			setFileUploading(true);
			const newStories: [string, Template][] = [];
			for (const file of Array.from(files)) {
				await file.text().then(fileText => newStories.push([uuidv4(), new Template(Story.fromJSON(fileText))]));
			}
			props.setStories(stories => new Map([...stories, ...newStories]));
			setFileUploading(false);
    } catch(err) {
      console.error(err);
    }
	}, [props.setStories])

	const onAdd = useCallback(() => {
		props.setStories(stories => new Map(stories).set(uuidv4(), new Template()));
	}, [props.setStories]);

	useEffect(() => {
		if (id && template)
			props.setStories(stories =>
				new Map(stories).set(id, new Template(template.template, template.instances)));
	}, [props.setStories, template])
	
	return (
		<Col style={{height:"100%"}}>
			<Row style={{height:"10%", alignItems:"center"}}>
				<h3>Story Editor</h3>
			</Row>
			<Row style={{height:"90%"}}>
				<Col sm={3} style={{height:"100%"}}>
					<Card style={{height:"100%"}}>
						<Card.Header>
							<Stack gap={1} direction="horizontal">
								<h5> Template Salvati </h5>
								<Button variant="primary" className={"ms-auto"} onClick={onAdd}>
									<i className="bi bi-file-earmark-plus"/>
								</Button>
								<Button variant="primary" onClick={() => fileUpload.current?.click()}>							
									{fileUploading ?
										<Spinner size="sm" /> : <i className="bi bi-cloud-upload" />}
								</Button>
								<input
									ref={fileUpload}
									id="upload-story"
									type="file"
									accept=".story"
									multiple
									onChange={e => onUpload((e.target as HTMLInputElement).files!)}
									style={{display:"none"}}
								/>
							</Stack>
						</Card.Header>
						<Card.Body style={{padding:"0", maxHeight:"100%", overflow:"auto"}}>
							<ListGroup variant="flush">
								{[...props.stories.keys()].map(id =>
									<ListGroup.Item key={id}>
										<ActionListElement
											leftSide={
												<Button variant="danger" onClick={() => onClickDelete(id)}>
													<i className="bi bi-trash" aria-label="delete" /> 
												</Button>}
											rightSide={
												<Button variant="secondary" onClick={() => navigate(`${id}`)}>
													<i className="bi bi-pencil-square" aria-label="edit"/>
												</Button>}>
											<ListGroup.Item action onClick={() => {setId(id); setTemplate(props.stories.get(id));}} style={{width:"100%"}}>
												{props.stories.get(id)!.template.flow.nodes.length === 0 ? 
													<i>{props.stories.get(id)!.template.title}</i>
												:
													props.stories.get(id)!.template.title
												}
											</ListGroup.Item>
										</ActionListElement>
									</ListGroup.Item>)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
					<Col style={{height:"100%"}}>
						<Card style={{height:"100%"}}>
							{id && template &&
								<>
									<Card.Header>
										<h5>{template.template.title}</h5>
									</Card.Header>
									<Card.Body>
										<Card style={{height:"40%"}}>
											<StoryFlowChartViewer story={template.template} id={id}/>
										</Card>
										<Row style={{height:"60%"}}>
										<TemplateDetails
											template={template}
											setTemplate={setTemplate} />
										</Row>
									</Card.Body>
								</>
						}
					</Card>
				</Col>
			</Row>
		</Col>
	);
}

export default StoryEditor;