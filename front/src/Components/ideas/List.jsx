import { useContext } from 'react';
import Ideas from "../../Contexts/Ideas";
import Line from './Line';

function List() {

    const { ideas } = useContext(Ideas);

    return (
        <div className="card m-4">
            <h5 className="card-header">Idea List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        ideas?.map(i => <Line key={i.id} idea={i} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;