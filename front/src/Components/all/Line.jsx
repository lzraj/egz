import axios from 'axios';
import { useEffect } from 'react';
import { useContext,useState } from 'react';
import { authConfig } from '../../Functions/auth';
import All from '../../Contexts/All';

function Line({ book }) {

    const { setComment, setEditData } = useContext(All);
    const [name, setName] = useState('');
    const [reserved, setReserved] = useState('');
    const [post, setPost] = useState('');
    const [komentaras, setKomentaras] = useState(null)


    const addCom = () => {
        setComment({
            post,
            book_id: book[1][0].id
        });
        setPost('');
    }

    const handleReserve = () => {
        const reserve = !book[1][0].reserved
        console.log(book)
    
     setEditData({confirmed: reserve ? 1 : 0, name, id: book.id});
     setName('')
    
    }


    useEffect(() => {   
        axios.get('http://localhost:3004/home/comments/' + book[1][0].id,  authConfig())
        .then(res => {

            setKomentaras(res.data)
        })
     
     }, [book]);


    return (

        <li className="card m-4">
            <div className="home">
                <div className="list-group">

                    <div className="home__content__info">
                        {book[1][0].image ? <div className='img-bin'>
                            <img src={book[1][0].image} alt={book[0]}>
                            </img>
                        </div> : null}
                        <h2>{book[0]}</h2>
                    </div>

                    <div className="home__content__info">
                    </div> 
                        <div className="line__content">
                        {book[1][0].description}
                        <div className="line__content__title">
                        {'Category: '+ book[1][0].category}
                        <div className="line__content">
                        Status: {book[1][0].reserved === 1 ? 'Reserved' : 'Unreserved' } 
                        </div>
                        </div>             
                        </div>
                        
                        
                        
                    
                </div>
            </div>
                <div className="mb-3">
                    <div className="col-md-6">
                    <label className="form-label">Name:</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    
                    </div>      
                </div>
                <button onClick={() => handleReserve()} type="button" className="btn btn-outline-primary" >{book[1][0].reserved ? 'Unreserve' : 'Reserve'}</button>


                <div className="comments">
                <div className="mb-3">
                    <label className="line__content">Comment:</label>
                    <textarea className="form-control" value={post} onChange={e => setPost(e.target.value)}></textarea>
                </div>
                <button onClick={addCom} type="button" className="btn btn-outline-success mx-auto d-block">Add Comment</button>
                <ul className="list-group line__content">
                    { 
                      <ul><b>Comments:</b>{komentaras?.map((kom, i) => <li key={i}>{kom.post}</li>)}
                      </ul>
                    }
                </ul>
            </div>
        </li>
        
    )
}

export default Line;