import React, { useState } from "react";
import { ButtonGroup, Card, Dropdown, Form, InputGroup } from "react-bootstrap";
import SuggestedTextField from "./SuggestedTextField.tsx";
import Story from "../StoryElements/Story.ts";

function SceneDetails(props: {
	story: Story,
	title: string,
	setTitle: (title: string) => void,
	summary: string,
	setSummary: (summary: string) => void,
	backgroundId: string,
	setBackgroundId: (backgroundId: string) => void,
	time: string,
	setTime: (time: string) => void,
	weather: string,
	setWeather: (weather: string) => void,
	tone: string,
	setTone: (tone: string) => void,
	value: string,
	setValue: (value: string) => void,
	onBlur: () => void
}) {
	const [weatherList, setWeatherList] = useState(["Soleggiato", "Velato", "Nuvoloso", "Pioggia", "Temporale"]);
	const [tonesList, setTonesList] = useState(["Felice", "Triste", "Arrabbiato", "Timoroso"]);
	const [valuesList, setValuesList] = useState(["Qualcosa", "Qualcos'altro"]);

	const textWidth = "25%";

	const noBackgroundText = "Nessuno Sfondo";

	return (
		<Card>
			<Card.Header>
				<h4>
					Dettagli scena
				</h4>
			</Card.Header>
			<Card.Body>
				<Form>
					<InputGroup>
						<InputGroup.Text style={{ width: textWidth }}>Riassunto:</InputGroup.Text>
						<Form.Control
							as="textarea"
							style={{ maxHeight: "10em" }}
							value={props.summary}
							onChange={(e) => props.setSummary(e.target.value)}
							onBlur={props.onBlur} />
					</InputGroup>
					<hr />
					<InputGroup>
						<InputGroup.Text style={{ width: textWidth }}>Sfondo:</InputGroup.Text>
						<Dropdown onSelect={props.onBlur} as={ButtonGroup}
						>
							<Form.Control
								value={props.story.locations.get(props.backgroundId)?.name ?? noBackgroundText}
								readOnly />
							<Dropdown.Toggle variant="secondary" style={{width:"2.5em"}}/>
							<Dropdown.Menu style={{maxWidth:"20em", overflow:"hidden"}}>
								<Dropdown.Item eventKey={""} onMouseOver={() => props.setBackgroundId("")}>{noBackgroundText}</Dropdown.Item>
								<Dropdown.Divider />
								{[...props.story.locations.entries()].map(([id, value]) =>
									<Dropdown.Item eventKey={id} key={id} onMouseOver={() => props.setBackgroundId(id)}>{value.name}</Dropdown.Item>)}
							</Dropdown.Menu>
						</Dropdown>
					</InputGroup>
					<InputGroup>
						<InputGroup.Text style={{ width: textWidth }}>Orario:</InputGroup.Text>
						<Form.Control
							value={props.time}
							onChange={(e) => props.setTime(e.target.value)}
							onBlur={props.onBlur} />
					</InputGroup>
					<SuggestedTextField
						label="Meteo:"
						value={props.weather}
						setValue={props.setWeather}
						choices={weatherList}
						onAdd={(newWeather: string) => setWeatherList([...weatherList, newWeather])}
						labelTextWidth={textWidth}
						onBlur={props.onBlur}>
						+
					</SuggestedTextField>
					<SuggestedTextField
						label="Tono:"
						value={props.tone}
						setValue={props.setTone}
						choices={tonesList}
						onAdd={(newTone: string) => setTonesList([...tonesList, newTone])}
						labelTextWidth={textWidth}
						onBlur={props.onBlur}>
						+
					</SuggestedTextField>
					<SuggestedTextField
						label="Valore:"
						value={props.value}
						setValue={props.setValue}
						choices={valuesList}
						onAdd={(newValue: string) => setValuesList([...valuesList, newValue])}
						labelTextWidth={textWidth}
						onBlur={props.onBlur}>
						+
					</SuggestedTextField>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default SceneDetails;