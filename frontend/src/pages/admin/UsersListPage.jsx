import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button} from 'react-bootstrap';
import {FaTimes, FaTrash, FaEdit, FaCheck} from 'react-icons/fa';
import Message from '../../components/Message'
import Loader from '../../components/Loader';
import {toast} from 'react-toastify';


import { 
    useGetUsersQuery,
    useDeleteUserMutation,
} from '../../slices/userApiSlice';

const UsersListPage = () => {
    const {data: users, isLoading, error, refetch} = useGetUsersQuery();

  

    const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();
    

const deleteUserHandler = async (id) => {
    if(window.confirm("Êtes-vous sûr de supprimer cet utilisateur ?")){
        try {
            await deleteUser(id);
            toast.success("Utilisateur supprimé avec succès");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
};


    return (
    <>
        <h1>Liste des clients</h1>

        {loadingDelete && <Loader/>}

        {isLoading ? ( 
            <Loader/>
        ) : error ? (
            <Message variant='danger'>
                {error?.data?.message || error.error}
            </Message>
        ) : (
            <Table striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>NOM CLIENTS</td>
                        <td>E-MAIL</td>
                        <td>ADMIN</td>
                        <td>ACTIONS</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>
                                <a href={`mailto:${user.email}`}>
                                    {user.email}
                                </a>
                            </td>
                            <td>
                                {user.isAdmin ? (
                                    <FaCheck style={{color: 'green'}}/>
                                ) : (
                                    <FaTimes style={{color: 'red'}}/>
                                )}
                            </td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button
                                    variant='light'
                                    className='btn-sm'
                                    >
                                        <FaEdit/>
                                    </Button>
                                </LinkContainer>

                                <Button
                                variant='danger'
                                className='btn-sm'
                                onClick={() => deleteUserHandler(user._id)}
                                >
                                    <FaTrash style={{color: 'white'}}/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
    );
};

export default UsersListPage;