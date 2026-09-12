import { Container } from 'react-bootstrap'
import Navbar from '../components/navbar'

export default function Layout({ children }) {
    return (
        <>
            <Container>
                <Navbar />
                {children}
            </Container>
        </>
    )
}