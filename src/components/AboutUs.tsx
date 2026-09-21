import { Card, Col, Row } from "react-bootstrap";
import franco from "../assets/team/franco.jpg";
import lucas from "../assets/team/lucas.jpg";
import leandro from "../assets/team/leandro.jpg";

const TEAM = [
  {
    name: "Franco David Ruiz Pastorino",
    role: "Scrum Master & Coder",
    photo: franco,
    bio: "Fanático del cine de culto y de mantener los sprints bajo control. Cuando no está facilitando dailies, está armando el próximo maratón de películas del equipo.",
  },
  {
    name: "Lucas Lencina",
    role: "Coder",
    photo: lucas,
    bio: "Devora ciencia ficción y código limpio en partes iguales. Cree que un buen componente reutilizable es tan satisfactorio como un buen plot twist.",
  },
  {
    name: "Leandro Mendez",
    role: "Coder",
    photo: leandro,
    bio: "Entre un commit y otro, siempre tiene una película en la lista de pendientes. Disfruta tanto pulir una interfaz como debatir el final de una saga.",
  },
];

export function AboutUs() {
  return (
    <section className="about-us mb-5" id="sobre-nosotros">
      <div className="catalog-section-heading">
        <div>
          <span className="catalog-eyebrow">El equipo detrás de STREAMTUC</span>
          <h2>Sobre nosotros</h2>
        </div>
      </div>

      <Row className="gy-4 justify-content-center">
        {TEAM.map((member, index) => (
          <Col key={member.name} md={4} className="text-center">
            <Card
              className={`about-us-card h-100 ${
                index % 2 === 1 ? "about-us-card-secondary" : ""
              }`}
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <span className="about-us-photo-wrapper">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="about-us-photo"
                  />
                </span>
                <Card.Title className="mt-3 mb-1">{member.name}</Card.Title>
                <Card.Subtitle as="span" className="about-us-role mb-3">
                  {member.role}
                </Card.Subtitle>
                <Card.Text>{member.bio}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}