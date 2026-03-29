import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import NotesList from '../components/NotesList'
import Editor from '../components/Editor'
import AIPanel from '../components/AIPanel'

export default function Dashboard() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [activePanel, setActivePanel] = useState('notes')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get('/notes', { params: { search } })
      setNotes(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const createNote = async () => {
    try {
      const res = await api.post('/notes', { title: 'Untitled Note', content: '' })
      setNotes((prev) => [res.data.note, ...prev])
      setSelectedNote(res.data.note)
      setActivePanel('notes')
    } catch (err) {
      console.error(err)
    }
  }

  const updateNote = async (id, data) => {
    try {
      const res = await api.patch(`/notes/${id}`, data)
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data.note : n)))
      setSelectedNote(res.data.note)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
      setNotes((prev) => prev.filter((n) => n._id !== id))
      if (selectedNote?._id === id) setSelectedNote(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        user={user}
        onNewNote={createNote}
      />

      {/* Notes List */}
      <NotesList
        notes={notes}
        loading={loading}
        search={search}
        setSearch={setSearch}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        onNewNote={createNote}
        onDelete={deleteNote}
        visible={activePanel === 'notes'}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activePanel === 'notes' && (
          <Editor
            note={selectedNote}
            onUpdate={updateNote}
          />
        )}
        {activePanel === 'ai' && (
          <AIPanel
            note={selectedNote}
            onApply={(content) => {
              if (selectedNote) {
                updateNote(selectedNote._id, { content })
              }
            }}
          />
        )}
      </div>
    </div>
  )
}