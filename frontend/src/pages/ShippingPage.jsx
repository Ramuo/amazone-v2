
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';



import {saveShippingAddress} from '../slices/cartSlice';


const ShippingPage = () => {
     //To get the shipping details from the state
     const cart = useSelector((state) => state.cart);
     //Then let us get the shipping address from the cart
    const {shippingAddress} = cart;


    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();


    //FUNCTION:
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate('/payment');
    }

    //RENDERED ELEMENT:
    return (
        <FormContainer>
            <CheckoutSteps step1 step2/>
            
            <h1>Livraison</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className="my-2">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className="my-2">
                    <Form.Label>Ville</Form.Label>
                    <Form.Control
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode' className="my-2">
                    <Form.Label>Code postal</Form.Label>
                    <Form.Control
                    type='text'
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className="my-2">
                    <Form.Label>Pays</Form.Label>
                    <Form.Control
                    type='text'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button
                type='submit'
                className='btn-primary my-2'
                >
                    Continuer
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingPage;


