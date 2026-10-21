import { useState } from 'react'


export default function App() {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(2)
  const [budget, setBudget] = useState('')
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function planTrip() {
    setLoading(true)
    setPlan(null)
    setError('')
    const params = new URLSearchParams({ destination, days, budget })
    const res = await fetch(`/api/plan-cards?${params}`)
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      setPlan(data.plan)
    }
    setLoading(false)
  }
  const realTotal = plan ? plan.days.reduce((sum, day) => sum + day.cost, 0) : 0
  const overBudget = realTotal > Number(budget)

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

        {error && <p className="mt-6 font-medium text-red-600">{error}</p>}

        {plan && (
          <div className="mt-8">
            {/* Title card */}
            <div className="rounded-2xl bg-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold">{plan.title}</h2>
              <p className="mt-1 text-indigo-100">Total: ₹{realTotal}</p>

              {budget && (
                overBudget ? (
                  <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 font-medium text-red-700">
                    🚨 Over budget by ₹{realTotal - Number(budget)}
                  </p>
                ) : (
                  <p className="mt-3 rounded-lg bg-green-100 px-3 py-2 font-medium text-green-700">
                    ✅ Within budget, ₹{Number(budget) - realTotal} to spare
                  </p>
                )
              )}
            </div>

            {/* One card per day */}
            <div className="mt-4 grid gap-4">
              {plan.days.map((day) => (
                <div key={day.day} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-indigo-600">Day {day.day}</p>
                  <h3 className="text-lg font-semibold">{day.title}</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700">
                    {day.places.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                  <p className="mt-3">🍛 {day.food}</p>
                  <p className="mt-1 font-medium">💰 ₹{day.cost}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}