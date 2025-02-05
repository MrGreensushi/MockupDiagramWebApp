import React, { useCallback, useContext, useState } from "react";
import { Button, ButtonGroup, Card, Col, Dropdown, Form, InputGroup, ListGroup, Modal, Row } from "react-bootstrap";
import SuggestedTextField from "./SuggestedTextField.tsx";
import Story from "../StoryElements/Story.ts";
import { SceneDetails as SceneDetailsType} from "../StoryElements/Scene.ts";
import { StoryElementEnum } from "../StoryElements/StoryElement.ts";
import { SceneDetailsContext } from "../App.tsx";
import DropdownTextField from "./DropdownTextField.tsx";

function SceneDetails(props: {
	story: Story,
	details: SceneDetailsType,
	setDetails: (newDetails: SceneDetailsType) => void,
}) {
	const [title, setTitle] = useState(props.details.title);
	const [summary, setSummary] = useState(props.details.summary);
	const [time, setTime] = useState(props.details.time);
	const [weather, setWeather] = useState(props.details.weather);
	const [tone, setTone] = useState(props.details.tone);
	const [value, setValue] = useState(props.details.value);
	const [backgroundCharacters, setBackgroundCharacters] = useState(new Set(props.details.backgroundIds[StoryElementEnum.character]));
	const [backgroundObjects, setBackgroundObjects] = useState(new Set(props.details.backgroundIds[StoryElementEnum.object]));
	const [backgroundLocation, setBackgroundLocation] = useState(props.details.backgroundIds[StoryElementEnum.location]?.[0] ?? "");

	const [backgroundsModal, setBackgroundsModal] = useState(false);

	const sceneDetailsChoices = useContext(SceneDetailsContext);

	const textWidth = "20%";
	const noBackgroundText = "Nessun Luogo di Sfondo";

	const handleSave = useCallback(() => {
		props.setDetails({
			title: title,
			summary: summary,
			time: time,
			weather: weather,
			tone: tone,
			value: value,
			backgroundIds: [Array.from(backgroundCharacters), Array.from(backgroundObjects), [backgroundLocation]]})
	}, [title, summary, time, weather, tone, value, backgroundCharacters, backgroundObjects, backgroundLocation]);

	return (
		<Card>
			<Modal
				show={backgroundsModal}
				centered
				scrollable
				size="lg"
				onHide={() => setBackgroundsModal(false)}
				style={{height:"100%"}}>
				<Modal.Header closeButton>
					<Modal.Title>Elementi di Sfondo</Modal.Title>
				</Modal.Header>
				<Modal.Body className="w-100" style={{maxHeight:"100%"}}>
					<Row>
						<Col xs={4} style={{maxHeight:"100%", overflowY:"auto"}}>
							<ListGroup>
								{Array.from(props.story.characters).map(([id, character]) =>
									<Form.Check
									key={id}
									type="checkbox"
									label={character.name}
									id={`checkbox-${id}`}
									checked={backgroundCharacters.has(id)}
									onChange={e => setBackgroundCharacters(bg => {
										if (e.target.checked) {bg.add(id); return new Set(bg)}
										else {bg.delete(id); return new Set(bg)}
									})}/>
								)}
							</ListGroup>
						</Col>
						<Col xs={4} style={{maxHeight:"100%", overflowY:"auto"}}>
							<Form className="w-100">
								{Array.from(props.story.objects).map(([id, object]) =>
									<Form.Check
										key={id}
										type="checkbox"
										label={object.name}
										id={`checkbox-${id}`}
										checked={backgroundObjects.has(id)}
										onChange={e => setBackgroundObjects(bg => {
											if (e.target.checked) {bg.add(id); return new Set(bg)}
											else {bg.delete(id); return new Set(bg)}
										})}/>
								)}
							</Form>
						</Col>
						<Col xs={4} style={{maxHeight:"100%", overflowY:"auto"}}>
							<Form className="w-100">
									<Form.Check
										key="no-background"
										type="radio"
										label={noBackgroundText}
										id={`radio-no-background`}
										checked={!(!!backgroundLocation)}
										onChange={() => setBackgroundLocation("")}/>
								{Array.from(props.story.locations).map(([id, location]) =>
									<Form.Check
										key={id}
										type="radio"
										label={location.name}
										id={`radio-${id}`}
										checked={backgroundLocation === id}
										onChange={() => setBackgroundLocation(id)}/>
								)}
							</Form>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
			<Card.Header>
				<h4>Dettagli scena</h4>
			</Card.Header>
			<Card.Body>
				<Form onBlur={handleSave}>
					<InputGroup>
						<InputGroup.Text style={{ width: textWidth }}>Titolo:</InputGroup.Text>
						<Form.Control
							value={title}
							onChange={e => setTitle(e.target.value)} />
					</InputGroup>
					<InputGroup>
						<InputGroup.Text style={{ width: textWidth }}>Riassunto:</InputGroup.Text>
						<Form.Control
							as="textarea"
							style={{ maxHeight: "10em" }}
							value={summary}
							onChange={e => setSummary(e.target.value)} />
					</InputGroup>
					<hr />
					<DropdownTextField
						label="Orario"
						value={time}
						setValue={setTime}
						defaultValue="Nessun Orario"
						choices={sceneDetailsChoices.time} />
					<DropdownTextField
						label="Meteo"
						value={weather}
						setValue={setWeather}
						defaultValue="Nessun Meteo"
						choices={sceneDetailsChoices.weather} />
					<DropdownTextField
						label="Tono"
						value={tone}
						setValue={setTone}
						defaultValue="Nessun Tono"
						choices={sceneDetailsChoices.tone} />
					<DropdownTextField
						label="Valore"
						value={value}
						setValue={setValue}
						defaultValue="Nessun Valore"
						choices={sceneDetailsChoices.value} />
					<hr/>
					<InputGroup>
						<InputGroup.Text style={{ width: textWidth }}>Sfondo:</InputGroup.Text>
						<Form.Control
							as="textarea"
							value={`Personaggi: ${Array.from(backgroundCharacters).map(id => props.story.characters.get(id)?.name).join(" ")}\n` +
									`Oggetti: ${Array.from(backgroundObjects).map(id => props.story.objects.get(id)?.name).join(" ")}\n` +
									`Luogo: ${props.story.locations.get(backgroundLocation)?.name ?? noBackgroundText}`}
							readOnly
							style={{height:"6em"}} />
						<Button onClick={() => setBackgroundsModal(true)}>
							<i className="bi bi-pencil"></i>
						</Button>
					</InputGroup>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default SceneDetails;