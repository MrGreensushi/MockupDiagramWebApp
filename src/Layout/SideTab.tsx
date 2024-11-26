import React, { ReactNode } from "react";
import { Offcanvas } from "react-bootstrap";

function SideTab (props: {
    title: string,
    showSideTab: boolean,
    setShowSideTab: React.Dispatch<React.SetStateAction<boolean>>,
    children: ReactNode
}) { 
    const handleClose = () => {
        props.setShowSideTab(false);
    }

    return(
        <Offcanvas
            show={props.showSideTab}
            onHide={handleClose}
            placement="end"
            scroll={true}
            className="w-75" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{props.title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{props.children}</Offcanvas.Body>
        </Offcanvas>
    );
};

export default SideTab;