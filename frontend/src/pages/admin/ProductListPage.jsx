import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col} from 'react-bootstrap';
import {FaEdit, FaPlus, FaTrash} from 'react-icons/fa';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';


import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} from '../../slices/productApiSlice';



const ProductListPage = () => {
  const {pageNumber} = useParams();

  const {
    data, 
    isLoading, 
    error,
    refetch
  } = useGetProductsQuery({pageNumber});

  const [
    createProduct, 
    {isLoading: loadingCreate}
  ] = useCreateProductMutation();

  const [
    deleteProduct,
    {isLoading: isLoadingDelete}
  ] = useDeleteProductMutation()

  //FUNCTIONS:
  const deleteHandler = async (id) => {
    if(window.confirm("Êtes vous sûr de vouloir supprimer?")){
      try {
        await deleteProduct(id);
        toast.success('Produit supprimé avec succès')
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.message)
      }
    };
  };

 const createProductHandler = async () => {
  if(window.confirm("Êtes-vous sûr de vouloir créer un nouveau produit ?")){
    try {
      await createProduct();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    };
  };
 };

  //RENDERED ELEMENTS:
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Produits</h1>
        </Col>
        <Col className='text-end'>
          <Button 
          className='my-3'
          onClick={createProductHandler}
          >
            <FaPlus/> Ajouter un Produit
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader/>}
      {isLoadingDelete && <Loader/>}

      {isLoading ? (<Loader/>) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
              <th>ID</th>
                  <th>NOM</th>
                  <th>Prix</th>
                  <th>CATEGORIE</th>
                  <th>MARQUE</th>
                  <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}€</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit/>
                      </Button>
                    </LinkContainer>
                    <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{color: 'white'}}/>
                    </Button>
                  </td>
                </tr>
              ))} 
            </tbody>
          </Table>

          <Paginate
          pages={data.pages}
          page={data.page}
          isAdmin={true}
          />
      </>
      )}
    </>
  );
};

export default ProductListPage;