import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddFacultyModal = ({ isOpen, onClose, onSubmit, isEdit = false, initialData = null }) => {
    const [facultyName, setFacultyName] = useState("");
    const [facultyDescription, setFacultyDescription] = useState("");


    useEffect(()=> {
        if (isEdit && initialData) {
            setFacultyName(initialData.facultyName || "");
            setFacultyDescription(initialData.facultyDescription || "");
        } else{
            setFacultyName("");
            setFacultyDescription("");
        }
    },[isEdit, initialData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!facultyName.trim()) {
            toast.error("Faculty name is required");
            return;
        }

        onSubmit({
            facultyName,
            facultyDescription
        });

        setFacultyName("");
        setFacultyDescription("");
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header flex justify-content-between align-items-center " >
                        <h5 className="modal-title">{isEdit ? "Edit Faculty" : "Add Faculty"}</h5>
                        {/* <button className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button> */}
                    </div>

                    <div className="modal-body">
                        <div className="form-group">
                            <label>Faculty Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={facultyName}
                                onChange={(e) => setFacultyName(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={facultyDescription}
                                onChange={(e) => setFacultyDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {isEdit ? "Update Faculty" : "Add Faculty"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddFacultyModal;
