# GraphApp
Documentazione dell'app.
## Main Components

### ProcedureEditor  
ProcedureEditor è la classe principale del progetto. Al suo interno sono salvate tutte quante le procedure e l'Id della procedura attiva.  
Tutte le funzioni per modificare le procedure sono scritte all'interno di questa classe.

### ProcedureFlowDiagram  
Contiene i Nodi e gli Edges della procedura attiva.  
All'interno sono presenti tutte le funzioni per modificare gli elementi del grafico attivo (i quali poi invocherranno le funzioni di ProcedureEditor per applicare i cambiamenti).  
Quando le informazioni di un'Attività vengono aggiornate vengono aggiornati anche tutte le Attività con lo stesso nome in tutte le procedure.  
In Aggiunta la classe contiene come figli i seguenti componenti: 
- TitleBar  
- OperationMenu  
- LoadNodes  
- NodeEditor

### TitleBar  
Mostra il titolo della procedura Attiva e delle Procedure Padri. Cliccando sulle procedure pardri è possibile modificare la procedura attiva. Mentre se non ci sono procedure padri il titolo può essere cliccato per modificarne il valore.

### OperationMenu  
Corrisponde alla lista di bottoni presenti in alto nell'applicazione. Ogni bottone corrisponde ad una diversa operazione.  
Queste sono tutte le funzionalità (in ordine) eseguibili dai bottoni: 1. Aggiungere un Nodo Attività  
2. Aggiungere un Nodo Evento  
3. Aggiungere un Nodo Decisione  
4. Scaricare il file .procedure del Progetto  
5. Creare una cartella .zip con gli XML di tutti i nodi Attività presenti nel progetto  
6. Importa tutte le Attività da un file .procedure caricato  
7. Cancella il progetto corrente e ne inizializza uno nuovo  
8. Carica un progetto da un file .procedure caricato  
9. Traduce tutti i testi di ogni nodo in una nuova lingua (I testi originali non vengono tenuti)

### LoadedNodes
Questo componente raggruppa in una Card Collapsible i vari nodi Attività importati. In particolare abbiamo che i nodi del BLSD vengono caricati automaticamente recuperandoli dal Backend. Mentre altri nodi possono essere importati tramite l'OperationMenu=>Import XMLs (Corrisponde all'ingresso numero 6 della lista di OperationMenu).
Infine sono presenti anche tutti i nodi della procedura corrente così. 
Quando si clicca su un Attività verrà istanziato un nodo nella procedura corrente.

Inoltre è possibile filtrare i dati in base al loro nome nella barra di ricerca.

### NodeEditor  
NodeEditor gestisce la colonna destra del sito. Quando un Nodo viene cliccato tutte le sue informazioni vengono mostrate dal seguente componente. Ed è NodeEditor che gestire le modifiche effettuate sul nodo selezionato (inoltrandole a ProcedureFlowDiagram).In base a quale nodo viene selezionato due diversi componenti possono essere renderizzati: 
- ActivityEditor: responsabile per i nodi di tipo Activity  
- EventDecisionEditor: responsabile per eventi e decisioni.

### ActivityEditor  
Componente responsabile per mostrare e modificare le informazioni di un nodo Activity.  
In particolare raggruppa ogni frase in base al suo clipId e istanzia per ogni clipId il componente ActivityPhrases dove sono presenti le informazioni riguardanti tutte e tre i livelli (Novice, Intermediate, Advance).  
Inoltre istanzia il componente ActivityDetails per mostrare e modificare i campio "Detail" e "Notes" dell'Attività.

### ActivityPhrases  
Istanzia una Card richiudibile dove mostra e rende possibile la modifica delle Phrases di un attività. In particolare mostra i seguenti campi:  
- ClipId  
- Testo relativo al livello Novice  
- Testo relativo al livello Intermediate  
- Testo relativo al livello Advance

### ActivityDetails  
Il componente semplicemente mostra una Card richiudibile.  
Il titolo e il testo vengono passati come props così come la funzione da chiamare per aggiornare il valore del testo nel caso in cui venga modificato.  
Seppur si chiama ActivityDetails il componente data la sua generalità viene anche usato per mostrare e modificare le "note" delle attività e per gli eventi e decisioni.

### EventDecisionEditor  
Componente responsabile per mostrare e modificare il campo "Notes" associato agli eventi e/o decisioni.

## Nodes  

### ActivityNode  
Gestisce la rappresentazione sul grafico di un Nodo legato ad un'attività.  
Utilizza il Contex `Procedures` per controllare se la procedura figlia dell'attività associata sia vuota o meno.  

### DecisionNode  
Gestisce la rappresentazione sul grafico di un Nodo legato ad una decisione. Per rappresentare il rombo viene usato un quadrato e girandolo su se stesso di 45°. Di conseguenza il testo viene ruotato nel senso opposto per non risultare ruotato. Questo comportamento è gestito dal file CSS Nodes.css  

### EventNode  
Gestisce la rappresentazione sul grafico di un Nodo legato ad un evento.

## Edge  
### Custom Edge  
La classe gestisce la rappresentazione grafica degli edges. Per far cambiare il colore dell'edge modifico il ClassName del componente in base alla tipologia di nodo in Input.


## UML Class Diagram






# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
