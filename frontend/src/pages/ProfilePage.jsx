
import {useState, useEffect} from 'react';
import {Table, Form, Button, Row, Col} from 'react-bootstrap';
import {FaTimes} from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';


import {useProfileMutation} from '../slices/userApiSlice';
import {setCredentials} from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';



const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const {userInfo} = useSelector((state) => state.auth);

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();

    const {data: orders, isLoading, error} = useGetMyOrdersQuery();
   


    useEffect(() => {
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, userInfo.name, userInfo.email]);

    //FUNCTION
    const submitHandler = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            toast.error("Mot de passe non identique")
        }else{
            try {
                const res = await updateProfile({
                    _id: userInfo._id, 
                    name, 
                    email, 
                    password
                }).unwrap();

                dispatch(setCredentials(res));

                toast.success("Profil Modifié avec succèss")
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
        
    };

    //RENDERED ELEMENT:
    return <Row>
        <Col md={3}>
            <h2>Mon Profile</h2>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                    type='text'
                    name={name}
                    placeholder='Votre nom'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                    type='email'
                    name={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                    type='password'
                    name={password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Confirmer votre mot de passe</Form.Label>
                    <Form.Control
                    type='password'
                    name={confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                <Button
                type='submit'
                className='btn-primary my-3'
                >
                    Modifier
                </Button>

                {loadingUpdateProfile && <Loader/>}  
            </Form>
        </Col>

        <Col md={9}>
            <h2>Mes commandes</h2>

            {isLoading ? (<Loader/>) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <Table striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAYÉ</th>
                        <th>LIVRÉ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                                {order.isPaid ? (
                                    order.paidAt.substring(0, 10)
                                ) : (
                                    <FaTimes style={{color: 'red'}}/>
                                )}
                            </td>
                            <td>
                                {order.isDelivered ? (
                                    order.deliveredAt.substring(0, 10)
                                ) : (
                                    <FaTimes style={{color: 'red'}}/>
                                )}
                            </td>
                            <td>
                               <LinkContainer to={`/order/${order._id}`}>
                                    <Button
                                    type='button'
                                    className='btn-sm'
                                    variant='light'
                                    >
                                        Détails
                                    </Button>
                               </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            )}
        </Col>
    </Row>
};

export default ProfilePage;

