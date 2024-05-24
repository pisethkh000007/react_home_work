import React from "react";
import pic from "../src/assets/images/chromelogo.png";
import pic2 from "../src/assets/images/search-icon.webp";
import pic3 from "../src/assets/images/doticon.png";
import { useFileContext } from "./FileContext";

const Header: React.FC = () => {
  const { searchTerm, handleSearchInputChange, handleDelete, files } =
    useFileContext();

  return (
    <div className="header">
      <div className="header-left-container">
        <img className="logo" src={pic} alt="Chrome Logo" />
        <h1 className="download-text">Downloads</h1>
      </div>
      <div className="header-center-container">
        <div className="header-search">
          <img className="search-icon" src={pic2} alt="Search Icon" />
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
          onClick={() => handleDelete(files[0]?.id ?? 0)}
        >
          <img className="dot-icon" src={pic3} alt="Dot Icon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
