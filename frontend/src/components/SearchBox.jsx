import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Form, Button, InputGroup} from 'react-bootstrap';
import {FaSearch} from 'react-icons/fa'

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
 
    const [keyword, setKeyword] = useState(urlKeyword);


    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword) {
            setKeyword('');
            navigate(`/search/${keyword.trim()}`);
        } else{
            navigate('/');
        }
    };

    return (
    <Form onSubmit={submitHandler} className='d-flex'>
        <InputGroup>
            <Form.Control
            type='text'
            name='q'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Rechercher'
            />
            <Button
            className='searchBox outline-none'
            type='submit'
            placeholder='Rechercher'
            >
                <FaSearch style={{color: 'white'}}/>
            </Button>
        </InputGroup>
    </Form>
    );
};

export default SearchBox;