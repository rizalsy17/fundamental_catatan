import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faAdjust,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUserLogged } from "../utils/network-data";

const AddNoteForm = ({ onAddNote }) => {
  const { user, logoutUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const { toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState({ title: "", body: "" });
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#ffffff" : "#222222";
  }, [theme]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!user && !accessToken) {
      // Jika pengguna belum login, arahkan kembali ke halaman login
      navigate("/login"); // Gunakan navigate untuk mengarahkan ke halaman login
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { error, data } = await getUserLogged();
        if (!error) {
          setName(data.name);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newCharCount = value.length;
    if (name === "title" && newCharCount > 50) {
      return;
    }
    setNewNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));

    if (name === "title") {
      setCharCount(newCharCount);
    }
  };

  const handleAddNote = async () => {
    try {
      setIsLoading(true); // Atur isLoading ke true saat memulai pengambilan data
      if (!newNote.body.trim()) {
        alert("Isi catatan tidak boleh kosong!");
        return;
      }
      await onAddNote(newNote);
      setNewNote({ title: "", body: "" });
      navigate("/");
    } catch (error) {
      alert("Gagal menambah catatan");
    } finally {
      setIsLoading(false); // Atur isLoading kembali ke false setelah selesai
    }
  };
  

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="container">
       {isLoading && <div className="loading-indicator">Loading...</div>}
      <div className="icon-row">
        <div className="theme-icon" onClick={toggleTheme}>
          <FontAwesomeIcon icon={faAdjust} />
        </div>
        <div className="language-icon" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faLanguage} />
        </div>
        <div className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {name && <span style={{ marginLeft: '5px' }}>{name}</span>}
        </div>
      </div>

      <div className="center-container">
        <div
          className="add-note-form-container"
          style={{ backgroundColor: theme === "light" ? "#ffffff" : "#222222" }}
        >
          <Link to="/" className="back-button-form">
            <FontAwesomeIcon icon={faHome} />{" "}
            {language === "id" ? "Kembali" : "Back"}
          </Link>
          <h2>{language === "id" ? "Tambah Catatan Baru" : "Add New Note"}</h2>
          <form>
            <label htmlFor="title">
              {language === "id" ? "Judul" : "Title"}:
            </label>
            <div className="input-container">
              <input
                type="text"
                id="title"
                name="title"
                value={newNote.title}
                onChange={handleInputChange}
              />
              <p className="char-count">{`(${charCount}/50)`}</p>
            </div>
            <label htmlFor="noteContent">
              {language === "id" ? "Isi Catatan" : "Fill Note"}
            </label>
            <textarea
              id="body"
              name="body"
              value={newNote.body}
              onChange={handleInputChange}
            ></textarea>
            <button type="button" onClick={handleAddNote}>
              {language === "id" ? "Tambah Catatan" : "Add Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

AddNoteForm.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};

export default AddNoteForm;
