import React, { useState, createContext, useContext } from "react";
import { Card, Collapse, Button, Row, Col } from "react-bootstrap";

// Creiamo il contesto con un valore di default vuoto
const CollapsibleContext = createContext({
  open: false,
  setOpen: (value: boolean) => {},
});

function CollapsibleCard({ children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <Card>{children}</Card>
    </CollapsibleContext.Provider>
  );
}

function Header({ children }) {
  const { open, setOpen } = useContext(CollapsibleContext);

  return (
    <Card.Header onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
      <Row className="align-items-center">
        <Col xs={10}>{children}</Col>
        <Col xs={2} className="text-end">
          <i
            className="bi bi-chevron-down"
            style={{
              display: "inline-block", // Necessario per il transform
              transform: `rotate(${open ? -180 : 0}deg)`,
              transition: "transform 0.3s ease",
            }}
          />
        </Col>
      </Row>
    </Card.Header>
  );
}

function Body({ children, className = "" }) {
  const { open } = useContext(CollapsibleContext);

  return (
    <Collapse in={open}>
      <div>
        <Card.Body className={className}>{children}</Card.Body>
      </div>
    </Collapse>
  );
}

function Footer({ children }) {
  const { open } = useContext(CollapsibleContext);

  return (
    <Collapse in={open}>
      <div>
        <Card.Footer>{children}</Card.Footer>
      </div>
    </Collapse>
  );
}

// Assegniamo i sottocomponenti a Collapsible
CollapsibleCard.Header = Header;
CollapsibleCard.Body = Body;
CollapsibleCard.Footer = Footer;

export default CollapsibleCard;
