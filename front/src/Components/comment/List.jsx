import { useState, useEffect, useContext } from 'react';
import Comment from "../../Contexts/Comment";
import Line from './Line';


function List() {

    const { books } = useContext(Comment);
    const [stats, setStats] = useState({ bookCount: null });


    useEffect(() => {
        if (null === books) {
            return;
        }
        setStats(s => ({ ...s, bookCount: books.length }));
    }, [books]);

    return (
        <div className="card m-4">
            <h5 className="card-header">Book List ({stats.bookCount})</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        books?.map(m => <Line key={m[1][0].id} book={m} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;