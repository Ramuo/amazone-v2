import {useState, useEffect}from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import {Row, Form, Button} from 'react-bootstrap';


import {
  useResetpasswordMutation
} from '../slices/userApiSlice';
import FormContainer from '../components/FormContainer';


const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const params = useParams();


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {userInfo} = useSelector((state) => state.auth);


  console.log(userInfo)

    const [resetpassword, {isLoading}] = useResetpasswordMutation();

    useEffect(() => {
        if(userInfo){
            navigate('/')
        }
    }, [navigate,  userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        //Let'us check is the pwd match
        if(password !== confirmPassword){
            toast.error("Mot de passe non identique");
            return;
        }else{
            try {
                await resetpassword({token: params?.token, password, confirmPassword });
                toast.success("Mot de passe réinitialiser avec succèss");
                navigate('/login');
              } catch (err) {
                toast.error(err?.data?.message || err.error);
              } 
        }
    };

    return (
        <>
          <Row className="row wrapper">
            <FormContainer>
            <h1 className="mb-4">Nouveau mot de passe</h1>
              <Form 
              onSubmit={submitHandler}
              >
                <Form.Group className="mb-3">
                  <Form.Label >Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
    
                <Form.Group className="mb-3">
                  <Form.Label >Confirmer mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name={confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      'Réinitialiser'
                    )
                    }
                </Button>
              </Form>
            </FormContainer>
          </Row>
        </>
      );
};

export default ResetPasswordPage;