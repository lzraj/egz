import { useContext } from 'react';
import Comment from '../../Contexts/Comment';

function Line({ book }) {

    const { setComment } = useContext(Comment);

    const remove = id => {
        setComment({id});
    }

    return (
        <li className="list-group-item">
            <div className="home">
                <div className="home__content">
                    <div className="home__content__info">
                        <h2>{book[0]} <small>({book[1].length})</small></h2>
                        {book[1][0].image ? <div className='img-bin'>
                            <img src={book[1][0].image} alt={book[0]}>
                            </img>
                        </div> : null}
                    </div>
                    <div className="home__content__price">
                        {book[1][0].title}
                    </div>
                    <div className="home__content__price">
                       {book[1][0].description}
                    </div>
                    <div className="home__content__price">
                      Category:  {book[1][0].category}
                    </div>
                    <div className="home__content__price">
                      Status: {book[1][0].reserved === 1 ? 'Reserved' : 'Unreserved' }
                    </div>
                </div>
            </div>
            <div className="comments">
                <ul className="list-group">
                    {
                        book[1]?.map(c => c.cid !== null ? <li key={c.cid} className="list-group-item">
                            <p>{c.post}</p>
                            <div className="home__buttons">
                                <button onClick={() => remove(c.cid)} type="button" className="btn btn-outline-danger">Delete</button>
                            </div>
                        </li> : null)
                    }
                </ul>
            </div>
        </li>
    )
}

export default Line;