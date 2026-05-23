import { useState, useEffect } from "react";
import Notecontext from "./notecontext";

const Notestate = (props) => {
  const host = process.env.REACT_APP_BACKEND_URL;
  const [notes, setnotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSet = (key) => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch { return new Set(); }
  };
  const loadObj = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  };

  const [favoriteIds, setFavoriteIds] = useState(() => loadSet('inotebook_favorites'));
  const [archivedIds, setArchivedIds] = useState(() => loadSet('inotebook_archived'));
  const [trashedIds, setTrashedIds] = useState(() => loadSet('inotebook_trashed'));
  const [pinnedIds, setPinnedIds] = useState(() => loadSet('inotebook_pinned'));
  const [noteColors, setNoteColorsState] = useState(() => loadObj('inotebook_colors'));
  const [userData, setUserData] = useState({ name: 'iNotebook User', email: '', profileImage: '' });

  useEffect(() => { localStorage.setItem('inotebook_favorites', JSON.stringify([...favoriteIds])); }, [favoriteIds]);
  useEffect(() => { localStorage.setItem('inotebook_archived', JSON.stringify([...archivedIds])); }, [archivedIds]);
  useEffect(() => { localStorage.setItem('inotebook_trashed', JSON.stringify([...trashedIds])); }, [trashedIds]);
  useEffect(() => { localStorage.setItem('inotebook_pinned', JSON.stringify([...pinnedIds])); }, [pinnedIds]);
  useEffect(() => { localStorage.setItem('inotebook_colors', JSON.stringify(noteColors)); }, [noteColors]);

  useEffect(() => {
    const validIds = new Set(notes.map(n => n._id));
    setFavoriteIds(prev => {
      const cleaned = new Set([...prev].filter(id => validIds.has(id)));
      return cleaned.size === prev.size ? prev : cleaned;
    });
    setArchivedIds(prev => {
      const cleaned = new Set([...prev].filter(id => validIds.has(id)));
      return cleaned.size === prev.size ? prev : cleaned;
    });
    setTrashedIds(prev => {
      const cleaned = new Set([...prev].filter(id => validIds.has(id)));
      return cleaned.size === prev.size ? prev : cleaned;
    });
    setPinnedIds(prev => {
      const cleaned = new Set([...prev].filter(id => validIds.has(id)));
      return cleaned.size === prev.size ? prev : cleaned;
    });
    setNoteColorsState(prev => {
      const cleaned = Object.fromEntries(Object.entries(prev).filter(([id]) => validIds.has(id)));
      return Object.keys(cleaned).length === Object.keys(prev).length ? prev : cleaned;
    });
  }, [notes]);

  const getnotes = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
      });
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        setnotes(json.data);
        setLoading(false);
        return json.pagination;
      }
      setnotes([]);
      setLoading(false);
      return null;
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message);
      setnotes([]);
      setLoading(false);
      return null;
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(`${host}/api/auth/getuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
      });
      const json = await response.json();
      if (json.name) {
        setUserData(prev => ({ ...prev, name: json.name, email: json.email, profileImage: json.profileImage || '' }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user profile");
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const uploadRequest = async (method) => {
        const response = await fetch(`${host}/api/auth/uploadprofileimage`, {
          method,
          headers: {
            "auth-token": localStorage.getItem('token')
          },
          body: formData,
        });
        return response;
      };

      let response = await uploadRequest('POST');
      if (response.status === 404 || response.status === 405) {
        response = await uploadRequest('PUT');
      }

      const json = await response.json();
      if (json.success) {
        const updatedProfileImage = json.profileImage || json.user?.profileImage;
        if (updatedProfileImage) {
          await getUser();
        }
        setUserData(prev => ({
          ...prev,
          profileImage: updatedProfileImage || prev.profileImage,
          name: json.user?.name ?? prev.name,
          email: json.user?.email ?? prev.email
        }));
        return { success: true, profileImage: updatedProfileImage };
      }
      return { success: false, error: json.error || `Upload failed (${response.status})` };
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return { success: false, error: "Server error" };
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      const response = await fetch(`${host}/api/auth/updateuser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
        body: JSON.stringify({ profileImage: imageUrl }),
      });
      const json = await response.json();
      if (json.success) {
        setUserData(prev => ({ ...prev, profileImage: json.user.profileImage }));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { success: false };
    }
  };

  const updateUser = async (name, email) => {
    try {
      const response = await fetch(`${host}/api/auth/updateuser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
        body: JSON.stringify({ name, email }),
      });
      const json = await response.json();
      if (json.success) {
        setUserData(prev => ({ ...prev, name: json.user.name, email: json.user.email }));
        return { success: true };
      } else {
        const errorMsg = json.error || (json.errors ? json.errors[0].msg : "Update failed");
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: "Server error" };
    }
  };

  const addnote = async (title, description, tag, color = '', reminderDate = null) => {
    setError(null);
    try {
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
        body: JSON.stringify({ title, description, tag, reminderDate }),
      });
      const note = await response.json();
      if (response.ok) {
        setnotes(prev => [...prev, note]);
        if (color) setNoteColorsState(prev => ({ ...prev, [note._id]: color }));
      } else {
        setError(note.error || "Failed to add note");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Soft delete - moves to trash
  const deletenote = (id) => {
    setTrashedIds(prev => new Set([...prev, id]));
    setArchivedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  // Hard delete from backend + remove from all local state
  const permanentDelete = async (id) => {
    try {
      await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
      });
      setnotes(prev => prev.filter(n => n._id !== id));
      setTrashedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      setArchivedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      setPinnedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      setNoteColorsState(prev => { const c = { ...prev }; delete c[id]; return c; });
    } catch (err) {
      setError("Failed to delete note permanently");
    }
  };

  const restoreFromTrash = (id) => {
    setTrashedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  const editenote = async (id, title, description, tag, reminderDate = null, isReminderCompleted) => {
    try {
      const payload = { title, description, tag, reminderDate };
      if (isReminderCompleted !== undefined) {
        payload.isReminderCompleted = isReminderCompleted;
      }

      const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem('token') },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (response.ok) {
        const updatedNote = json.note || json;
        setnotes(prev => prev.map(n => n._id === id ? updatedNote : n));
      } else {
        setError(json.error || "Failed to update note");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFavorite = (id) => {
    setFavoriteIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const toggleArchive = (id) => {
    setArchivedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    setTrashedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  const togglePin = (id) => {
    setPinnedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const setNoteColor = (id, color) => {
    setNoteColorsState(prev => ({ ...prev, [id]: color }));
  };

  return (
    <Notecontext.Provider value={{
      notes, getnotes, addnote, deletenote, editenote,
      favoriteIds, archivedIds, trashedIds, pinnedIds, noteColors,
      userData, getUser, uploadProfileImage, updateProfileImage, updateUser,
      toggleFavorite, toggleArchive, togglePin, setNoteColor,
      restoreFromTrash, permanentDelete,
      loading, error,
    }}>
      {props.children}
    </Notecontext.Provider>
  );
};

export default Notestate;