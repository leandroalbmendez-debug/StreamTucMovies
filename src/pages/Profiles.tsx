import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaChild, FaPlus, FaUserAstronaut, FaUserNinja } from "react-icons/fa";

const SIMULATED_PROFILES = [
  { name: "Perfil 1", icon: FaUserAstronaut },
  { name: "Perfil 2", icon: FaUserNinja },
  { name: "Niños", icon: FaChild },
];

export function Profiles() {
  const navigate = useNavigate();

  const handleSelectProfile = () => {
    navigate("/404");
  };

  return (
    <Container fluid className="py-5 text-center">
      <h1 className="mb-5">¿Quién está viendo?</h1>

      <Row className="justify-content-center g-4">
        {SIMULATED_PROFILES.map(({ name, icon: Icon }) => (
          <Col key={name} xs={6} md={3} lg={2}>
            <Card
              role="button"
              className="profile-card h-100"
              style={{ cursor: "pointer" }}
              onClick={handleSelectProfile}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <Icon size={64} className="mb-3" />
                <Card.Text>{name}</Card.Text>
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