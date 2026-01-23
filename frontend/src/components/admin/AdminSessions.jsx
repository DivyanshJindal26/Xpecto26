"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/sessions`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSession = async (sessionData) => {
    // ...existing code for creating a session
  };

  const handleUpdateSession = async (sessionId, sessionData) => {
    // ...existing code for updating a session
  };

  const handleDeleteSession = async (sessionId) => {
    // ...existing code for deleting a session
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Admin Sessions</h1>
        <button
          onClick={() => {
            setModalMode("create");
            setSelectedSession(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
        >
          <IconPlus className="w-5 h-5" />
          Add Session
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <IconLoader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <AnimatePresence>
          {sessions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <p className="text-gray-500">No sessions found.</p>
            </motion.div>
          ) : (
            sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md p-4 mb-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{session.title}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setModalMode("edit");
                        setSelectedSession(session);
                        setShowModal(true);
                      }}
                      className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{session.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(session.date).toLocaleString()}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "-100vh" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {modalMode === "create" ? "Create Session" : "Edit Session"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal content for creating/editing session */}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Call create or update function based on modalMode
                    if (modalMode === "create") {
                      handleCreateSession();
                    } else {
                      handleUpdateSession(selectedSession.id);
                    }
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                >
                  {modalMode === "create" ? (
                    <>Create Session</>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4" />
                      Update Session
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
