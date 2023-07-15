import {Link} from 'react-router-dom';
import {Carousel, Image} from 'react-bootstrap';
import Message from '../components/Message';


import {useGetTopProductsQuery} from '../slices/productApiSlice';

import React from 'react'

const ProductCarousel = () => {
    const {data: products, isLoading, error} = useGetTopProductsQuery();


    return isLoading ? null : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
    ) : (
        <Carousel pause='hover' className='btn-primary mb-4'>
           {products.map((product) => (
            <Carousel.Item key={product._id}>
                <Link to={`product/${product._id}`}>
                    <Image src={product.image} alt={product.name} fluid/>
                    <Carousel.Caption className='carousel-caption'>
                        <h4 className='text-white text-right mb-3'>
                            {product.name}: {product.price}€
                        </h4>
                    </Carousel.Caption>
                </Link>
            </Carousel.Item>
           ))}
            
        </Carousel>
    )
};

export default ProductCarousel;


