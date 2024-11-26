import { useState } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import SuggestedTextArea from "./SuggestedTextArea.tsx";
import React from "react";

function SceneDetails(props: {
    summary: string,
    setSummary: (summary: string) => void,
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
                        value={props.summary}
                        onChange={(e) => props.setSummary(e.target.value)}
                        onBlur={props.onBlur} />
                </InputGroup>
                <hr />
                <InputGroup>
                    <InputGroup.Text style={{width: textWidth}}>Orario:</InputGroup.Text>
                    <Form.Control
                        value={props.time}
                        onChange={(e) => props.setTime(e.target.value)}
                        onBlur={props.onBlur} />
                </InputGroup>
                <SuggestedTextArea
                    label="Tempo Atmosferico:"
                    value={props.weather}
                    setValue={props.setWeather}
                    choices={weatherList}
                    onAdd={(newWeather: string) => setWeatherList([...weatherList, newWeather])}
                    labelTextWidth={textWidth}
                    onBlur={props.onBlur}>
                    +
                </SuggestedTextArea>
                <SuggestedTextArea
                    label="Tono:"
                    value={props.tone}
                    setValue={props.setTone}
                    choices={tonesList}
                    onAdd={(newTone: string) => setTonesList([...tonesList, newTone])}
                    labelTextWidth={textWidth}
                    onBlur={props.onBlur}>
                    +
                </SuggestedTextArea>
                <SuggestedTextArea
                    label="Valore:"
                    value={props.value}
                    setValue={props.setValue}
                    choices={valuesList}
                    onAdd={(newValue: string) => setValuesList([...valuesList, newValue])}
                    labelTextWidth={textWidth}
                    onBlur={props.onBlur}>
                    +
                </SuggestedTextArea>
            </Form>
        </Col>
    );
}

export default SceneDetails;