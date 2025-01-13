import { Button, Card, Col, FormLabel, ListGroup, Row, Spinner, Stack } from "react-bootstrap";
import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Story from "../StoryElements/Story.ts";
import ActionListElement from "./ActionListElement.tsx";
import StoryFlowChartViewer from "../Flow/StoryFlowChartViewer.tsx";

function StoryEditor(props: {
	stories: Map<string, Story>,
	setStories: React.Dispatch<React.SetStateAction<Map<string, Story>>>
}) {
	const [id, setId] = useState<string>();
	const [fileUploading, setFileUploading] = useState(false);

	const navigate = useNavigate();

	const fileUpload = useRef<HTMLInputElement>(null);

	const onClickDelete = useCallback((id: string) => {
		props.setStories(stories => {
			const newStories = new Map(stories);
			newStories.delete(id);
			return newStories})
	}, []);
	
	const onUpload = useCallback(async (files?: FileList) => {
		if (!files) return;
		try {
			setFileUploading(true);
			const newStories: [string, Story][] = [];
			for (const file of Array.from(files)) {
				await file.text().then(fileText => newStories.push([uuidv4(), Story.fromJSON(fileText)]));
			}
			props.setStories(stories => new Map([...stories, ...newStories]));
			setFileUploading(false);
    } catch(err) {
      console.error(err);
    }
	}, [props.setStories])

	const onAdd = useCallback(() => {
		props.setStories(stories => new Map(stories).set(uuidv4(), new Story([], [], [])));
	}, [props.setStories])
	
	return (
		<Col style={{height:"100%"}}>
			<Row style={{height:"10%", alignItems:"center"}}>
				<h3>Story Editor</h3>
			</Row>
			<Row style={{height:"90%"}}>
				<Col sm={3} style={{height:"100%"}}>
					<Card style={{height:"100%"}}>
						<Card.Header style={{justifyContent:"space-evenly"}}>
							<Stack gap={1} direction="horizontal">
								<h4> Storie Salvate </h4>
								<Button variant="primary" className={"ms-auto"} onClick={onAdd}>
									<i className="bi bi-plus-lg" />
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
											<ListGroup.Item action onClick={() => setId(id)} style={{width:"100%"}}>
												{props.stories.get(id)!.title}
											</ListGroup.Item>
										</ActionListElement>
									</ListGroup.Item>)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Stack gap={2}>
						<Card style={{height:"30vh"}}>
							{id &&
								<StoryFlowChartViewer story={props.stories.get(id)!} id={id}/>
							}
						</Card>
						<Card style={{height:"60%"}}>
							<Card.Header></Card.Header>
						</Card>
					</Stack>
				</Col>
			</Row>
		</Col>
	);
}

export default StoryEditor;