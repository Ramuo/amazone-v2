import {useState, useEffect}from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import FormContainer from '../components/FormContainer';
import {Row, Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';


import {useForgotpasswordMutation} from '../slices/userApiSlice';


const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail ] = useState("");

    const {userInfo} = useSelector((state) => state.auth);

    const [forgotpassword, {isLoading}] = useForgotpasswordMutation(); 

    useEffect(() => {
        if(userInfo){
            navigate('/')
        }
    }, [navigate,  userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await forgotpassword({ email}).unwrap();
            toast.success("Verifier votre boite email")
            navigate('/');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
    };


    return (
        <Row className="wrapper d-flex justify-content-center mt-5">
            <FormContainer>
            <h1 className='text-center'>Mot de passe oublié ?</h1>
                <Form
                onSubmit={ submitHandler}
                >
                <Form.Group className="mt-3">
                    <Form.Label>Votre Email</Form.Label>
                    <Form.Control
                    type="email"
                    id="email_field"
                    className="form-control"
                    name={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Button
                type="submit"
                className='btn-primary mt-4 w-100'
                >
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <div class="spinner-border spinner-border-sm text-light"  role="status" >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                      'Envoyer'
                    )
                    }
                </Button>
                </Form>
            </FormContainer>
        </Row>
    );
}

export default ForgotPasswordPage;