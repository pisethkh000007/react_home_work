// Test.tsx
import React from "react";
import Header from "./Header";
import Title from "./Title";
import FileCard from "./FileCard";
import PopupForm from "./PopupForm";
import DeletePopup from "./DeletePopup";
import { FileProvider, useFileContext } from "./FileContext";
import pic5 from "../src/assets/images/plusicon.png";

const Test: React.FC = () => {
  const {
    files,
    searchTerm,
    handleSearchInputChange,
    popupVisible,
    selectedIcon,
    setPopupVisible,
  } = useFileContext();

  return (
    <div>
      <Header />
      <Title />
      {files
        .filter((file) =>
          file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      <input type="checkbox" id="popup-toggle" style={{ display: "none" }} />
      {popupVisible && <PopupForm />}
      <DeletePopup />
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
};

const MainApp: React.FC = () => (
  <FileProvider>
    <Test />
  </FileProvider>
);

export default MainApp;
