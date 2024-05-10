import React, { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import "./App.css";
import pic from "../src/assets/images/chromelogo.png";
import pic2 from "../src/assets/images/search-icon.webp";
import pic3 from "../src/assets/images/doticon.png";
import pic4 from "../src/assets/images/building.jpg";
import pic5 from "../src/assets/images/plusicon.png";
import pic6 from "../src/assets/images/pdf.png";
import pic7 from "../src/assets/images/rotate.png"; // Add the new icon
import deleteIcon from "../src/assets/images/delete-icon.png";

interface File {
  id: number;
  fileName: string;
  creator: string;
  fileIcon: string;
  date: string;
  photo: string;
}

function Test() {
  const [files, setFiles] = useState<File[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "MM/dd/yyyy")
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null); // Track the selected file ID
  const [popupVisible, setPopupVisible] = useState(false); // Track the visibility of the popup form
  const [selectedIcon, setSelectedIcon] = useState(pic5); // Track the selected icon
  const [editFileName, setEditFileName] = useState("");
  const [editCreator, setEditCreator] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedFileId, setDraggedFileId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedFileId !== null) {
      const selectedFile = files.find((file) => file.id === selectedFileId);
      if (selectedFile) {
        setEditFileName(selectedFile.fileName);
        setEditCreator(selectedFile.creator);
        setSelectedPhoto(selectedFile.photo);
      }
    } else {
      setEditFileName("");
      setEditCreator("");
      setSelectedPhoto(null);
      setSelectedIcon(pic5); // Reset the icon to pic5 when deselecting
    }
  }, [selectedFileId, files]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fileNameInput =
      document.querySelector<HTMLInputElement>(".file-name-input");
    const creatorInput =
      document.querySelector<HTMLInputElement>(".creator-input");

    if (fileNameInput && creatorInput) {
      const newFile: File = {
        id: idCounter,
        fileIcon: pic6,
        fileName: fileNameInput.value,
        creator: creatorInput.value,
        date: currentDate,
        photo: selectedPhoto || "",
      };

      if (selectedFileId !== null) {
        const updatedFiles = files.map((file) =>
          file.id === selectedFileId ? newFile : file
        );
        setFiles(updatedFiles);
        setSelectedFileId(null);
      } else {
        setFiles([...files, newFile]);
      }
      setIdCounter(idCounter + 1);
      setCurrentDate(format(new Date(), "MM/dd/yyyy"));
      setSelectedPhoto(null); // Reset selected photo
      setPopupVisible(false); // Close the popup form
      setSelectedIcon(pic5); // Reset the selected icon
      // Clear input fields
      if (fileNameInput) {
        fileNameInput.value = "";
      }
      if (creatorInput) {
        creatorInput.value = "";
      }
      const popupToggle = document.getElementById(
        "popup-toggle"
      ) as HTMLInputElement;
      if (popupToggle) {
        popupToggle.checked = false;
      }
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      const updatedFiles = files.filter((file) => file.id !== deleteId);
      setFiles(updatedFiles);
      setDeleteId(null);
      setShowDeletePopup(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeletePopup(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Check if file size is greater than 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert("Please upload a file smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setSelectedPhoto(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDoubleClick = (id: number) => {
    setSelectedIcon(pic7); // Change the icon to pic7
    setSelectedFileId(id); // Set the selected file ID
    setPopupVisible(true); // Show the popup form
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSelectedFileId(null); // Deselect the file cards
    };

    document.body.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedFileId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    if (draggedFileId !== null) {
      const updatedFiles = [...files];
      const draggedIndex = files.findIndex((file) => file.id === draggedFileId);
      const droppedIndex = files.findIndex((file) => file.id === id);
      const draggedFile = updatedFiles[draggedIndex];
      updatedFiles.splice(draggedIndex, 1);
      updatedFiles.splice(droppedIndex, 0, draggedFile);
      setFiles(updatedFiles);
    }
  };

  const handleDragEnd = () => {
    setDraggedFileId(null);
  };

  return (
    <div>
      {/* Header content */}
      <div className="header">
        <div className="header-left-container">
          <img className="logo" src={pic} alt="" />
          <h1 className="download-text">Downloads</h1>
        </div>
        <div className="header-center-container">
          <div className="header-search">
            <img className="search-icon" src={pic2} alt="" />
            <input
              type="text"
              placeholder="Search downloads"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <div className="header-right-container">
          <div
            className="dot-icon-container"
            onClick={() => handleDelete(files[0]?.id)}
          >
            <img className="dot-icon" src={pic3} alt="" />
          </div>
        </div>
      </div>
      {/* Title container */}
      <div className="title-container">
        <span className="title">
          <img className="building-icon" src={pic4} alt="" />
          your <a href="#">profile is managed</a> by sabaicode
        </span>
      </div>
      {/* Today */}
      <div className="date">
        {isToday(new Date(currentDate)) ? "Today" : currentDate}
      </div>{" "}
      {/* Display "Today" if date is today */}
      {/* File cards */}
      {files
        .filter((file) =>
          file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((file) => (
          <div
            className={`card-container ${
              selectedFileId === file.id ? "selected" : ""
            }`}
            key={file.id}
            onClick={() => setSelectedFileId(file.id)}
            onDoubleClick={() => handleDoubleClick(file.id)} // Handle double-click event
            draggable={true} // Make the file card draggable
            onDragStart={(e) => handleDragStart(e, file.id)} // Handle drag start event
            onDragOver={(e) => handleDragOver(e)} // Handle drag over event
            onDrop={(e) => handleDrop(e, file.id)} // Handle drop event
            onDragEnd={handleDragEnd} // Handle drag end event
          >
            <div className="file-icon-left-container">
              <img
                className="file-icon"
                src={file.photo || selectedIcon}
                alt=""
              />
            </div>
            <div className="file-icon-center-container">
              <div className="file-icon-title">
                <a href={file.creator}>{file.fileName}</a>
              </div>
              <div className="file-icon-text">Creator: {file.creator}</div>
            </div>
            <div className="file-icon-right-container">
              <div className="file-icon-dot-icon-container">
                <img
                  className="dot-icon"
                  src={pic3}
                  alt=""
                  onClick={() => handleDelete(file.id)} // Handle delete event
                />
              </div>
              <img
                src={deleteIcon}
                alt="Delete"
                className="delete-icon"
                onClick={() => handleDelete(file.id)}
              />
            </div>
          </div>
        ))}
      {/* Popup form */}
      <input type="checkbox" id="popup-toggle" style={{ display: "none" }} />
      {popupVisible && (
        <div className="popup-form">
          <label htmlFor="popup-toggle">
            <img className="close-button" src="closebutton.jpg" alt="" />
          </label>
          <div className="popup-title">
            {selectedFileId !== null ? "Edit file" : "Add a file"}
          </div>
          <form onSubmit={handleSave}>
            <div className="file-name">
              <label>File name</label>
              <input
                className="file-name-input"
                type="text"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
              />
            </div>
            <div className="creator">
              <label>Creator</label>
              <input
                className="creator-input"
                type="text"
                value={editCreator}
                onChange={(e) => setEditCreator(e.target.value)}
              />
            </div>
            <div className="file-photo">
              <label>Photo</label>
              <input
                className="choose-photo"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ width: "747px" }}
              />
            </div>
            {/* Display selected photo */}
            {selectedPhoto && (
              <div className="selected-photo-container">
                <img
                  src={selectedPhoto}
                  alt="Selected"
                  className="selected-photo"
                />
              </div>
            )}
            <button className="save-button" type="submit">
              Save
            </button>
            <button
              className="cancel-button"
              type="button"
              onClick={() => setPopupVisible(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {/* Delete confirmation popup */}
      {showDeletePopup && (
        <div className="delete-popup">
          <div className="delete-popup-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this file?</p>
            <div className="delete-popup-buttons">
              <button
                onClick={confirmDelete}
                style={{ backgroundColor: "blue", color: "white" }}
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                style={{ backgroundColor: "red", color: "white" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Change the button image based on selected file */}
      <label htmlFor="popup-toggle" className="plus-label">
        <img
          className="plus-icon"
          src={selectedIcon}
          alt=""
          onClick={() => setPopupVisible(true)}
        />
      </label>
    </div>
  );
}

export default Test;
