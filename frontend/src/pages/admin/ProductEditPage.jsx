import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer'; 

import {
    useUpdateProductMutation,
    useGetProductsByIdQuery,
    useUploadProductImageMutation,
} from '../../slices/productApiSlice'


const ProductEditPage = () => {
    const {id: productId} = useParams();
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');


    const {
        data: product, 
        isLoading, 
        refetch, 
        error
    } = useGetProductsByIdQuery(productId);
    

    const [
        updateProduct, 
        {isLoading: loadingUpdate}
    ] = useUpdateProductMutation();


    const [
        uploadProductImage,
        {isLoading: loadingUpload}
    ] = useUploadProductImageMutation()
   
    //FUNCTIONS:
    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock
            });

            toast.success('Produit éditer avec succèss');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        };
    };


    useEffect(() => {
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        };
    };

    
    //RENDERED ELEMENTS:
    return (
    <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
            Retour
        </Link>

        <FormContainer>

            <h1>Éditer un produit</h1>

            {loadingUpdate && <Loader/>}

            {isLoading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{error.data.message}</Message>
            ) : (
                 <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Nom du produit'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price' className='my-2'>
                        <Form.Label>Prix</Form.Label>
                        <Form.Control
                        type='number'
                        placeholder='Prix du produit'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image' className='my-2'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Image du produit'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        ></Form.Control>
                        <Form.Control
                        type='file'
                        label= "Choisir un fichier"
                        onChange={uploadFileHandler}
                        ></Form.Control>
                        {loadingUpload && <Loader/>}
                    </Form.Group> 


                    <Form.Group controlId='brand' className='my-2'>
                        <Form.Label>Marque</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Marque du produit'
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='my-2'>
                        <Form.Label>En stock</Form.Label>
                        <Form.Control
                        type='number'
                        placeholder='Quantité en stock'
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Catégorie</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Catégorie du produit'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description' className='my-2'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Description du produit'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button
                    type='submit'
                    className='btn-primary mt-1'
                    >
                        Éditer
                    </Button>
                 </Form>
            )}
        </FormContainer>
    </>
    );
};

export default ProductEditPage;