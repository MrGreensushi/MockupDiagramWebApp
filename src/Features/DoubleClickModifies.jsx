import { useEffect,useState } from "react";


const DoubleClickModifies = ({
    value,
    style,
    updateFunction,
    divClassName
  }) => {
    const [isEditing, setIsEditing] = useState(false); // Stato per modalità di modifica
    const [newValue, setNewValue] = useState(value); // Stato per il nuovo testo del label
  
    useEffect(()=>{
        setNewValue(value); //keep NewLabel updated
    },[value])
  
    // Quando si fa doppio click, attiva la modalità di modifica
    const handleDoubleClick = () => {
      console.log("DoubleClick")
      if (newValue != null) 
        setIsEditing(true);
    };
  
    // Gestisce l'aggiornamento del testo quando si esce dall'input o si preme invio
    const handleBlur = () => {
      setIsEditing(false); // Esce dalla modalità di modifica
      if (newValue !== value) {
        updateFunction(newValue); // Aggiorna il testo del label
      }
    };
  
    // Gestisce il tasto "Invio" per confermare il testo
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleBlur();
      }
    };
  
    return (
      <div
        style={style}
        className={divClassName}
        onDoubleClick={handleDoubleClick} // Aggiungi l'evento di doppio click
      >
        {isEditing ? (
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onBlur={handleBlur} // Quando si perde il focus, conferma il nuovo testo
            onKeyDown={handleKeyDown} // Gestisce il tasto "Enter"
            autoFocus // Imposta automaticamente il focus sull'input
          />
        ) : (
            value != null && value
        )}
  
      </div>
    );
  };

  export default DoubleClickModifies;