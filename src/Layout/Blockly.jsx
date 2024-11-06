const customBlockData = {
  characters: {
    objectName: "SceneCharacterObject",
    names: ["Faraone", "Scriba", "Schiavo"],
    button: {
      kind: "BUTTON",
      text: "Add Character",
      callbackKey: "createCharacterInstance"
    }
  },
  objects: {
    objectName: "SceneObjectObject",
    names: ["Sasso", "Pietra", "Roccia", "Sabbia"],
    button: {
      kind: "BUTTON",
      text: "Add Object",
      callbackKey: "createObjectInstance"
    }
  },
  locations: {
    objectName: "SceneLocationObject",
    names: ["Deserto", "Casa", "Piramide"],
    button: {
      kind: "BUTTON",
      text: "Add Location",
      callbackKey: "createLocationInstance"
    }
  }
};

function addToCustomBlocks(type, newName) {
  customBlockData[type].names.push(newName);
}

const baseToolboxCategories = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Text",
      colour: "#CCCCCC",
      contents: [
        {
          kind: "block",
          type: "TextInput",
        }
      ],
    }
  ],
};

const customToolboxCategories = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Text",
      colour: "#CCCCCC",
      contents: [
        {
          kind: "block",
          type: "TextInput",
        }
      ],
    },
    {
      kind: "category",
      name: "Characters",
      colour: "#BC6400",
      custom: "Characters",
    },
    {
      kind: "category",
      name: "Objects",
      colour: "#5B80A5",
      custom: "Objects",
    },
    {
      kind: "category",
      name: "Locations",
      colour: "#5CA699",
      custom: "Locations",
    },
  ],
};

function flyoutCallback(type) {
  if (!Object.keys(customBlockData).includes(type)) {
    console.error(`"${type}" is not a valid SceneObject type.`);
    return;
  }

  const blockList = [customBlockData[type].button];

  for (const name of customBlockData[type].names) {
    blockList.push({
      kind:"block",
      type: customBlockData[type].objectName,
      fields: {
        SceneObjectName: name,
      },
    });
  }
  return blockList;
}

const workspaceConfiguration = {
  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  }
};

function BlocklyCanvas({ blocklyRef }) {
  return (
    <div ref={blocklyRef} className="fill-height"></div>
  );
}

export {BlocklyCanvas, workspaceConfiguration, baseToolboxCategories, customToolboxCategories, flyoutCallback, addToCustomBlocks};