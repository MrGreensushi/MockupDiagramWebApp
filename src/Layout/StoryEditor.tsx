import { Button, Card, Col, ListGroup, Row, Stack } from "react-bootstrap";
import Story from "../StoryElements/Story";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryFlowChart from "../Flow/StoryFlowChart.tsx";
import ActionListElement from "./ActionListElement.tsx";

function StoryEditor(props: { stories: Map<string, Story>, setStories: React.Dispatch<React.SetStateAction<Map<string, Story>>> }) {
	const [story, setStory] = useState<Story>();
	const navigate = useNavigate();

	const onClickDelete = useCallback((id: string) => {
		props.setStories(stories => {
			const newStories = new Map(stories);
			newStories.delete(id);
			return newStories})
	}, []); 
	
	return (
		<Col style={{height:"100%"}}>
			<Row style={{height:"10%", alignItems:"center"}}>
				<h3>Story Editor</h3>
			</Row>
			<Row style={{height:"90%"}}>
				<Col sm={3} style={{height:"100%"}}>
					<Card style={{height:"100%"}}>
						<Card.Header>Storie Salvate</Card.Header>
						<Card.Body style={{padding:"0", maxHeight:"100%", overflow:"auto"}}>
							<ListGroup variant="flush">
								{[...props.stories.keys()].map((id, idx) =>
									<ListGroup.Item key={idx}>
										<ActionListElement
											leftSide={
												<Button variant="danger" onClick={() => onClickDelete(id)}>
													<i className="bi bi-trash" aria-label="delete" /> 
												</Button>}
											rightSide={
												<Button variant="secondary" onClick={() => navigate(`${id}`)}>
													<i className="bi bi-pencil-square" aria-label="edit"/>
												</Button>}>
											<ListGroup.Item action onClick={() => setStory(props.stories.get(id))} style={{width:"100%"}}>
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
							{story &&
								<StoryFlowChart
									story={story}
									setStory={setStory as React.Dispatch<React.SetStateAction<Story>>}
									editMode={false} />
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