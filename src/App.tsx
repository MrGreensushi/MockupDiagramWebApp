import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import StoryEditor from "./Layout/StoryEditor.tsx";
import TemplateEditor from "./Layout/TemplateEditor.tsx";
import Story from "./StoryElements/Story.ts";
import { initBlocks } from "./Blockly/Blocks.ts";

const tempStories = [
  new Story([], [], [], undefined, "Storia 1"),
  new Story([], [], [], undefined, "Storia 2"),
  new Story([], [], [], undefined, "Storia 3"),
];
const tempMap = new Map<string, Story>();
tempStories.forEach(s => tempMap.set(uuidv4(), s));

function App() {
  //const [stories, setStories] = useState(new Map<string, Story>());
  const [stories, setStories] = useState(tempMap);

  useEffect(() => initBlocks(), []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/stories"/>} />
          <Route path="/stories" element={<StoryEditor stories={stories} setStories={setStories}/>} />
          <Route path="/stories/:id" element={<TemplateEditor stories={stories} setStories={setStories}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
