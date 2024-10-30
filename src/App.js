// src/App.js
import React, { useEffect, useState } from "react";
import FlowDiagram from "./Flow/FlowDiagram";
import FlowDescriptor from "./Flow/FlowDescriptor";
import NarrativeFlowDiagram from "./Flow/NarrativeFlowDiagram";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NarrativeDataManager from "./StoryElements/NarrativeDataManager";
import CharacterData from "./StoryElements/CharacterData";
import ObjectData from "./StoryElements/ObjectData";
import LocationtData from "./StoryElements/LocationData";
import BlocklyCanvas from "./Layout/Blockly";
import GlobalElements from "./Layout/GlobalElements";
import SceneEditor from "./Layout/SceneEditor";

function App() {
  const [mainFlow, setMainFlow] = useState(
    new FlowDescriptor([], [], "React Diagram", true)
  );
  const [activeFlow, setActiveFlow] = useState(mainFlow);

  useEffect(() => {
    const manager = NarrativeDataManager.getInstance();
    manager.addCharacter(
      new CharacterData(
        false,
        "Amun",
        "0",
        "Principale, scriba",
        "tornare in possesso dei vestiti"
      )
    );
    manager.addCharacter(
      new CharacterData(
        false,
        "Semeb",
        "1",
        "Principale, ladro, scriba",
        "rubare i vestiti per mantenere la famiglia"
      )
    );
    manager.addCharacter(
      new CharacterData(
        true,
        "Imhotep",
        "2",
        "Secondario, capo scriba",
        "Far rispettare le regole"
      )
    );
    // manager.addCharacter(
    //   new CharacterData(
    //     "Tia",
    //     "Tia, moglie di Semeb",
    //     "mantenere la famiglia"
    //   )
    // );
    // manager.addCharacter(
    //   new CharacterData(
    //     "Oracolo",
    //     "Secondario, oracolo",
    //     "dire la verità"
    //   )
    // );
    // manager.addCharacter(
    //   new CharacterData(
    //     "Scienziati",
    //     "Secondario",
    //     "trovare reperti"
    //   )
    // );
    manager.addObject(
      new ObjectData(
        false,
        "Vestiti",
        "3",
        "",
        ""
      )
    );
    manager.addObject(
      new ObjectData(
        true,
        "Vestiti1",
        "4",
        "",
        ""
      )
    );
    manager.addBackground(
      new LocationtData(
        false,
        "Biblioteca del tempio di Karnak",
        "5",
        "",
        ""
      )
    );
    manager.addBackground(
      new LocationtData(
        true,
        "1Biblioteca del tempio di Karnak",
        "6",
        "",
        ""
      )
    );
  }, []);

  const onClickSetSubFlow = (currentFlow, newFlow) => {
    //aggiorna mainFlow
    setMainFlow(
      (prevFlow) =>
        new FlowDescriptor(currentFlow.nodes, currentFlow.edges, prevFlow.name)
    );
    //Setta il nuovo active flow
    setActiveFlow(newFlow);
  };

  const returnToMainFlow = () => {};

  /*return (
    <div className="App">
      <h1>{activeFlow.name}</h1>
      <NarrativeFlowDiagram
        flow={activeFlow}
        onClickSetSubFlow={onClickSetSubFlow}
      />
    </div>
  );*/

  return(
    <div className="App">
      <SceneEditor />
    </div>
  );
}

export default App;
