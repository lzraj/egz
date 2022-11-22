import axios from 'axios';
import { useEffect } from 'react';
import { useContext,useState } from 'react';
import { authConfig } from '../../Functions/auth';
import All from '../../Contexts/All';

function Line({ idea }) {

    const { setDonate, setComment } = useContext(All);
    const [name, setName] = useState('');
    const [sum, setSum] = useState('');
    const [post, setPost] = useState('');
    const [komentaras, setKomentaras] = useState(null)


    const addCom = () => {
        setComment({
            post,
            idea_id: idea[1][0].id
        });
        setPost('');
    }



    const add = () => {
        setDonate({
            name,
            sum,
            idea_id: idea[1][0].id
        });
        setName('')
        setSum('')
    }

    useEffect(() => {   
        axios.get('http://localhost:3004/home/comments/' + idea[1][0].id,  authConfig())
        .then(res => {

            setKomentaras(res.data)
        })
     
     }, [idea]);


    return (

        <li className="card m-4">
            <div className="home">
                <div className="list-group">

                    <div className="home__content__info">
                        {idea[1][0].image ? <div className='img-bin'>
                            <img src={idea[1][0].image} alt={idea[0]}>
                            </img>
                        </div> : null}
                        <h2>{idea[0]}</h2>
                    </div>

                    <div className="home__content__info">
                        {idea[1][0].idea}
                    </div> 
                        <div className="line__content__title">
                        {'Goal: '+ idea[1][0].goal + '€'}
                        <div className="line__content__title">
                        {'Raised: '+ idea[1][0].raised + '€'}
                        <div className="line__content">
                        Remaining:  {idea[1][0].remaining <= 0 ? 'Goal Reached' : idea[1][0].remaining} € 
                        </div>
                        </div> 
                        <br/>
                        <ul>DONORS:{idea[1].map((ide, i)=> <li key={i}>{ide.name}   Donated: {ide.sum}€</li>)}
                        </ul>
                        </div>
                        
                        
                        
                    
                </div>
            </div>
                <div className="mb-3">
                    <div className="col-md-6">
                    <label className="form-label">Name:</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    <label className="form-label">Donation Amount:</label>
                <div className="input-group">
                    <span className="input-group-text">€</span>
                    <input type="text" className="form-control" value={sum} onChange={e => setSum(e.target.value)} /> 
                    </div> 
                    </div>      
                </div>
                <button onClick={add} type="button" className="btn btn-outline-success mx-auto">Donate</button>
                <div className="comments">

            
                <div className="mb-3">
                    <label className="line__content">Comment:</label>
                    <textarea className="form-control" value={post} onChange={e => setPost(e.target.value)}></textarea>
                </div>
                <button onClick={addCom} type="button" className="btn btn-outline-success mx-auto d-block">Add Comment</button>
                <ul className="list-group line__content">
                    { 
                      <ul>COMMENTS:{komentaras?.map((kom, i) => <li key={i}>{kom.post}</li>)}
                      </ul>
                    }
                </ul>
            </div>
        </li>
        
    )
}

export default Line;