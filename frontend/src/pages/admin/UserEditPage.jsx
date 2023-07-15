import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import {toast} from 'react-toastify';



import {
    useGetUserByIdQuery,
    useUpdateUserMutation
} from '../../slices/userApiSlice'



const UserEditPage = () => {
    const {id: userId} = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        data: user, 
        isLoading, 
        refetch, 
        error 
    } = useGetUserByIdQuery(userId);
    

    const [
        updateUser, 
        {isLoading: loadingUpdate}
    ] = useUpdateUserMutation()


    useEffect(() => {
        if(user){
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }

    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await updateUser({userId, name, email, isAdmin})
            toast.success('Profil modifié avec succès');
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            
        }
        
    };

    return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
            Retour
        </Link>
        <FormContainer>
            <h1 className='mb-3'>Modifier le profil</h1>
            {loadingUpdate && <Loader/>}

            {isLoading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>
                    {error}
                </Message>
            ) : (
            
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                            type='text'
                            placeholder=" Modifier le nom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                            type='email'
                            placeholder=" Modifier l'adresse E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='isAdmin' className='my-2'>
                            <Form.Check
                            type='checkbox'
                            label='Administrateur'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                        type='submit'
                        className='btn-primary'
                        style={{marginTop: '1rem'}}
                        >
                            Enregistrer
                        </Button>
                    </Form>
                
            )}
        </FormContainer>
    </>
    );
};

export default UserEditPage;