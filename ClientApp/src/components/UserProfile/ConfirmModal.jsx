import React from 'react'

const ConfirmModal = ({name, topic,id, onConfirm,onCancel }) => {
    // if (!user) return null;
return (
    <div className="modal fade show d-block "  tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header" >
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>

          <div className="modal-body">
            <p>
              Are you sure you want to delete{" "}
              <strong>{name}</strong> {topic}?
            </p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>

            <button type="button" className="btn btn-danger" onClick={() => onConfirm(id)}>
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ConfirmModal