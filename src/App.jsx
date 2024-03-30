import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoteDetail from "./components/NoteDetail";
import AddNoteForm from "./components/AddNoteForm";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Modal from "./components/Modal";
import {
  addNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
  getActiveNotes,
  getArchivedNotes,
} from "./utils/network-data";
const App = () => {
  const { user, login } = useAuth();
  const [allNotes, setAllNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const activeNotesResponse = await getActiveNotes();
      const archivedNotesResponse = await getArchivedNotes();
      if (!activeNotesResponse.error && !archivedNotesResponse.error) {
        setAllNotes(activeNotesResponse.data);
        setArchivedNotes(archivedNotesResponse.data);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (newNote) => {
    try {
      const addNoteResponse = await addNote(newNote);
      if (!addNoteResponse.error) {
        fetchNotes();
      } else {
        console.error("Failed to add note");
      }
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const deleteNoteResponse = await deleteNote(noteId);
      if (!deleteNoteResponse.error) {
        fetchNotes();
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      const archiveNoteResponse = await archiveNote(noteId);
      if (!archiveNoteResponse.error) {
        fetchNotes();
      } else {
        console.error("Failed to archive note");
      }
    } catch (error) {
      console.error("Failed to archive note", error);
    }
  };

  const handleUnarchive = async (noteId) => {
    try {
      const unarchiveNoteResponse = await unarchiveNote(noteId);
      if (!unarchiveNoteResponse.error) {
        fetchNotes();
      } else {
        console.error("Failed to unarchive note");
      }
    } catch (error) {
      console.error("Failed to unarchive note", error);
    }
  };

  return (
    <div>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<Login onLogin={login} />} />
              <Route
                path="/register"
                element={<Register onRegister={login} />}
              />
              <Route
                path="/"
                element={
                  <Home
                    notes={allNotes}
                    setAllNotes={setAllNotes}
                    archivedNotes={archivedNotes}
                    onDelete={handleDeleteNote}
                    onArchive={handleArchive}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modalContent={modalContent}
                    setModalContent={setModalContent}
                  />
                }
              />
              <Route
                path="/archive"
                element={
                  <Archive
                    notes={archivedNotes}
                    setArchivedNotes={setArchivedNotes}
                    onUnarchive={handleUnarchive}
                    onDelete={handleDeleteNote}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modalContent={modalContent}
                    setModalContent={setModalContent}
                  />
                }
              />
              <Route
                path="/addnote"
                element={<AddNoteForm onAddNote={handleAddNote} />}
              />
              <Route
                path="/note/:id"
                element={<NoteDetail notes={allNotes} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
      {showModal && (
        <Modal
          content={modalContent}
          onDeleteNote={handleDeleteNote}
          onUnarchive={handleUnarchive}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default App;
