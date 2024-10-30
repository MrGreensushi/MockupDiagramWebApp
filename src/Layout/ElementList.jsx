import { useState } from "react";
import { Row } from "react-bootstrap";
import Element from "./Element";

function ElementList({}) {
    const [elements, setElements] = useState(["hello", "hola"]);

    const onAddClicked = () => {
        setElements([...elements, "ciao"]);
    }

    return(
        <Row>
            <Element name="Add" onClick={onAddClicked} />
            {elements.map((e, idx) => 
                <Element name={e} key={idx} />
            )}
        </Row>
    );
}

export default ElementList;