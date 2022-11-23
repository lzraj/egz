import { useContext } from 'react';
import Books from '../../Contexts/Books';

function Line({ book }) {

    const { setDeleteData, setModalData, setEditData} = useContext(Books);

const handleReserve = () => {
    const reserve = !book.reserved

 setEditData({confirmed: reserve ? 1 : 0, id: book.id});

}
    return (
        <li className="list-group-item">
            <div className="line">
                <div className="line__content">
                    <div className="line__content__info">
                        {book.image ? <div className='img-bin'>
                            <img src={book.image} alt={book.title}>
                            </img>
                        </div> : <span className="red-image">No image</span>}
                    </div>
                    <div className="line__content__title">
                        {book.title}
                    </div>

                    <div className="line__content__info">
                        Description: {book.description}
                    </div>
                    <div className="line__content__title">
                        {'Category: '+ book.category}
                    </div>
                    <div className="line__content__title">
                        Status: {book.reserved === 1 ? 'Reserved' : 'Unreserved' }
                        
                    </div>
                </div>
                <div className="line__buttons">
                    <button onClick={() => setModalData(book)} type="button" className="btn btn-outline-success">Edit</button>
                    <button onClick={() => setDeleteData(book)} type="button" className="btn btn-outline-danger">Delete</button>
                    <button onClick={() => handleReserve()} type="button" className="btn btn-outline-primary" >{book.reserved ? 'Unreserve' : 'Reserve'}</button>
                </div>
            </div>
        </li>
    )
}

export default Line;