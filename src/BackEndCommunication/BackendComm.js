class BackendComm {
  static getNodes(functionToCall) {
    fetch("/nodes")
      .then((res) => {
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        if (functionToCall) functionToCall(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  static getNode(node, func) {
    fetch("/nodes/" + node.label)
      .then((res) => {
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
          //Se l'errore è 404 vuol dire che il nodo non esisteva
          if (res.status == 404) {
            console.warn(node, " Is not on the server");
            return false;
          } else throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        if (!data) return;

        console.log("Node was on the server: ", data);
        if (func) func(node);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  static postNode(node, func) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: node.stringify(),
    };
    console.log("Update server node Request: ", requestOptions);

    fetch("/nodes/" + node.label, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("The update on the server was a Success: ", data);
        if (func) func(node); //Aggiorna il nodo importato sul frontend
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

}

export default BackendComm;
