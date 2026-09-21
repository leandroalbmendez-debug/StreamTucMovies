import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaPlus, FaUserCircle } from "react-icons/fa";

const SIMULATED_PROFILES = ["Perfil 1", "Perfil 2", "Niños"];

export function Profiles() {
  const navigate = useNavigate();

  const handleSelectProfile = () => {
    navigate("/404");
  };

  return (
    <Container fluid className="py-5 text-center">
      <h1 className="mb-5">¿Quién está viendo?</h1>

      <Row className="justify-content-center g-4">
        {SIMULATED_PROFILES.map((profile) => (
          <Col key={profile} xs={6} md={3} lg={2}>
            <Card
              role="button"
              className="profile-card h-100"
              style={{ cursor: "pointer" }}
              onClick={handleSelectProfile}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <FaUserCircle size={64} className="mb-3" />
                <Card.Text>{profile}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}

        <Col xs={6} md={3} lg={2}>
          <Card
            role="button"
            className="profile-card h-100"
            style={{ cursor: "pointer" }}
            onClick={handleSelectProfile}
          >
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <FaPlus size={64} className="mb-3" />
              <Card.Text>Agregar perfil</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}