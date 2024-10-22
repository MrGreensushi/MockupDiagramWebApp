import { useEffect, useState } from "react";
import { Col, Row, ToggleButton, ButtonGroup } from "react-bootstrap";

const StoryElementComponent = ({ element }) => {
  const [radioValue, setRadioValue] = useState(element.isVariable?2:1);

  useEffect(()=>{
    setRadioValue(element.isVariable?2:1)
  },[element])

  const radios = [
    { name: "Constant", value: 1 },
    { name: "Variable", value: 2 },
  ];

  return (
    <Row>
      <Col>- {element.id}:</Col>
      <Col>
        <ButtonGroup className="mb-2" >
          {radios.map((radio, idx) => (
            <ToggleButton
              key={"Toggle:"+element.id+idx}
              id={`radio-${element.id}:${idx}`}
              type="radio"
              name={`radio-${element.id}:${idx}`}
              value={radio.value}
              checked={radioValue===radio.value}
              variant={idx % 2 ? 'outline-success' : 'outline-danger'}
              disabled
              //onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Col>
      <Col>
        <label>{element.type}</label>
      </Col>
    </Row>
  );
};

export default StoryElementComponent;
