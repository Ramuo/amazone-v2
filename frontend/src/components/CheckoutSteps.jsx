import {Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

const CheckoutSteps = ({step1, step2, step3, step4}) => {
    return (
        <Nav className='justify-content-center mb-4 checkout-steps'>
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to='/login' className=' active'>
                        <Nav.Link style={{color: 'red'}}>Connexion</Nav.Link>
                    </LinkContainer>
                ):(
                    <Nav.Link disabled >Connexion</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step2 ? (
                    <LinkContainer to='/login'  className='active'>
                        <Nav.Link>Livraison</Nav.Link>
                    </LinkContainer>
                ):(
                    <Nav.Link disabled>Livraison</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer to='/login'  className='active'>
                        <Nav.Link>Paiement</Nav.Link>
                    </LinkContainer>
                ):(
                    <Nav.Link disabled>Paiement</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to='/login' className='active'>
                        <Nav.Link>Valider</Nav.Link>
                    </LinkContainer>
                ):(
                    <Nav.Link disabled>Valider</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    );
};

export default CheckoutSteps;