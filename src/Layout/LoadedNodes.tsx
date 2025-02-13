import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { useState, useEffect } from "react";
import {
  Spinner,
  Alert,
  Button,
  ButtonGroup,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  ActivityDescription,
  ActivityLanguage,
  Languages,
  LevelsEnum,
  Phrase,
} from "../Procedure/Activity.ts";
import SideBar from "./SideBar.tsx";
import "../CSS/LoadedNodes.css";
import DynamicTextField from "./DynamicTextField.tsx";
import CollapsibleCard from "./CollapsibleCard.tsx";
import { CategorizedDescriptions } from "../Misc/CategorizedDescription.ts";

function LoadNodes(props: {
  categorizedDescriptions: CategorizedDescriptions[];
  instantiateActvity: (activityDescriptio: ActivityDescription) => void;
}) {
  const [nodes, setNodes] = useState<ActivityDescription[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

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
    const eng = getPhraseActivityOneLanguage(data.ENG);
    const ita = getPhraseActivityOneLanguage(data.ITA);

    return new ActivityDescription(data.Name, new Languages(ita, eng));
  };

  const getPhraseActivityOneLanguage = (data: any) => {
    if (!data) {
      return new ActivityLanguage();
    }

    const descriptions = data.descriptions; // Parsing della stringa JSON in un oggetto
    const nodePhrases = data.nodePhrases;
    const details = data.details;

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
    return new ActivityLanguage(allPhrases, details);
  };

  const filterArray = (array: ActivityDescription[] | undefined) => {
    if (!array) return [];
    return array.filter((node) =>
      node.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <SideBar
      header={
        <DynamicTextField
          initialValue="Nodes List"
          disable={true}
          baseProps={{ style: { fontSize: "2em" } }}
        />
      }
      isLeft={true}
    >
      <InputGroup>
        <InputGroup.Text id="Filter-addon">
          <i className="bi bi-search" />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search by name"
          aria-label="Filter"
          aria-describedby="Filter-addon"
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <CollapsibleNodeList
        instantiateActvity={props.instantiateActvity}
        activityDescriptions={filterArray(nodes)}
      >
        BLSD Nodes
      </CollapsibleNodeList>

      {props.categorizedDescriptions
        .sort((a, b) => {
          const nameA = a.category.toUpperCase(); // ignore upper and lowercase
          const nameB = b.category.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        })
        .map((categorizedDescription) => (
          <CollapsibleNodeList
            instantiateActvity={props.instantiateActvity}
            activityDescriptions={filterArray(
              categorizedDescription.activityDescriptions
            )}
          >
            {categorizedDescription.category}
          </CollapsibleNodeList>
        ))}
    </SideBar>
  );
}

function CollapsibleNodeList(props: {
  activityDescriptions: ActivityDescription[];
  instantiateActvity: (activityDescription: ActivityDescription) => void;
  children: any;
}) {
  const spinner = useMemo(() => {
    return (
      <div className="text-center p-1" style={{ width: "100%" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }, []);

  return (
    <CollapsibleCard>
      <CollapsibleCard.Header>{props.children}</CollapsibleCard.Header>
      <CollapsibleCard.Body className="px-0 py-1">
        <ButtonGroup vertical style={{ paddingLeft: "0px", width: "100%" }}>
          {props.activityDescriptions.length === 0 && spinner}
          {props.activityDescriptions.map((node, index) => (
            <Button
              className="list-nodes-item"
              key={index}
              onClick={() => props.instantiateActvity(node)}
            >
              {node.name}
            </Button>
          ))}
        </ButtonGroup>
      </CollapsibleCard.Body>
    </CollapsibleCard>
  );
}

export default LoadNodes;
