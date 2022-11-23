import { useState, useContext, useEffect } from 'react';
import All from "../../Contexts/All";
import Line from './Line';

const sortData = [
    { v: 'default', t: 'Default' },
    { v: 'title_asc', t: 'Sort Alphabetically' },
    { v: 'title_desc', t: 'Sort Unalphabetically' },
];

function List() {

    const {books, setBooks} = useContext(All);
    const [sortBy, setSortBy] = useState('default');
    const [stats, setStats] = useState({itemCount: null});

    useEffect(() => {
        if (null === books) {
            return;
        }
        setStats(s => ({...s, itemCount: books.length}));
    }, [books]);
    useEffect(() => {
        switch (sortBy) {
            case 'title_asc':
             setBooks(m => [...m].sort((a, b) => a[1][0].title - b[1][0].title));
                break;
            case 'title_desc':
                setBooks(m => [...m].sort((b, a) => a[1][0].title - b[1][0].title));
                break;
            default:
                setBooks(m => [...m ?? []].sort((a, b) => a[1][0].row - b[1][0].row));
        }

    }, [sortBy, setBooks]);
    return (
        <>
            <div className="card m-4">
                <h5 className="card-header">Sort</h5>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Sort By</label>
                        <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            {
                                sortData.map(c => <option key={c.v} value={c.v}>{c.t}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="card m-4">
                <h5 className="card-header">Available Book List ({stats.itemCount})</h5>
                <div className="card-body">
                    <ul className="list-group">
                        {
                            books?.map(i => <Line key={i[1][0].id} book={i} />)
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}

export default List;