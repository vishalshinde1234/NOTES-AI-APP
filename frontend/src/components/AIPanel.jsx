import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import api from '../api/axios'

export default function AIPanel({ note, onApply }) {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await api.post('/ai/generate', { prompt })
      const content = typeof res.data.result === 'object' ? res.data.result.content : res.data.result
      setResult(content)
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      <div className="border-b border-slate-800 px-8 py-4 flex items-center gap-3">
        <Sparkles size={18} className="text-indigo-400" />
        <h2 className="text-white font-semibold">AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-3xl w-full mx-auto space-y-6">
        <div>
          <p className="text-slate-300 font-medium mb-2 text-sm">Generate a note from a prompt</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Write meeting notes about Q2 product roadmap..."
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="mt-3 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Generating...</> : <><Sparkles size={15} /> Generate Note</>}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">Generated</p>
              {note && (
                <button
                  onClick={() => onApply(result)}
                  className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg transition-all"
                >
                  Apply to Current Note
                </button>
              )}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  )
}