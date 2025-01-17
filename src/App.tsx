import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import StoryEditor from "./Layout/StoryEditor.tsx";
import TemplateEditor from "./Layout/TemplateEditor.tsx";
import Story from "./StoryElements/Story.ts";
import { initBlocks } from "./Blockly/Blocks.ts";
import Template from "./StoryElements/Template.ts";

const tempMap = new Map<string, Template>();

function App() {
  const [stories, setStories] = useState(tempMap);

  const setTemplate = useCallback((id: string, newStory: Story) => {
    setStories(stories => new Map(Array.from(stories).map(
      storyIter => {
        if (storyIter[0] === id)
          return [storyIter[0], new Template(newStory.clone(), storyIter[1].instances)];
        else
          return storyIter;
      }
  )));}, []);

  useEffect(() => initBlocks(), []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/stories"/>} />
          <Route path="/stories" element={<StoryEditor stories={stories} setStories={setStories}/>} />
          <Route path="/stories/:id" element={<TemplateEditor stories={stories} setStory={setTemplate}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
