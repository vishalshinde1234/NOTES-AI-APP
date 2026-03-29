import { useState, useEffect, useRef, useCallback } from 'react'
import { Pin, PinOff, Sparkles } from 'lucide-react'
import api from '../api/axios'
import AIModal from './AIModal'

export default function Editor({ note, onUpdate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title || '')
      setContent(note.content || '')
    }
  }, [note?._id])

  const autoSave = useCallback((newTitle, newContent) => {
    if (!note) return
    clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(async () => {
      await onUpdate(note._id, { title: newTitle, content: newContent })
      setSaving(false)
    }, 1000)
  }, [note, onUpdate])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    autoSave(e.target.value, content)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
    autoSave(title, e.target.value)
  }

  const togglePin = () => {
    if (note) onUpdate(note._id, { isPinned: !note.isPinned })
  }

  const applyAIContent = (aiContent) => {
    setContent(aiContent)
    autoSave(title, aiContent)
    setShowAI(false)
  }

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-slate-300 font-medium mb-1">No note selected</h3>
          <p className="text-slate-500 text-sm">Select a note or create a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-slate-800 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePin}
            className={`p-1.5 rounded-md transition-all ${
              note.isPinned
                ? 'text-indigo-400 bg-indigo-600/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {note.isPinned ? <Pin size={15} /> : <PinOff size={15} />}
          </button>
          <span className="text-slate-600 text-xs">
            {saving ? 'Saving...' : 'Saved'}
          </span>
        </div>
        <button
          onClick={() => setShowAI(true)}
          className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 px-3 py-1.5 rounded-lg text-sm transition-all"
        >
          <Sparkles size={14} />
          AI Assist
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 py-6 max-w-4xl w-full mx-auto">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-700 focus:outline-none mb-6 border-none"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your note..."
          className="w-full bg-transparent text-slate-300 placeholder-slate-700 focus:outline-none resize-none leading-relaxed text-base min-h-96"
          style={{ minHeight: 'calc(100vh - 260px)' }}
        />
      </div>

      {/* AI Modal */}
      {showAI && (
        <AIModal
          note={note}
          onApply={applyAIContent}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  )
}