import { useState } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import SuggestedTextArea from "./SuggestedTextArea";

function SceneDetails({sceneDescription}) {
    const [weatherList, setWeatherList] = useState(["Soleggiato", "Velato", "Nuvoloso", "Pioggia", "Temporale"]);
    const [tonesList, setTonesList] = useState(["Felice", "Triste", "Arrabbiato", "Timoroso"]);
    const [valuesList, setValuesList] = useState(["Qualcosa", "Qualcos'altro"]);

    const sd = sceneDescription;
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
                        value={sd.summary}
                        onChange={(e) => sd.setSummary(e.target.value)} />
                </InputGroup>
                <hr />
                <InputGroup>
                    <InputGroup.Text style={{width: textWidth}}>Orario:</InputGroup.Text>
                    <Form.Control
                        value={sd.time}
                        onChange={(e) => sd.setTime(e.target.value)} />
                </InputGroup>
                <SuggestedTextArea
                    label="Tempo Atmosferico:"
                    value={sd.weather}
                    setValue={sd.setWeather}
                    choices={weatherList}
                    onAdd={newWeather => setWeatherList([...weatherList, newWeather])}
                    labelTextWidth={textWidth}>
                    +
                </SuggestedTextArea>
                <SuggestedTextArea
                    label="Tono:"
                    value={sd.tone}
                    setValue={sd.setTone}
                    choices={tonesList}
                    onAdd={newTone => setTonesList([...tonesList, newTone])}
                    labelTextWidth={textWidth}>
                    +
                </SuggestedTextArea>
                <SuggestedTextArea
                    label="Valore:"
                    value={sd.value}
                    setValue={sd.setValue}
                    choices={valuesList}
                    onAdd={newValue => setValuesList([...valuesList, newValue])}
                    labelTextWidth={textWidth}>
                    +
                </SuggestedTextArea>
            </Form>
        </Col>
    );
}

export default SceneDetails;