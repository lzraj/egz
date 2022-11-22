import { useContext } from 'react';
import Comment from '../../Contexts/Comment';

function Line({ idea }) {

    const { setComment } = useContext(Comment);

    const remove = id => {
        setComment({id});
    }

    return (
        <li className="list-group-item">
            <div className="home">
                <div className="home__content">
                    <div className="home__content__info">
                        <h2>{idea[0]} <small>({idea[1].length})</small></h2>
                        {idea[1][0].image ? <div className='img-bin'>
                            <img src={idea[1][0].image} alt={idea[0]}>
                            </img>
                        </div> : null}
                    </div>
                    <div className="home__content__price">
                        Goal: {idea[1][0].goal} €
                    </div>
                    <div className="home__content__price">
                       Raised: {idea[1][0].raised} €
                    </div>
                </div>
            </div>
            <div className="comments">
                <ul className="list-group">
                    {
                        idea[1]?.map(c => c.cid !== null ? <li key={c.cid} className="list-group-item">
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