import { Search, Plus, Trash2, Pin } from 'lucide-react'

export default function NotesList({
  notes, loading, search, setSearch,
  selectedNote, setSelectedNote,
  onNewNote, onDelete, visible
}) {
  if (!visible) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-sm">Notes</h2>
          <button
            onClick={onNewNote}
            className="w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center justify-center transition-colors"
          >
            <Plus size={14} className="text-white" />
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-slate-500 text-sm">No notes yet</p>
            <button onClick={onNewNote} className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors">
              Create your first note
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notes.map((note) => (
              <div
                key={note._id}
                onClick={() => setSelectedNote(note)}
                className={`group p-3 rounded-lg cursor-pointer transition-all ${
                  selectedNote?._id === note._id
                    ? 'bg-indigo-600/20 border border-indigo-500/30'
                    : 'hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {note.isPinned && <Pin size={10} className="text-indigo-400 flex-shrink-0" />}
                      <p className="text-sm font-medium text-white truncate">{note.title || 'Untitled'}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {note.content?.replace(/<[^>]*>/g, '') || 'No content'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{formatDate(note.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(note._id) }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <p className="text-slate-600 text-xs text-center">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}