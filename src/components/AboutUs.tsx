import { Card, Col, Row } from "react-bootstrap";
import franco from "../assets/team/franco.jpg";
import lucas from "../assets/team/lucas.jpg";
import leandro from "../assets/team/leandro.jpg";

const TEAM = [
  {
    name: "Franco David Ruiz Pastorino",
    role: "Scrum Master & Diseñador Multimedia",
    photo: franco,
    bio: "Diseñador multimedia de profesión, así que fue el primero en preocuparse por cómo se ve STREAMTUC. También ofició de Scrum Master, manteniendo los sprints del equipo en orden. Cuando no está revisando una paleta de colores, está armando el próximo maratón de películas.",
  },
  {
    name: "Lucas Lencina",
    role: "Profesor de Educación Física",
    photo: lucas,
    bio: "Profesor de educación física de profesión, se metió de lleno a programar para este proyecto. Le pone la misma garra a resolver un bug que a planear una clase, y siempre tiene una recomendación de ciencia ficción a mano.",
  },
  {
    name: "Leandro Mendez",
    role: "Profesor de Inglés",
    photo: leandro,
    bio: "Profesor de inglés, por eso ve todo en versión original. Entre corregir tareas y escribir código para STREAMTUC, siempre tiene una película pendiente — y una opinión fuerte sobre el final de alguna saga.",
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