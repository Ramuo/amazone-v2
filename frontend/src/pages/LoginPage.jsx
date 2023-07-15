import {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Row, Col, Form, Button} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import {toast} from 'react-toastify'

import {useLoginMutation} from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [login, { isLoading }] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
          navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    //FUNCTIONS:
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const res = await login({ email, password }).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate(redirect);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Connexion</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email' className='my-3'>
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='my-3'>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button
                type='submit'
                className='btn-primary mt-2'
                disabled={isLoading}
                >
                    Envoyer
                </Button>

                {isLoading && <Loader/>}
            </Form>

            <Row className='py-3'>
                <Col>
                    Nouveau client ? { ' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        S'inscrire
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default LoginPage;