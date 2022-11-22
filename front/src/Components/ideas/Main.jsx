import { useState, useEffect } from 'react';
import Ideas from '../../Contexts/Ideas';
import Create from './Create';
import List from './List';
import axios from 'axios';
import Edit from './Edit';
import { authConfig } from '../../Functions/auth';

function Main({userId}) {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [createData, setCreateData] = useState(null);
    const [ideas, setIdeas] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [modalData, setModalData] = useState(null);
    // READ for list
    
    useEffect(() => {
        if (null === userId) {
            return;
        }
        axios.get('http://localhost:3004/ideas/' + userId, authConfig())
            .then(res => {
                setIdeas(res.data);
            })
    }, [lastUpdate, userId]);

    useEffect(() => {
        if (null === createData) {
            return;
        }
        axios.post('http://localhost:3004/ideas', createData, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            });
    }, [createData]);

    useEffect(() => {
        if (null === deleteData) {
            return;
        }
        axios.delete('http://localhost:3004/ideas/' + deleteData.id, authConfig())
        .then(res => {
            setLastUpdate(Date.now());
        })
            .catch(err=> console.log(err))
    }, [deleteData]);


    return (
        <Ideas.Provider value={{
            setCreateData,
            ideas,
            setDeleteData,
            modalData,
            setModalData,
            userId
        }}>
            <div className="container">
                <div className="row">
                    <div className="col col-lg-4 col-md-12">
                        <Create />
                    </div>
                    <div className="col col-lg-8 col-md-12">
                        <List />
                    </div>
                </div>
            </div>
            <Edit />
        </Ideas.Provider>
    )
}
export default Main;