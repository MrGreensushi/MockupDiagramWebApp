// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import ProcedureEditor from "./Layout/ProcedureEditor.tsx";
import React from "react";
import Procedure from "./Procedure/Procedure.ts";

function App() {
  return (
    <div className="App">
      <ProcedureEditor />
    </div>
  );
}

export default App;
