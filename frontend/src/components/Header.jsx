import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {Navbar, Nav, Container, Badge, NavDropdown} from 'react-bootstrap';
import {FaShoppingCart, FaUser} from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import SearchBox from './SearchBox';


import {useLogoutMutation} from '../slices/userApiSlice'; //To logout the api (server) logoutApiCall
import { logout} from '../slices/authSlice'; // To logout localy

const Header = () => {
    const {cartItems} = useSelector((state) => state.cart);
    const {userInfo} = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.log(err);
            
        }
    }

    return (
        <header>
            <Navbar variant='dark' expand='lg' collapseOnSelect id="navbar">
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand >
                            FASHION+
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox/>
                        <Nav className='ms-auto'>
                            <LinkContainer to='/cart'>
                                <Nav.Link>
                                    <FaShoppingCart/> Panier
                                    {
                                        cartItems.length > 0 && (
                                            <Badge pill className='badge-header'>
                                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                                            </Badge>
                                        )
                                    }
                                </Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Déconnexion
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <Nav.Link>
                                        <FaUser/> Connexion
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Commandes</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Produits</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            ) }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;


