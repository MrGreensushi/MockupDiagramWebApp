import { Card } from "react-bootstrap";

function Element({
    image,
    name,
    onClick,
    key}) {
    console.log(image)
    const imgSrc = image ?? "logo512.png";
    
    return(
        <Card onClick={onClick} key={key} style={{width:"10%"}}>
            <Card.Img variant="top" src={imgSrc} style={{ aspectRatio: "1" }} />
            <Card.Title>
                {name.toString()}
            </Card.Title>
        </Card>
    );
}

export default Element;