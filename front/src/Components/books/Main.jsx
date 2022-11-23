import { useState, useEffect } from 'react';
import Books from '../../Contexts/Books';
import Create from './Create';
import List from './List';
import axios from 'axios';
import Edit from './Edit';
import { authConfig } from '../../Functions/auth';

function Main({userId}) {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [createData, setCreateData] = useState(null);
    const [books, setBooks] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [modalData, setModalData] = useState(null);
    // READ for list
    
    useEffect(() => {
        if (null === userId) {
            return;
        }
        axios.get('http://localhost:3004/books/' + userId, authConfig())
            .then(res => {
                setBooks(res.data);
            })
    }, [lastUpdate, userId]);

    useEffect(() => {
        if (null === createData) {
            return;
        }
        axios.post('http://localhost:3004/books', createData, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            });
    }, [createData]);

    useEffect(() => {
        if (null === deleteData) {
            return;
        }
        axios.delete('http://localhost:3004/books/' + deleteData.id, authConfig())
        .then(res => {
            setLastUpdate(Date.now());
        })
            .catch(err=> console.log(err))
    }, [deleteData]);


    return (
        <Books.Provider value={{
            setCreateData,
            books,
            setDeleteData,
            modalData,
            setModalData,
            userId
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-12">
                        <Create />
                    </div>
                    <div className="col-lg-8 col-md-12">
                        <List />
                    </div>
                </div>
            </div>
            <Edit />
        </Books.Provider>
    )
}
export default Main;