import { useState } from 'react'
import Markdown from 'react-markdown'

export default function App() {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(2)
  const [budget, setBudget] = useState('')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)

  async function planTrip() {
    setLoading(true)
    setPlan('')
    const params = new URLSearchParams({ destination, days, budget })
    const res = await fetch(`/api/plan?${params}`)
    const data = await res.json()
    setPlan(data.plan || data.error)
    setLoading(false)
  }

  const inputStyle = 'w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="text-4xl font-bold text-indigo-600">Where-to-next!?</h1>
        <p className="mt-2 text-slate-600">Tell me where you want to go, and I'll plan your trip.</p>

        <div className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Destination
            <input
              className={inputStyle}
              placeholder="Where to? (e.g. Goa)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Days
              <input
                className={inputStyle}
                type="number"
                min="1"
                max="10"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Budget (₹)
              <input
                className={inputStyle}
                placeholder="e.g. 5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>
          </div>

          <button
            className="rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={planTrip}
            disabled={loading}
          >
            {loading ? 'Planning your trip… ⏳' : 'Plan my trip'}
          </button>
        </div>

        {plan && (
          <article className="prose mt-8 max-w-none rounded-2xl bg-white p-6 shadow-sm">
            <Markdown>{plan}</Markdown>
          </article>
        )}
      </div>
    </div>
  )
}