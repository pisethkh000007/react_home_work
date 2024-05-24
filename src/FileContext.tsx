import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  FormEvent,
  ChangeEvent,
  DragEvent,
} from "react";
import { format } from "date-fns";
import pic5 from "../src/assets/images/plusicon.png";
import pic6 from "../src/assets/images/pdf.png";
import pic7 from "../src/assets/images/rotate.png";

interface File {
  id: number;
  fileIcon: string;
  fileName: string;
  creator: string;
  date: string;
  photo: string | null;
}

interface FileContextProps {
  files: File[];
  currentDate: string;
  selectedPhoto: string | null;
  selectedFileId: number | null;
  popupVisible: boolean;
  selectedIcon: string;
  editFileName: string;
  editCreator: string;
  searchTerm: string;
  showDeletePopup: boolean;
  handleSave: (e: FormEvent) => void;
  handleDelete: (id: number) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDoubleClick: (id: number) => void;
  setPopupVisible: (visible: boolean) => void;
  setSelectedFileId: (id: number | null) => void;
  handleSearchInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDragStart: (e: DragEvent, id: number) => void;
  handleDragOver: (e: DragEvent) => void;
  handleDrop: (e: DragEvent, id: number) => void;
  handleDragEnd: () => void;
  setEditFileName: (name: string) => void;
  setEditCreator: (creator: string) => void;
}

const FileContext = createContext<FileContextProps | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "MM/dd/yyyy")
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(pic5);
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
      setSelectedIcon(pic5);
    }
  }, [selectedFileId, files]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newFile: File = {
      id: idCounter,
      fileIcon: pic6,
      fileName: editFileName,
      creator: editCreator,
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
    setSelectedPhoto(null);
    setPopupVisible(false);
    setSelectedIcon(pic5);
    setEditFileName("");
    setEditCreator("");
    const popupToggle = document.getElementById(
      "popup-toggle"
    ) as HTMLInputElement;
    if (popupToggle) popupToggle.checked = false;
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
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
    setSelectedIcon(pic7);
    setSelectedFileId(id);
    setPopupVisible(true);
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSelectedFileId(null);
    };

    document.body.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDragStart = (e: DragEvent, id: number) => {
    setDraggedFileId(id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent, id: number) => {
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
    <FileContext.Provider
      value={{
        files,
        currentDate,
        selectedPhoto,
        selectedFileId,
        popupVisible,
        selectedIcon,
        editFileName,
        editCreator,
        searchTerm,
        showDeletePopup,
        handleSave,
        handleDelete,
        confirmDelete,
        cancelDelete,
        handleFileChange,
        handleDoubleClick,
        setPopupVisible,
        setSelectedFileId,
        handleSearchInputChange,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        setEditFileName,
        setEditCreator,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextProps => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};

export default FileContext;
