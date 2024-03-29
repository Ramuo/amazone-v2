
import {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import {toast} from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';


import { 
    useGetOrderByIdQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useDeliverOrderMutation
} from '../slices/orderApiSlice';
 


const OrderPage = () => {
    const {id: orderId} = useParams();

    const {
        data: order, 
        refetch, 
        isLoading, 
        error
    } = useGetOrderByIdQuery(orderId);

    const [
        payOrder, 
        {isLoading: loadingPay}
    ] = usePayOrderMutation();

    const [
        deliverOrder, 
        {isLoading: loadingDeliver}
    ] = useDeliverOrderMutation();

    const [
        {isPending}, 
        paypalDispatch
    ] = usePayPalScriptReducer();

    const {
        data: paypal, 
        isLoading: loadingPaypal, 
        error: errorPaypal
    } = useGetPaypalClientIdQuery();

    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if(!errorPaypal && !loadingPaypal && paypal.clientId){
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'EUR',
                    }
                });
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending'
                });
            };

            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript();
                }
            }
        };
    }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);


    //FUNCTIONS:
    function onApprove ( data, actions) {
        return actions.order.capture().then(async function (details){
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success("Paiement réussi");
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        });
    };
    

    //TO TEST PAYPAL PAYMENT
    // async function onApproveTest () {
    //     await payOrder({orderId, details: {payer: {} } });
    //     refetch();
    //     toast.success("Paiement réussi");
    // };


    function onError (err ){
        toast.error(err.message);
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId) => {
            return orderId;
        });
    };

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Command Livré");
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        };
    };

    //RENDERED ELEMENTS:
    return isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error.data.message}</Message>) : (
        <>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Livraison</h2>
                            <p>
                                <strong>Nom:</strong> {order.user.name}
                            </p>
                            <p>
                                <strong>E-email:</strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Aresse:</strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                            </p>

                            {order.isDelivered ? (
                                <Message variant='success' >Livré {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Non Livré</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Méthode de paiement</h2>
                            <p>
                                {order.paymentMethod}
                            </p>

                            {order.isPaid ? (
                                <Message variant='success'> Payé le {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Non payé</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Article(s) Commandé(s)</h2>
                            {order.orderItems.map((item, index)  => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name} {' '}
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} x {item.price}€ = {item.qty * item.price}€
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Ma commande</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Prix:</strong></Col>
                                    <Col>
                                        {order.itemsPrice}€
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Livraison:</strong></Col>
                                    <Col>
                                        {order.shippingPrice}€
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>TVA:</strong></Col>
                                    <Col>
                                        {order.taxPrice}€
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Total:</strong></Col>
                                    <Col>
                                        {order.totalPrice}€
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}

                                    {isPending  ? <Loader/> : (
                                        <div>
                                            {/* <Button 
                                            onClick={onApproveTest} 
                                            style={{marginBottom: '10px'}}
                                            >
                                                Test Pay Order
                                            </Button> */}
                                            <div>
                                                <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )}

                            {loadingDeliver && <Loader/>}

                            {userInfo && userInfo.isAdmin && order.isPaid && !order.deliveredAt && (
                                <ListGroup.Item className='d-flex justify-content-center'>
                                    <Button
                                    type='button'
                                    className='btn-primary btn-block'
                                    onClick={deliverOrderHandler}>
                                        Marquer comme livré
                                    </Button>
                                </ListGroup.Item>
                            )}
                           
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

export default OrderPage;