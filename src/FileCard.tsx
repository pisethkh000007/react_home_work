import React from "react";
import { useFileContext } from "./FileContext";
import pic3 from "../src/assets/images/doticon.png";
import deleteIcon from "../src/assets/images/delete-icon.png";
import stye from "./index.css";

interface FileCardProps {
  file: {
    id: number;
    fileIcon: string;
    fileName: string;
    creator: string;
    date: string;
    photo: string | null;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const {
    selectedFileId,
    handleDoubleClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleDelete,
  } = useFileContext();

  return (
    <div
      key={file.id}
      className={`file-card ${selectedFileId === file.id ? "selected" : ""}`}
      onDoubleClick={() => handleDoubleClick(file.id)}
      draggable
      onDragStart={(e) => handleDragStart(e, file.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, file.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="file-header">
        {file.photo && <img className="file-photo" src={file.photo} alt="" />}
        <div className="file-info">
          <span className="file-name">{file.fileName}</span>
          <span className="creator">{file.creator}</span>
        </div>
        <div className="file-options">
          <img
            className="dot-icon"
            src={pic3}
            alt=""
            onClick={() => handleDelete(file.id)}
          />
        </div>
      </div>
      <div className="file-footer">
        <span className="file-date">{file.date}</span>
      </div>
    </div>
  );
};

export default FileCard;
