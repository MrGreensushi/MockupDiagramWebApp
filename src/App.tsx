// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import StoryEditor from "./Layout/StoryEditor.tsx";
import React from "react";

function App() {
  return (
    <div className="App">
      <StoryEditor />
    </div>
  );
}

export default App;
