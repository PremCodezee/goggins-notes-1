"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Loader2, Search, Edit, Calendar, FileText, Users, Plus, Menu, X, ArrowLeft, Check, LogOut, } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  is_deleted: boolean;
};

type Profile = {
  name: string;
  notesCreated: number;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface NavbarProps {
  profile: Profile | null;
  notesCount: number;
  activeView: "notes" | "groups";
  setActiveView: (view: "notes" | "groups") => void;
  onCreateNote: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void; // Add this new prop
}

const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeView,
  setActiveView,
  onCreateNote,
  searchQuery,
  setSearchQuery,
  notesCount,
  onLogout, // Make sure to use the onLogout prop from Dashboard
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r ml-3 from-blue-600 to-indigo-600 bg-clip-text text-transparent">Goggins NoteBook</span>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <button
                onClick={() => setActiveView("notes")}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeView === "notes"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </button>
              <Link href="/groupnotes">
                <button
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeView === "groups"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Groups
                </button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              />
            </div>
            <button
              onClick={onCreateNote}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </button>
            <Link href="/profileinnotes" className="flex flex-col items-start">
              <div className="ml-3 relative flex items-center p-1 pl-3 pr-4 rounded-lg bg-gray-50 border border-gray-300">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700 ">
                    {profile?.name + "_Goggins" || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {notesCount || 0} notes
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - improved for usability */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {/* Search bar moved to the top of mobile menu */}
            <div className="relative mb-3 mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              />
            </div>

            {/* Navigation items */}
            <button
              onClick={() => {
                setActiveView("notes");
                setIsMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-base font-medium rounded-lg ${activeView === "notes"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              Notes
            </button>
            <Link href="/groupnotes" className="block w-full">
              <button
                className={`flex items-center w-full px-4 py-3 text-base font-medium rounded-lg ${activeView === "groups"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Groups
              </button>
            </Link>
          </div>
          
          <div className="pt-2 pb-3 border-t border-gray-200 px-4">


            <Link href="/profileinnotes" className="flex flex-col items-start bg-gray-50 border border-gray-300 rounded-lg">
            <div className="flex items-center py-2">
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-700 ml-4">
                  {profile?.name + "_Goggins" || "User"}
                </span>
                <span className="text-sm text-gray-500 ml-4">
                  {notesCount || 0} notes
                </span>
              </div>
            </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  isFullWidth: boolean;
  toggleWidth: () => void;
  setFullPageNote: (note: Note | null) => void; // New prop for setting full-page note
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  isFullWidth,
  setFullPageNote
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="rounded-lg border border-gray-300 bg-white hover:shadow-lg transition-shadow duration-200 
    flex flex-col p-4 w-full h-auto"
    >
      {note.title && (
        <div className="mb-2">
          <h3
            className={`text-base font-medium text-gray-800 ${expanded ? "" : "line-clamp-1"
              } cursor-pointer`}
            onClick={() => setFullPageNote(note)}
          >
            {note.title}
          </h3>
        </div>
      )}

      <div
        className={`text-gray-700 text-sm whitespace-pre-line break-words ${expanded ? "line-clamp-none" : "line-clamp-6"
          } cursor-pointer mb-2`}
        onClick={() => setFullPageNote(note)}
      >
        {note.content}
      </div>

      <div className="flex justify-between items-center mt-auto pt-2 text-xs text-gray-400">
        <div className="flex items-center">
          <Calendar size={12} className="mr-1" />
          {formatDate(note.createdAt)}
        </div>
      </div>
    </div>
  );
};

// Now, let's create a new FullPageNote component
interface FullPageNoteProps {
  note: Note;
  onClose: () => void;
  onSave: (noteId: string, title: string, content: string) => void; // Modified to handle both create and edit
  onDelete?: (id: string) => void; // Optional for create mode
  isCreateMode?: boolean; // New prop to distinguish between create and edit modes
}

const FullPageNote: React.FC<FullPageNoteProps> = ({ 
  note, 
  onClose, 
  onSave, 
  onDelete, 
  isCreateMode = false 
}) => {
  const [isEditing, setIsEditing] = useState(isCreateMode ? true : false);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Reset states when note changes
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
    setHasChanges(false);
    setIsEditing(isCreateMode ? true : false);
  }, [note, isCreateMode]);

  useEffect(() => {
    // Focus on title input when entering edit mode or in create mode
    if ((isEditing || isCreateMode) && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing, isCreateMode]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (contentTextareaRef.current) {
      contentTextareaRef.current.style.height = "auto";
      contentTextareaRef.current.style.height = contentTextareaRef.current.scrollHeight + "px";
    }
  }, [content, isEditing]);

  // Check for unsaved changes
  useEffect(() => {
    if (isCreateMode) {
      setHasChanges(title.trim() !== "" || content.trim() !== "");
    } else if (note) {
      setHasChanges(title !== note.title || content !== note.content);
    }
  }, [title, content, note, isCreateMode]);

  const handleSave = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
  
    try {
      setIsSaving(true);
      // If in create mode or note is null, call onSave without noteId
      if (isCreateMode || !note) {
        await onSave(note._id, title, content);
      } else {
        await onSave(note._id, title, content);
      }
      
      if (!isCreateMode) {
        setIsEditing(false);
      }
      
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setIsSaving(false);
    }
  }, [title, content, note, onSave, isCreateMode]);

  const handleClose = () => {
    if (hasChanges) {
      // Could add a confirmation dialog here
      if (window.confirm("You have unsaved changes. Save before closing?")) {
        handleSave();
      }
    }
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not saved yet";
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to cancel editing or close the note
      if (e.key === 'Escape') {
        if (isEditing && !isCreateMode) {
          if (hasChanges) {
            if (window.confirm("Discard changes?")) {
              if (note) {
                setTitle(note.title);
                setContent(note.content);
              }
              setIsEditing(false);
            }
          } else {
            setIsEditing(false);
          }
        } else {
          onClose();
        }
      }

      // Ctrl+Enter or Cmd+Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && (isEditing || isCreateMode)) {
        handleSave();
      }

      // E key to edit when not already editing and not in create mode
      if (e.key === 'e' && !isEditing && !isCreateMode &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)) {
        setIsEditing(true);
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Prevent scrolling of background content
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isEditing, hasChanges, note, onClose, handleSave, isCreateMode]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col animate-in zoom-in-50 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center flex-1">
            <button
              onClick={handleClose}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Close full view"
            >
              <ArrowLeft size={20} />
            </button>

            {(isEditing || isCreateMode) ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold text-gray-800 w-full border-b border-blue-400 focus:outline-none focus:border-blue-600 px-2 py-1"
                placeholder="Note title"
              />
            ) : (
              <h2
                className="text-xl font-semibold text-gray-800 cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {title}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(isEditing || isCreateMode) ? (
              <>
                {!isCreateMode && (
                  <button
                    onClick={() => {
                      if (note) {
                        setTitle(note.title);
                        setContent(note.content);
                      }
                      setIsEditing(false);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    aria-label="Cancel editing"
                    disabled={isSaving}
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className={`p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center ${isSaving ? 'opacity-75' : ''}`}
                  aria-label={isCreateMode ? "Create note" : "Save note"}
                  disabled={isSaving || !title.trim() || !content.trim()}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  aria-label="Edit note"
                >
                  <Edit size={18} />
                </button>
                {onDelete && note && (
                  <button
                    onClick={() => {
                      onDelete(note._id);
                      onClose();
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    aria-label="Delete note"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {(isEditing || isCreateMode) ? (
            <textarea
              ref={contentTextareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none border-none focus:outline-none focus:ring-0 text-gray-800 text-lg leading-relaxed"
              placeholder="Note content"
            />
          ) : (
            <div
              className="whitespace-pre-wrap font-sans text-gray-800 text-lg leading-relaxed cursor-text"
              onClick={() => setIsEditing(true)}
            >
              {content}
            </div>
          )}
        </div>

        <div className="p-4 border-t text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            {isCreateMode ? "New note" : `Last edited: ${formatDate(note?.createdAt)}`}
          </div>

          {(isEditing || isCreateMode) && (
            <div className="text-xs text-gray-400">
              Press Ctrl+Enter to save • Esc to {isCreateMode ? "close" : "cancel"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeView, setActiveView] = useState<"notes" | "groups">("notes");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [showFab, setShowFab] = useState(false);
  const [fullPageNote, setFullPageNote] = useState<Note | null>(null);
  // Add new state for full-page create mode
  const [isFullPageCreate, setIsFullPageCreate] = useState(false);
  // Add new state for logout confirmation
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Show FAB after initial load, and only on small screens
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        setShowFab(true);
      }
    }, 1000);

    const handleResize = () => {
      setShowFab(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleGetProfile = async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/auth/notes", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data.filter((note: Note) => !note.is_deleted));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
    handleGetProfile();
  }, []);

  // Unified handler for both create and edit
  const handleSaveNote = async (noteId: string, title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      // If noteId is provided, it's an edit operation
      if (noteId) {
        const res = await fetch("/api/auth/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ noteId, title, content }),
        });

        if (!res.ok) throw new Error("Failed to update note");

        // Update the notes state
        setNotes(
          notes.map((n) =>
            n._id === noteId ? { ...n, title, content } : n
          )
        );

        // If this was triggered from the modal, close it
        if (selectedNote && selectedNote._id === noteId) {
          setIsEditModalOpen(false);
        }

        // If this was triggered from full-page view, update the fullPageNote
        if (fullPageNote && fullPageNote._id === noteId) {
          setFullPageNote({ ...fullPageNote, title, content });
        }
      } 
      // Otherwise it's a create operation
      else {
        setIsCreating(true);
        const res = await fetch("/api/auth/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
          credentials: "include",
        });
        
        if (!res.ok) throw new Error("Failed to create note");
        
        const data = await res.json();
        setNotes([data.note, ...notes]);
        
        // Close whatever create UI was open
        setIsCreateModalOpen(false);
        setIsFullPageCreate(false);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      setIsCreating(false);
    }
  };

  // Add new function to handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to logout");
      toast.success("Logged out successfully!");
      router.push("/login");

      // The API will handle redirecting to the login page
      // No need to do anything else here as the redirect happens server-side
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch("/api/auth/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ noteId, is_deleted: true }),
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes(notes.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNoteWidth = (noteId: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modified function to handle create note button click
  const handleCreateNoteClick = () => {
    // Open the full-page create interface instead of the modal
    setIsFullPageCreate(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        profile={profile}
        activeView={activeView}
        setActiveView={setActiveView}
        onCreateNote={handleCreateNoteClick} // Modified to use our new function
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notesCount={notes.length}
        onLogout={() => setIsLogoutDialogOpen(true)} // Add new prop to trigger logout dialog
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={(note) => {
                  setSelectedNote(note);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDeleteNote}
                isFullWidth={!!expandedNotes[note._id]}
                toggleWidth={() => toggleNoteWidth(note._id)}
                setFullPageNote={setFullPageNote}
              />
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-center py-16 col-span-full bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No notes found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery
                      ? `No notes matching "${searchQuery}"`
                      : "Create your first note to get started"}
                  </p>
                  <button
                    onClick={handleCreateNoteClick}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {searchQuery ? "Create new note" : "Create your first note"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showFab && (
        <button
          onClick={handleCreateNoteClick}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center md:hidden z-20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all"
          aria-label="Create new note"
        >
          <Plus size={24} />
        </button>
      )}

      {/* We keep the modal for backward compatibility, but we could remove it */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Note"
      >
        <NoteForm
          onSubmit={(title, content) => handleSaveNote("", title, content)}
          submitButtonText="Create Note"
          isSubmitting={isCreating}
        />
      </Modal>

      {/* Modal for editing notes (when not using full-page) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Note"
      >
        <NoteForm
          note={selectedNote}
          onSubmit={(title, content) => {
            if (selectedNote) {
              handleSaveNote(selectedNote._id, title, content);
            }
          }}
          submitButtonText="Save Changes"
        />
      </Modal>

      {/* Logout confirmation dialog */}
      <Modal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        title="Confirm Logout"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsLogoutDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>

      {/* Add the FullPageNote component when a note is selected for viewing/editing */}
      {fullPageNote && (
        <FullPageNote
          note={fullPageNote}
          onClose={() => setFullPageNote(null)}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
        />
      )}

      {/* Add the FullPageNote component for note creation */}
      {isFullPageCreate && (
        <FullPageNote
          onClose={() => setIsFullPageCreate(false)}
          onSave={handleSaveNote}
          isCreateMode={true} note={{
            _id: "",
            title: "",
            content: "",
            createdAt: new Date().toISOString(),
            is_deleted: false
          }}
          />
      )}
    </div>
  );
};

const NoteForm: React.FC<{
  note?: Note | null;
  onSubmit: (title: string, content: string) => void;
  submitButtonText: string;
  isSubmitting?: boolean;
}> = ({ note, onSubmit, submitButtonText, isSubmitting }) => {
  const [localTitle, setLocalTitle] = useState(note?.title || "");
  const [localContent, setLocalContent] = useState(note?.content || "");
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });
  const [touched, setTouched] = useState({
    title: false,
    content: false,
  });

  useEffect(() => {
    setLocalTitle(note?.title || "");
    setLocalContent(note?.content || "");
    setErrors({ title: "", content: "" });
    setTouched({ title: false, content: false });
  }, [note]);

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return "";
  };

  const handleBlur = (field: "title" | "content") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(
        field,
        field === "title" ? localTitle : localContent
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleError = validateField("title", localTitle);
    const contentError = validateField("content", localContent);

    setErrors({
      title: titleError,
      content: contentError,
    });

    setTouched({
      title: true,
      content: true,
    });

    if (!titleError && !contentError) {
      onSubmit(localTitle, localContent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={localTitle}
          onChange={(e) => {
            setLocalTitle(e.target.value);
            if (touched.title) {
              setErrors((prev) => ({
                ...prev,
                title: validateField("title", e.target.value),
              }));
            }
          }}
          onBlur={() => handleBlur("title")}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
              ${errors.title && touched.title
              ? "border-red-400 bg-red-50"
              : "border-gray-200"
            }`}
          placeholder="Enter note title..."
        />
        {errors.title && touched.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          value={localContent}
          onChange={(e) => {
            setLocalContent(e.target.value);
            if (touched.content) {
              setErrors((prev) => ({
                ...prev,
                content: validateField("content", e.target.value),
              }));
            }
          }}
          onBlur={() => handleBlur("content")}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 text-base resize-none transition-all
              ${errors.content && touched.content
              ? "border-red-400 bg-red-50"
              : "border-gray-200"
            }`}
          placeholder="Enter note content..."
        />
        {errors.content && touched.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={
          isSubmitting ||
          (touched.title &&
            touched.content &&
            (!!errors.title || !!errors.content))
        }
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-3 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base font-medium transition-all"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {submitButtonText}
      </button>
    </form>
  );
};

export default Dashboard;