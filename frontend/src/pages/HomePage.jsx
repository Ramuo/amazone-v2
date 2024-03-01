import {Row, Col} from 'react-bootstrap';
import {useParams, Link} from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

 

import { useGetProductsQuery } from '../slices/productApiSlice';
 

const HomePage = () => {
    const {pageNumber, keyword} = useParams();

    const {
        data, 
        isLoading, 
        error
    } = useGetProductsQuery({keyword, pageNumber});
   

    return (
        <>
            {!keyword ? <ProductCarousel/> : (
                <Link to='/' className='btn btn-light mb-4'>Retour</Link>
            )}
           
            {isLoading ? (
                <Loader/>
            ) :  error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <h1>Nos derniers arrivages</h1>
                    <Row>
                        {data.products.map((product) => (
                            <Col key={product._id} sm={12} md={12} lg={4} xl={3}>
                                <Product product={product}/>
                            </Col>
                        ))}
                    </Row>

                    <Paginate
                    pages={data.pages}
                    page={data.page}
                    keyword = {keyword ? keyword : ''}
                    />
                </>
            ) }

            
        </>
    );
};

export default HomePage;