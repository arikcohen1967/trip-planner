import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)
  
  // States עבור טווח תאריכי הנסיעה
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [savedTrip, setSavedTrip] = useState<{ startDate: string; endDate: string } | null>(null)

  const handleSaveTripDates = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) {
      alert('נא לבחור גם תאריך התחלה וגם תאריך סיום.')
      return
    }
    setSavedTrip({ startDate, endDate })
    alert(`הטיול עודכן בהצלחה מ-${startDate} ועד ${endDate}!`)
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>תכנון נסיעות וחופשות</h1>
          <p>
            הגדר את טווח תאריכי הנסיעה שלך ועקוב אחר התוכניות בקלות
          </p>
        </div>

        {/* טופס בחירת טווח תאריכים */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem auto', maxWidth: '400px', textAlign: 'right', direction: 'rtl' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>בחירת טווח תאריכים לטיול</h3>
          <form onSubmit={handleSaveTripDates} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>תאריך התחלה:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>תאריך סיום:</label>
              <input 
                type="date" 
                value={endDate} 
                min={startDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ padding: '0.75rem', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              שמור תאריכים
            </button>
          </form>

          {savedTrip && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(100, 108, 255, 0.2)', borderRadius: '4px', fontSize: '0.9rem' }}>
              ✅ טיול פעיל: <strong>{savedTrip.startDate}</strong> עד <strong>{savedTrip.endDate}</strong>
            </div>
          )}
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
