import { useContext } from 'react';
import Books from "../../Contexts/Books";
import Line from './Line';

function List() {

    const { books } = useContext(Books);

    return (
        <div className="card m-4">
            <h5 className="card-header">Book List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        books?.map(i => <Line key={i.id} book={i} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;