import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import {
  ActivityDescription,
  LevelsEnum,
  Phrase,
} from "../Procedure/Activity.ts";

function LoadNodes(props: {
  instantiateActvity: (activityDescriptio: ActivityDescription) => void;
}) {
  const [nodes, setNodes] = useState<ActivityDescription[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Funzione per recuperare i dati dal backend
    const fetchNodes = async () => {
      try {
        const response = await axios.get("/nodes");
        handleResponse(response);
        //setNodes(response.data);
      } catch (err) {
        console.log(err);
        setError("Errore durante il recupero dei dati.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const handleResponse = (response: any) => {
    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error("La risposta non è un array.");
    }

    // if (!firstNode || !firstNode.ITA) {
    //   throw new Error("Il nodo non ha il formato previsto.");
    // }

    const processData = data.map((descriptor) => getPhraseActivity(descriptor));
    setNodes(processData);
  };

  const getPhraseActivity = (data: any) => {
    const ita = data.ITA;
    const descriptions = ita.descriptions; // Parsing della stringa JSON in un oggetto
    const nodePhrases = ita.nodePhrases;

    const descr = Object.keys(descriptions).map((key) => {
      return new Phrase("Description", key as LevelsEnum, descriptions[key]);
    });

    // Mappatura dinamica delle frasi per i diversi livelli
    const phrases = Object.values(LevelsEnum)
      .map((level) => {
        if (!nodePhrases[level]) return undefined;
        return Object.keys(nodePhrases[level]).map((clipId) => {
          return new Phrase(
            clipId,
            level as LevelsEnum,
            nodePhrases[level][clipId]
          );
        });
      })
      .filter((x): x is Phrase[] => x !== undefined) // Rimuovi gli undefined e restringi il tipo
      .flat(); // Appiattisci l'array di array

    // Aggiungi le descrizioni alle frasi
    const allPhrases = [...descr, ...phrases];

    const activityName = data.Name;

    return new ActivityDescription(activityName, allPhrases);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Lista dei nodi</h2>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </Spinner>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && nodes && (
            <ListGroup>
              {nodes.map((node, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => props.instantiateActvity(node)}
                >
                  {node.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default LoadNodes;
