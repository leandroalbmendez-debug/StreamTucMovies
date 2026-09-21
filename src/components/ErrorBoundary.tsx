import { Component, type ReactNode } from "react";
import { Alert, Button, Container } from "react-bootstrap";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container fluid className="py-5 text-center">
          <Alert variant="danger">
            Algo salió mal. Probá recargar la página.
          </Alert>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}