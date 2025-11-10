import React, { useState } from "react";
import "./newMatrixButton.css";

const NewMatrixButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="new-matrix-btn"
      >
        + New Matrix
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Matrix</h2>
            <input type="text" placeholder="Matrix Name" />
            <textarea placeholder="Description"></textarea>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="create-btn">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewMatrixButton;
