import { useState } from 'react'
import { X, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import api from '../api/axios'

const actions = [
  { id: 'summarize', label: 'Summarize', desc: 'Condense into key points' },
  { id: 'improve', label: 'Improve Writing', desc: 'Professional rewrite' },
  { id: 'bullets', label: 'Make Bullets', desc: 'Convert to bullet points' },
  { id: 'generate', label: 'Generate Note', desc: 'Create from prompt' },
]

export default function AIModal({ note, onApply, onClose }) {
  const [activeAction, setActiveAction] = useState('summarize')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleRun = async () => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      let res
      if (activeAction === 'generate') {
        res = await api.post('/ai/generate', { prompt })
        setResult(typeof res.data.result === 'object' ? res.data.result.content : res.data.result)
      } else if (activeAction === 'summarize') {
        res = await api.post('/ai/summarize', { content: note?.content || prompt })
        setResult(res.data.result)
      } else if (activeAction === 'improve') {
        res = await api.post('/ai/improve', { content: note?.content || prompt })
        setResult(res.data.result)
      } else if (activeAction === 'bullets') {
        res = await api.post('/ai/bullets', { content: note?.content || prompt })
        setResult(res.data.result)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            <h3 className="text-white font-semibold">AI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Actions */}
          <div className="grid grid-cols-4 gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => setActiveAction(action.id)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  activeAction === action.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                <p className="text-xs font-medium">{action.label}</p>
                <p className="text-xs opacity-60 mt-0.5">{action.desc}</p>
              </button>
            ))}
          </div>

          {/* Prompt input */}
          {(activeAction === 'generate' || !note?.content) && (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeAction === 'generate' ? 'Describe what note to generate...' : 'Paste your content here...'}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          )}

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={loading || (activeAction === 'generate' && !prompt.trim())}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><Sparkles size={16} /> Run AI</>}
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-300 text-xs font-medium uppercase tracking-wider">Result</p>
                <button onClick={handleCopy} className="text-slate-400 hover:text-slate-200 transition-colors">
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
              <button
                onClick={() => onApply(result)}
                className="mt-3 w-full bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-sm py-2 rounded-lg transition-all"
              >
                Apply to Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}