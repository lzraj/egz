import { useState, useEffect } from 'react';
import Register from '../../Contexts/Register';
import Create from './Create';
import axios from 'axios';
import { authConfig, login } from '../../Functions/auth';
import { useNavigate } from 'react-router-dom';


function Main({setRoleChange}) {

    const navigate = useNavigate()
    const [createUser, setCreateUser] = useState(null);

    useEffect(() => {
        if (null === createUser) {
            return;
        }
        axios.post('http://localhost:3004/register', createUser, authConfig())
            .then(res => {
                setRoleChange(Date.now());
                login(res.data.key);
                navigate('/', { replace: true });
            });
    }, [createUser, navigate, setRoleChange]);

    return (
        <Register.Provider value={{
            setCreateUser
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col col-lg-4 col-md-12">
                        <Create />
                    </div>
                </div>
            </div>
        </Register.Provider>
    )
}
export default Main;