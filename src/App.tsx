// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState, createContext } from "react";
import ProcedureEditor from "./Layout/ProcedureEditor.tsx";

export const ActiveLanguage = createContext("ENG");
export const ChangeActiveLanguage = createContext((key: string) => {});

function App() {
  const [activeLanguage, setActiveLanguage] = useState("ENG");
  const changeActiveLanguage = (value: string) => {
    console.log("Active Language changed:" + value);
    setActiveLanguage(value);
  };

  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => {
      return "All data will be lost";
    };

    // Unmount the window.onbeforeunload event
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <div className="App">
      <ActiveLanguage.Provider value={activeLanguage}>
        <ChangeActiveLanguage.Provider value={changeActiveLanguage}>
          <ProcedureEditor />
        </ChangeActiveLanguage.Provider>
      </ActiveLanguage.Provider>
    </div>
  );
}

export default App;
