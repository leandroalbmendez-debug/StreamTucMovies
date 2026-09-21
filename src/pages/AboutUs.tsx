import { Container } from "react-bootstrap";
import { AboutUs } from "../components/AboutUs";
import { useStyle } from "../context/styles";

export default function AboutUsPage() {
  const { theme } = useStyle();

  return (
    <Container fluid className={`${theme}-mode catalog-page`}>
      <AboutUs />
    </Container>
  );
}