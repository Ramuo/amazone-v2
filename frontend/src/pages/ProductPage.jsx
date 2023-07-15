
import {useState} from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Row, Col, Image, ListGroup, Card, Button, Badge, Form} from 'react-bootstrap';
import {toast} from 'react-toastify';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';


import { addToCart } from '../slices/cartSlice';
import {
     useGetProductsByIdQuery,
     useCreateReviewMutation
     } from '../slices/productApiSlice';




const ProductPage = () => {
    const {id: productId} = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    
    const {
        data: product, 
        isLoading, 
        refetch,
        error,  
    } = useGetProductsByIdQuery(productId);


    const [
        createReview,
        {isLoading: loadingProductReview }
    ] = useCreateReviewMutation();

    const {userInfo} = useSelector((state) => state.auth);
    


    //FUNCTIONS:
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty}));
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({productId, rating, comment}).unwrap();
            refetch();
            toast.success('Merci pour votre avis');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    
   //REBDERED ELEMENTS
    return (
        <>
            <Link className='btn btn-light my-3' to='/'>Retour</Link>
            
            {isLoading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>  
                    <Meta title={product.name}/>
                    <Row>
                        <Col md={5}>
                            <Image 
                            src={product.image} 
                            alt={product.name} 
                            fluid rounded
                            />
                        </Col>

                        <Col md={4}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} avis`}/>
                                </ListGroup.Item>
                
                                <ListGroup.Item>
                                    <strong>Prix</strong>: {product.price}€
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <strong>Description</strong>: {product.description}€
                                </ListGroup.Item>
                            </ListGroup> 
                        </Col>

                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Prix</strong>: </Col>
                                                <Col>{product.price}€</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col> <strong>Stock</strong>: </Col>
                                                <Col>{product.countInStock > 0 ? (<Badge bg="success">Disponible</Badge>) : (<Badge bg="danger">Épuisé</Badge>)}</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Quantité</Col>
                                                    <Col>
                                                        <Form.Control
                                                        as='select'
                                                        value={qty}
                                                        onChange={(e) => setQty(Number(e.target.value))}>
                                                            {[...Array(product.countInStock).keys()].map(
                                                                (x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                    </option>
                                                                )
                                                                )}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}

                                        <ListGroup.Item className='d-flex justify-content-center'>
                                            {product.countInStock === 0 ? (
                                                <Button  style={{backgroundColor: '#D3D3D3', borderColor: 'transparent'}} disabled>
                                                    Ajouter au panier
                                                </Button>
                                            ) : (
                                                <Button
                                                className='btn-primary'
                                                type='button'
                                                onClick={addToCartHandler}
                                                >
                                                        Ajouter au panier
                                                </Button>
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className='review'>
                        <Col md={6}>
                            <h2>Avis</h2>
                            {product.reviews.length === 0 && <Message variant='info'>Aucun avis</Message>}
                            <ListGroup variant='flash'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating}/>
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h2>Laisser un avis</h2>

                                    {loadingProductReview && <Loader/>}

                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating' className='my-2'>
                                                <Form.Label>Avis</Form.Label>
                                                <Form.Control
                                                as='select'
                                                value={rating}
                                                onChange={(e) => setRating(Number(e.target.value))}
                                                >
                                                    <option value="">Choisir...</option>
                                                    <option value="1">1 étoile</option>
                                                    <option value="2">2 étoiles</option>
                                                    <option value="3">3 étoiles</option>
                                                    <option value="4">4 étoiles</option>
                                                    <option value="5">5 étoiles</option>
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId='comment' className='my-2'>
                                                <Form.Label>Commentaire</Form.Label>
                                                <Form.Control
                                                as='textarea'
                                                row='3'
                                                required
                                                value={comment}
                                                placeholder='Laisser un commentaire'
                                                onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>

                                            <Button
                                            type='submit'
                                            disabled={loadingProductReview}
                                            className='btn-primary'
                                            >
                                                Envoyer
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message>
                                            Veuillez <Link to='/login'> vous connecter</Link> pour laisser un avis.{' '}
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
            
        </>
        
    );
};

export default ProductPage;











