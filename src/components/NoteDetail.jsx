import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSignOutAlt,
  faAdjust,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { getNote } from "../utils/network-data";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUserLogged } from "../utils/network-data";

const NoteDetail = () => {
  const { user, logoutUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const { toggleLanguage, language } = useLanguage();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNoteDetail();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#ffffff" : "#222222";
  }, [theme]);

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

  const fetchNoteDetail = async () => {
    try {
      const noteDetailResponse = await getNote(id);
      if (!noteDetailResponse.error) {
        setNote(noteDetailResponse.data);
      } else {
        console.error("Failed to fetch note detail");
      }
    } catch (error) {
      console.error("Failed to fetch note detail", error);
    }
  };

  if (!note) {
    return (
      <p>
        {language === "id" ? "Catatan tidak ditemukan" : "Record not found"}
      </p>
    );
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="container">
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
        <div className="note-detail-container">
          <Link to="/" className="back-button-form">
            <FontAwesomeIcon icon={faHome} />{" "}
            {language === "id" ? "Kembali" : "Back"}
          </Link>
          <h1 className="note-title">{note.title}</h1>
          <p className="note-meta">
            {new Date(note.createdAt).toLocaleString()}
          </p>
          <div
            className="note-detail"
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#222222",
            }}
          >
            <p>{note.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
