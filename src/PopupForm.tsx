import React from "react";
import { useFileContext } from "./FileContext";
import "./index.css"; // Make sure to import your CSS file

const PopupForm: React.FC = () => {
  const {
    handleSave,
    editFileName,
    setEditFileName,
    editCreator,
    setEditCreator,
    handleFileChange,
    selectedPhoto,
    setPopupVisible,
    selectedFileId,
  } = useFileContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editFileName.trim() || !selectedPhoto) {
      alert("Please fill in the file name and select a file.");
      return;
    }

    handleSave(e);
  };

  return (
    <div className="popup-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="file-name-input"
          value={editFileName}
          onChange={(e) => setEditFileName(e.target.value)}
          placeholder="File Name"
        />
        <input
          type="text"
          className="creator-input"
          value={editCreator}
          onChange={(e) => setEditCreator(e.target.value)}
          placeholder="Creator"
        />
        <input type="file" onChange={handleFileChange} />
        {selectedPhoto && (
          <img src={selectedPhoto} alt="Selected" className="selected-photo" />
        )}
        <button type="submit">
          {selectedFileId !== null ? "Update" : "Save"}
        </button>
        <button type="button" onClick={() => setPopupVisible(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PopupForm;
