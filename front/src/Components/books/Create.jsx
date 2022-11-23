import { useState, useContext, useRef } from 'react';
import Ideas from '../../Contexts/Books';
import DataContext from '../../Contexts/DataContext';
import getBase64 from '../../Functions/getBase64';

function Create() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [reserved, setReserved] = useState('0');
    const fileInput = useRef();

    const { setCreateData, userId } = useContext(Ideas);
    const {makeMsg} = useContext(DataContext);

    const [photoPrint, setPhotoPrint] = useState(null);

    const doPhoto = () => {
        getBase64(fileInput.current.files[0])
            .then(photo => setPhotoPrint(photo))
            .catch(_ => {
                // tylim
            })
    }

        const add = () => {
            if (title.length === 0 || title.length > 50) {
                makeMsg('Invalid title', 'error');
                return;
            }
            if (description.length === 0 || description.length > 200) {
                makeMsg('Invalid description', 'error');
                return;
            }
            

        setCreateData({
            title,
            description,
            category,
            reserved,
            image: photoPrint,
            user_id: userId
        
        });
        setTitle('');
        setDescription('');
        setCategory('');
        setReserved('0')
        setPhotoPrint(null);
        fileInput.current.value = null;
    }

    return (
        <div className="card m-4">
            <h5 className="card-header">New Book</h5>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea type="text" className="form-control" rows="5" value={description} onChange={e => setDescription(e.target.value)}></textarea> 
                </div>    
                <label className="form-label">Category</label>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)} /> 
                </div>  
                <label className="form-label">Reserved</label>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" value={reserved} onChange={e => setReserved(e.target.value)} /> 
                </div>  
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input ref={fileInput} type="file" className="form-control" onChange={doPhoto} />
                </div>
                {photoPrint ? <div className='img-bin'><img src={photoPrint} alt="upload"></img></div> : null}
                <button onClick={add} type="button" className="btn btn-outline-success">Add</button>
            </div>
        </div>
    );
}

export default Create;