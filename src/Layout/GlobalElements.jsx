import { Col, Tab, Tabs } from "react-bootstrap";
import ElementList from "./ElementList";

function GlobalElements() {
    return(
        <Col>
            <h3>Global Elements</h3>
            <Tabs 
                defaultActiveKey="characters">
                <Tab eventKey="characters" title="Characters">
                    <ElementList />
                </Tab>
                <Tab eventKey="objects" title="Objects">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="locations" title="Locations">
                    Tab content for Contact
                </Tab>
            </Tabs>
        </Col>
    );
}

export default GlobalElements;