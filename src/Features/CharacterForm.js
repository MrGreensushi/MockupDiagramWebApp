import { useState } from "react";
import { Form ,ButtonGroup,ToggleButton,Button} from "react-bootstrap";

const CharacterForm = ({}) => {
  const [radioValue, setRadioValue] = useState(1);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const radios = [
    { name: "Constant", value: 1 },
    { name: "Variable", value: 2 },
  ];

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="CharacterType.ControlInput1">
        <Form.Label>Type</Form.Label>
        <Form.Control type="text" placeholder="..." />
      </Form.Group>

      <ButtonGroup className="mb-2">
        {radios.map((radio, idx) => (
          <ToggleButton
            key={"Form:" + idx}
            id={`radio:form`}
            type="radio"
            name={`radio:form`}
            value={radio.value}
            checked={radioValue === radio.value}
            variant={idx % 2 ? "outline-success" : "outline-danger"}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      <Form.Group className="mb-3" controlId="CharacterBio.ControlInput2">
        <Form.Label>Bio</Form.Label>
        <Form.Control type="text" placeholder="..." />
      </Form.Group>

      <Form.Group className="mb-3" controlId="CharacterObjectives.ControlInput3">
        <Form.Label>Objectives</Form.Label>
        <Form.Control type="text" placeholder="..." />
      </Form.Group>

      <Button type="submit">Create new character</Button>
    </Form>
  );
};

export default CharacterForm;
