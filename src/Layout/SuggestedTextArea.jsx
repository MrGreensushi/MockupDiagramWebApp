import { Button, Form, InputGroup } from "react-bootstrap";

function SuggestedTextArea({label, value, setValue, choices, onAdd, labelTextWidth, children}) {       
    const maybeAddButton =
        (value && !choices.includes(value)) && 
            (<Button variant="secondary"
                onClick={() => onAdd(value)}>
                    {children}
            </Button>);

    return(
        <InputGroup>
            <InputGroup.Text style={{width: labelTextWidth}}>{label}</InputGroup.Text>
            <Form.Control
                value={value}
                list={`${label}ListOptions`}
                onChange={(e) => setValue(e.target.value)} />
            <datalist id={`${label}ListOptions`}>
                {choices.map((e, idx) => <option value={e} key={idx} />)}
            </datalist>
            {maybeAddButton}
        </InputGroup>
    );
}

export default SuggestedTextArea;