import { useState, useContext, useRef } from 'react';
import Ideas from '../../Contexts/Ideas';
import DataContext from '../../Contexts/DataContext';
import getBase64 from '../../Functions/getBase64';

function Create() {

    const [title, setTitle] = useState('');
    const [idea, setIdea] = useState('');
    const [goal, setGoal] = useState('');
    const [raised, setRaised] = useState('');
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
            if (goal.replace(/[^\d.]/, '') !== goal) {
                makeMsg('Invalid goal', 'error');
                return;
            }
            if (parseFloat(goal) > 10000000) {
                makeMsg('Max goal is 10M', 'error');
                return;
            }

        setCreateData({
            title,
            idea,
            goal: parseFloat(goal),
            raised,
            image: photoPrint,
            user_id: userId
        
        });
        setTitle('');
        setIdea('');
        setGoal('');
        setRaised(0);
        setPhotoPrint(null);
        fileInput.current.value = null;
    }

    return (
        <div className="card m-4">
            <h5 className="card-header">New Idea</h5>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Idea Description</label>
                    <textarea type="text" className="form-control" rows="5" value={idea} onChange={e => setIdea(e.target.value)}></textarea> 
                </div>    
                <label className="form-label">Goal</label>
                <div className="input-group mb-3">
                    <span className="input-group-text">€</span>
                    <input type="text" className="form-control" value={goal} onChange={e => setGoal(e.target.value)} /> 
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