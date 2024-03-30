import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCheck,
  faTrash,
  faSignOutAlt,
  faAdjust,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import noNotesImage from "../../public/empty.png";
import { useAuth } from "../context/AuthContext";
import {
  unarchiveNote,
  deleteNote,
  getArchivedNotes,
} from "../utils/network-data";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import PropTypes from "prop-types";

const Archive = () => {
  const { user, logoutUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const { toggleLanguage, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm("");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#ffffff" : "#222222";
  }, [theme]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!user && !accessToken) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchArchivedNotes = async () => {
      try {
        setIsLoading(true);
        const { error, data } = await getArchivedNotes();
        if (!error) {
          setArchivedNotes(data);
        } else {
          console.error("Failed to fetch archived notes");
        }
      } catch (error) {
        console.error("Failed to fetch archived notes", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedNotes();
  }, []);

  const handleUnarchive = async (noteId) => {
    try {
      setIsLoading(true);
      const unarchiveNoteResponse = await unarchiveNote(noteId);
      if (!unarchiveNoteResponse.error) {
        setArchivedNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== noteId)
        );
        setShowModal(false);
      } else {
        console.error("Failed to unarchive note");
      }
    } catch (error) {
      console.error("Failed to unarchive note", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleDeleteArchive = async (noteId) => {
    try {
      setIsLoading(true);
      await deleteNote(noteId);
      setArchivedNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== noteId)
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete archived note", error);
    } finally {
      setIsLoading(false);
    }
  };

  const archivedFilter = archivedNotes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {isLoading && <div className="loading-indicator">Loading...</div>}
      <Link to="/" className="back-button-form">
        <FontAwesomeIcon icon={faHome} />{" "}
        {language === "id" ? "Kembali" : "Back"}
      </Link>
      <div className="icon-row">
        <div className="theme-icon" onClick={toggleTheme}>
          <FontAwesomeIcon icon={faAdjust} />
        </div>
        <div className="language-icon" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faLanguage} />
        </div>
        <div className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
      </div>
      <header>
        <h1 style={{ textAlign: "center" }}>
          {language === "id" ? "Data Arsip" : "Archive Data"}
        </h1>
      </header>
      <section className="content">
        <div
          className="search-container"
          style={{ backgroundColor: theme === "light" ? "#ffffff" : "#222222" }}
        >
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={`${
              language === "id" ? "Cari Catatan" : "Search Note"
            }`}
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#222222",
              color: theme === "light" ? "#000000" : "#ffffff",
            }}
          />
        </div>

        <div className="container">
          {archivedFilter.length === 0 ? (
            <img src={noNotesImage} alt="No Notes" className="no-notes-image" />
          ) : (
            <div className="note-cards">
              {archivedFilter.map((note) => (
                <div
                  className="note-card"
                  key={note.id}
                  style={{
                    backgroundColor: theme === "light" ? "#ffffff" : "#222222",
                  }}
                >
                  <Link to={`/note/${note.id}`}>
                    <h3>{note.title}</h3>
                  </Link>
                  <p>{new Date(note.createdAt).toLocaleString()}</p>
                  <p>{note.body}</p>
                  <div className="actions">
                    <button
                      className="archive-button"
                      onClick={() => {
                        setModalContent({
                          type: "activate",
                          noteId: note.id,
                          message: "Anda yakin ingin mengaktifkan catatan ini?",
                        });
                        setShowModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        setModalContent({
                          type: "delete",
                          noteId: note.id,
                        });
                        setShowModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {showModal && (
          <Modal
            content={modalContent}
            onClose={() => setShowModal(false)}
            onDeleteNote={handleDeleteArchive}
            onUnarchive={handleUnarchive}
          />
        )}
      </section>
    </div>
  );
};

Archive.propTypes = {
  setArchivedNotes: PropTypes.func.isRequired,
};

export default Archive;
