import { Offcanvas } from "react-bootstrap";

const SideTab = ({showSideTab, setShowSideTab, title, children}) => {
    
    const handleClose = () => setShowSideTab(false);

    return(
        <Offcanvas
            show={showSideTab}
            onHide={handleClose}
            placement="end"
            scroll={true}
            className="w-75"
            >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{children}</Offcanvas.Body>
        </Offcanvas>
    );
};

export default SideTab;