import { Container } from 'react-bootstrap'
import Navbar from '../components/Navbar'

export default function Layout({ children }) {
    return (
        <>
            <Container fluid>
                <Navbar />
                {children}
            </Container>
        </>
    )
}