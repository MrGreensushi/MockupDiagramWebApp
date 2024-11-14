import { useState } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import SuggestedTextArea from "./SuggestedTextArea.tsx";
import SceneDescription from "../StoryElements/SceneDescription.ts";
import React from "react";

function SceneDetails(props: {sceneDescription: SceneDescription}) {
    const [weatherList, setWeatherList] = useState(["Soleggiato", "Velato", "Nuvoloso", "Pioggia", "Temporale"]);
    const [tonesList, setTonesList] = useState(["Felice", "Triste", "Arrabbiato", "Timoroso"]);
    const [valuesList, setValuesList] = useState(["Qualcosa", "Qualcos'altro"]);

    const textWidth = "25%";

    return(
        <Col>
            <h3>
                Dettagli scena
            </h3>
            <Form>
                <InputGroup>
                    <InputGroup.Text style={{width: textWidth}}>Riassunto:</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        style={{maxHeight:"10em"}}
                        value={props.sceneDescription.summary}
                        onChange={(e) => props.sceneDescription.setSummary(e.target.value)} />
                </InputGroup>
                <hr />
                <InputGroup>
                    <InputGroup.Text style={{width: textWidth}}>Orario:</InputGroup.Text>
                    <Form.Control
                        value={props.sceneDescription.time}
                        onChange={(e) => props.sceneDescription.setTime(e.target.value)} />
                </InputGroup>
                <SuggestedTextArea
                    label="Tempo Atmosferico:"
                    value={props.sceneDescription.weather}
                    setValue={props.sceneDescription.setWeather}
                    choices={weatherList}
                    onAdd={(newWeather: string) => setWeatherList([...weatherList, newWeather])}
                    labelTextWidth={textWidth}>
                    +
                </SuggestedTextArea>
                <SuggestedTextArea
                    label="Tono:"
                    value={props.sceneDescription.tone}
                    setValue={props.sceneDescription.setTone}
                    choices={tonesList}
                    onAdd={(newTone: string) => setTonesList([...tonesList, newTone])}
                    labelTextWidth={textWidth}>
                    +
                </SuggestedTextArea>
                <SuggestedTextArea
                    label="Valore:"
                    value={props.sceneDescription.value}
                    setValue={props.sceneDescription.setValue}
                    choices={valuesList}
                    onAdd={(newValue: string) => setValuesList([...valuesList, newValue])}
                    labelTextWidth={textWidth}>
                    +
                </SuggestedTextArea>
            </Form>
        </Col>
    );
}

export default SceneDetails;