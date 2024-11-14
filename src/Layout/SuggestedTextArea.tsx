import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

function SuggestedTextArea(props: {
    label?: string,
    value: string,
    setValue: (newValue: string) => void,
    choices: string[],
    onAdd: (newValue: string) => void,
    labelTextWidth?: string,
    children?: React.ReactNode
}) {       
    const maybeAddButton =
        (props.value && !props.choices.includes(props.value)) && 
            (<Button variant="secondary"
                onClick={() => props.onAdd(props.value)}>
                    {props.children}
            </Button>);

    const datalistId = props.label ? `${props.label}ListOptions` : "ListOptions";

    return(
        <InputGroup>
            {props.label &&
                <InputGroup.Text style={{width: props.labelTextWidth}}>
                    {props.label}
                </InputGroup.Text>
            }
            <Form.Control
                value={props.value}
                list={datalistId}
                onChange={e => props.setValue(e.target.value)} />
            {props.label && 
                <datalist id={datalistId}>
                    {props.choices.map((e, idx) => <option value={e} key={idx} />)}
                </datalist>
            }
            {maybeAddButton}
        </InputGroup>
    );
}

export default SuggestedTextArea;