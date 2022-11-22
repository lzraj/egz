import { useState, useEffect } from 'react';
import Ideas from '../../Contexts/Ideas';
import List from './List';
import axios from 'axios';
import Edit from './Edit';
import { authConfig } from '../../Functions/auth';

function Main() {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [createData, setCreateData] = useState(null);
    const [ideas, setIdeas] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [editData, setEditData] = useState(null);

    // READ for list
    useEffect(() => {
        axios.get('http://localhost:3004/server/ideas', authConfig())
            .then(res => {
                setIdeas(res.data);
            })
    }, [lastUpdate]);

    useEffect(() => {
        if (null === createData) {
            return;
        }
        axios.post('http://localhost:3004/server/ideas', createData, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            });
    }, [createData]);

    useEffect(() => {
        if (null === deleteData) {
            return;
        }
        axios.delete('http://localhost:3004/server/ideas/' + deleteData.id, authConfig())
        .then(res => {
            setLastUpdate(Date.now());
        })
            .catch(err=> console.log(err))
    }, [deleteData]);

    useEffect(() => {
        if (null === editData) {
            return;
        }
        axios.put('http://localhost:3004/server/ideas/' + editData.id, editData, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            });
    }, [editData]);
    


    return (
        <Ideas.Provider value={{
            setCreateData,
            ideas,
            setDeleteData,
            modalData,
            setModalData,
            setEditData
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <List />
                    </div>
                </div>
            </div>
            <Edit />
        </Ideas.Provider>
    )
}
export default Main;