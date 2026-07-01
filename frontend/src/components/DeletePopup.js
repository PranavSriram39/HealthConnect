import React from 'react';
import '../styles/DeletePopup.css';

const DeletePopup = ({ handleDelete, handleClosePopup }) => {
    return (
        <div className="delete-popup-overlay z-40">
            <div className="delete-popup">
                <p className='text-slate-600 text-xl font-extrabold break-words'>Are you sure you want to delete your account?</p>
                <div className="button-container">
                    <button onClick={handleClosePopup}>Cancel</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DeletePopup;
