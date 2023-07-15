import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Form, Button, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps'


import {savePaymentMethod} from '../slices/cartSlice';


const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart;

    useEffect(() => {
        if(!shippingAddress){
            navigate('/shipping')
        }
    }, [shippingAddress, navigate]);

    //FUNCTION:
    const sumbitHandler = (e) => {
        e.preventDefault();

        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>Paiement</h1>

            <Form onSubmit={sumbitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Méthode de paiement</Form.Label>
                    <Col>
                        <Form.Check
                        type='radio'
                        className='my-2'
                        label='PayPal ou Carte de Credit'
                        id='PayPal'
                        name='paymentMethod'
                        value='PayPal'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>

                        <Button 
                        type='submit'
                        className='btn-primary mt-2'
                        >
                            Suivant
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </FormContainer>
    );
};

export default PaymentPage;