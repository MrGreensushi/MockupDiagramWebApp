import React from "react";
import { useEffect, useState } from "react";
import { Col, Row, ToggleButton, ButtonGroup } from "react-bootstrap";

const StoryElementComponent = ({ element,additionalName="" }) => {
  const [radioValue, setRadioValue] = useState(element.isVariable?2:1);

  useEffect(()=>{
    setRadioValue(element.isVariable?2:1)
  },[element])

  const radios = [
    { name: "Constant", value: 1 },
    { name: "Variable", value: 2 },
  ];

  return (
    <Row style={{paddingTop: ".3rem", paddingBottom:".3rem"}} className="align-items-center">
      <Col >- {element.name}:</Col>
      <Col >
        <ButtonGroup  >
          {radios.map((radio, idx) => (
            <ToggleButton
              key={"Toggle:"+element.id+idx}
              id={`radio-${element.id}:${idx}:${additionalName}`}
              type="radio"
              name={`radio-${element.id}:${idx}:${additionalName}`}
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
  
    </Row>
  );
};

export default StoryElementComponent;
