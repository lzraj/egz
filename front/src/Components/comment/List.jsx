import { useState, useEffect, useContext } from 'react';
import Comment from "../../Contexts/Comment";
import Line from './Line';


function List() {

    const { ideas } = useContext(Comment);
    const [stats, setStats] = useState({ movieCount: null });


    useEffect(() => {
        if (null === ideas) {
            return;
        }
        setStats(s => ({ ...s, movieCount: ideas.length }));
    }, [ideas]);

    return (
        <div className="card m-4">
            <h5 className="card-header">Idea List ({stats.movieCount})</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        ideas?.map(m => <Line key={m[1][0].id} idea={m} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;