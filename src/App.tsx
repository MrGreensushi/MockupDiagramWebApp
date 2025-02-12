// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import ProcedureEditor from "./Layout/ProcedureEditor.tsx";
import React, { useEffect } from "react";

function App() {
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
      <ProcedureEditor />
    </div>
  );
}

export default App;
