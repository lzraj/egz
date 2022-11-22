import { useState, useContext, useEffect } from 'react';
import All from "../../Contexts/All";
import Line from './Line';

const sortData = [
    { v: 'default', t: 'Default' },
    { v: 'remaining_asc', t: 'Least Remaining' },
    { v: 'remaining_desc', t: 'Most Remaining' },
];

function List() {

    const {ideas, setIdeas} = useContext(All);
    const [sortBy, setSortBy] = useState('default');
    const [stats, setStats] = useState({itemCount: null});

    useEffect(() => {
        if (null === ideas) {
            return;
        }
        setStats(s => ({...s, itemCount: ideas.length}));
    }, [ideas]);
    useEffect(() => {
        switch (sortBy) {
            case 'remaining_asc':
             setIdeas(m => [...m].sort((a, b) => a[1][0].remaining - b[1][0].remaining));
                break;
            case 'remaining_desc':
                setIdeas(m => [...m].sort((b, a) => a[1][0].remaining - b[1][0].remaining));
                break;
            default:
                setIdeas(m => [...m ?? []].sort((a, b) => a[1][0].row - b[1][0].row));
        }

    }, [sortBy, setIdeas]);
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
                <h5 className="card-header">Idea List ({stats.itemCount})</h5>
                <div className="card-body">
                    <ul className="list-group">
                        {
                            ideas?.map(i => <Line key={i[1][0].id} idea={i} />)
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}

export default List;