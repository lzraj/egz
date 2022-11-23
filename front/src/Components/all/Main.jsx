import All from "../../Contexts/All";
import List from "./List";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authConfig } from '../../Functions/auth';
import DataContext from "../../Contexts/DataContext";


function Main( ) {

        const [lastUpdate, setLastUpdate] = useState(Date.now());
        const [books, setBooks] = useState(null);
        const [reserve, setReserve] = useState(null);
        const [comment, setComment] = useState(null);
        const { makeMsg } = useContext(DataContext);
        const [editData, setEditData] = useState(null);




        const reList = data => {
            const d = new Map();
            data.forEach(line => {
                if (d.has(line.title)) {
                    d.set(line.title, [...d.get(line.title), line]);
                } else {
                    d.set(line.title, [line]);
                }
            });
            return [...d];
        }


        // READ for list
        useEffect(() => {
            axios.get('http://localhost:3004/home/books', authConfig())
                .then(res => {
                    setBooks(reList(res.data));
                })
        }, [lastUpdate]);

        useEffect(() => {
            if (null === comment) {
                return;
            }
            axios.post('http://localhost:3004/home/comments/' + comment.book_id, comment, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
                makeMsg(res.data.text, res.data.type);
            })
         }, [comment, makeMsg]);
        

         useEffect(() => {
            if (null === reserve) {
                return;
            }
            axios.post('http://localhost:3004/readers/', reserve, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            })
            axios.put('http://localhost:3004/books/'+ reserve.book_id, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            })
         }, [reserve]);

             useEffect(() => {
        if (null === editData) {
            return;
        }
        axios.put('http://localhost:3004/server/books/' + editData.id, editData, authConfig())
            .then(res => {
                setLastUpdate(Date.now());
            });
    }, [editData]);


      return (
        <All.Provider value={{
            books,
            setBooks,
            setReserve,
            setComment,
            setEditData
        }}>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <List/>
                </div>
            </div>
        </div>
        </All.Provider>
    );
}

export default Main;