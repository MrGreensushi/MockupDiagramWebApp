import { Form, InputGroup } from "react-bootstrap";
import { CharacterElement, LocationElement, ObjectElement, StoryElement, StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import React from "react";

function StoryElementInputForm(props: {
    type: StoryElementEnum,
    element: StoryElementType,
    setElement: (e: any) => void
}) {
    const commonFields = (
        <>
            <InputGroup>
                <InputGroup.Text>Nome:</InputGroup.Text>
                <Form.Control
                    value={props.element.name}
                    onChange={e => props.setElement({...props.element, name: e.target.value})} autoFocus />
            </InputGroup>
            <InputGroup>
                <InputGroup.Text>Variabile:</InputGroup.Text>
                <Form.Switch value={props.element.isVariable? 1 : 0} onChange={e => props.setElement({...props.element, isVariable: !!e.target.value})} />
            </InputGroup>
        </>
    );
    const commonNotes = (
        <InputGroup>
            <InputGroup.Text>Note:</InputGroup.Text>
            <Form.Control
                value={props.element.notes}
                onChange={e => props.setElement({...props.element, notes: e.target.value})} />
        </InputGroup>
    );
    switch (props.type) {
        case StoryElementEnum.character:
            return(
                <>
                    {commonFields}
                    <hr />
                    <InputGroup>
                        <InputGroup.Text>Bio:</InputGroup.Text>
                        <Form.Control
                            value={(props.element as CharacterElement).bio}
                            onChange={e => props.setElement({...props.element, bio: e.target.value})} />
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text>Obiettivo:</InputGroup.Text>
                        <Form.Control
                            value={(props.element as CharacterElement).objective}
                            onChange={e => props.setElement({...props.element, objective: e.target.value})} />
                    </InputGroup>
                    <hr />
                    {commonNotes}
                </>
            );
        case StoryElementEnum.object:
            return(
                <>
                    {commonFields}
                    <hr />
                    <InputGroup>
                        <InputGroup.Text>Funzione:</InputGroup.Text>
                        <Form.Control
                            value={(props.element as ObjectElement).use}
                            onChange={e => props.setElement({...props.element, use: e.target.value})} />
                    </InputGroup>
                    <hr />
                    {commonNotes}
                </>
            );
        case StoryElementEnum.background:
            return(
                <>
                    {commonFields}
                    <hr />
                    <InputGroup>
                        <InputGroup.Text>Scopo:</InputGroup.Text>
                        <Form.Control
                            value={(props.element as LocationElement).purpose}
                            onChange={e => props.setElement({...props.element, purpose: e.target.value})} />
                    </InputGroup>
                    <hr />
                    {commonNotes}
                </>
            );    
        default:
            throw new TypeError(props.type + " is not a valid type");
    }
}

export default StoryElementInputForm;