import React from "react";
import { useFileContext } from "./FileContext";
import "./index.css";

const DeletePopup: React.FC = () => {
  const { showDeletePopup, confirmDelete, cancelDelete } = useFileContext();

  if (!showDeletePopup) return null;

  return (
    <>
      <div className="delete-popup-overlay" onClick={cancelDelete} />
      <div className="delete-popup">
        <p>Are you sure you want to delete this file?</p>
        <button onClick={confirmDelete}>Yes</button>
        <button onClick={cancelDelete}>No</button>
      </div>
    </>
  );
};

export default DeletePopup;
