
import {Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Rating from './Rating';




const Product = ({product}) => {
    
    //RENDERED ELEMENTS
    return (
    <Card className='my-3 p-3 rounded'>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top'/>
        </Link>
        <Card.Body>
            <Link to={`/product/${product._id}`} className='text-decoration-none text-dark'>
                <Card.Title as='div' className='product-title'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <Rating value={product.rating} text={`${product.numReviews} avis`}/>
            </Card.Text>

            <Card.Text as='h5'>
                {product.price}€
            </Card.Text>

            {product.countInStock === 0 ? (
                <Button  style={{backgroundColor: '#D3D3D3', borderColor: 'transparent'}} disabled>
                    Produit épuisé
                </Button>
            ) : (

                <Link to={`/product/${product._id}`}>
                    <Button
                    className='btn-primary'
                    type='button'
                    >
                            Ajouter au panier
                    </Button>
                </Link>
            )}
        </Card.Body>

    </Card>
    );
};

export default Product