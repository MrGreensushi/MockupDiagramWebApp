const customBlockData = {
  characters: {
    names: ["Faraone", "Scriba", "Schiavo"],
    color: "#BC6400",
    button: {
      kind: "BUTTON",
      text: "Add Character",
      callbackKey: "createCharacterInstance"
    }
  },
  objects: {
    names: ["Sasso", "Pietra", "Roccia", "Sabbia"],
    color: "#5B80A5",
    button: {
      kind: "BUTTON",
      text: "Add Object",
      callbackKey: "createObjectInstance"
    }
  },
  locations: {
    names: ["Deserto", "Casa", "Piramide"],
    color: "#5CA699",
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
      type:"SceneObject",
      fields: {
        SceneObjectName: name
      },
      colour: customBlockData[type].color
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