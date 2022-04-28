import { Offcanvas } from "react-bootstrap";

export type Props = {
  show: boolean
  title: string
  message: string
  handleClose: () => void
}

export function OffcanvasInformation(props: Props) {
  return (
    <Offcanvas show={props.show} placement={"end"} onHide={props.handleClose}>
      <Offcanvas.Header className="bg-primary bg-gradient text-secondary fw-bold" closeButton closeVariant="white">
        <Offcanvas.Title>
          {props.title}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="text-muted fst-italic lh-base">
        {props.message}
      </Offcanvas.Body>
    </Offcanvas>
  );
}