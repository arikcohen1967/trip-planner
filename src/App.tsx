import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const supabaseUrl = 'https://feuiggffrildwnpjjjty.supabase.co'
const supabaseKey = 'sb_publishable_tchXNOjzt_Mii-kqLL-PQ0_GHE6xdQ'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [count, setCount] = useState<number>(0)
  
  const [destination, setDestination] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [savedTrip, setSavedTrip] = useState<{ destination: string; startDate: string; endDate: string } | null>(null)

  const handleSaveTripDates = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination || !startDate || !endDate) {
      alert('נא למלא יעד, תאריך התחלה ותאריך סיום.')
      return
    }

    try {
      const { error } = await supabase
        .from('trips')
        .insert([{ destination, start_date: startDate, end_date: endDate }])

      if (error) {
        console.error('שגיאה בשמירה:', error.message)
        setSavedTrip({ destination, startDate, endDate })
        alert(`הטיול ל-${destination} עודכן מקומית מ-${startDate} ועד ${endDate}!`)
      } else {
        setSavedTrip({ destination, startDate, endDate })
        alert(`הטיול ל-${destination} נשמר בהצלחה במסד הנתונים מ-${startDate} ועד ${endDate}!`)
      }
    } catch (err) {
      console.error(err)
      setSavedTrip({ destination, startDate, endDate })
      alert(`הטיול ל-${destination} עודכן מ-${startDate} ועד ${endDate}!`)
    }
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
            הגדר את יעד הנסיעה וטווח התאריכים שלך ועקוב אחר התוכניות בקלות
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem auto', maxWidth: '400px', textAlign: 'right', direction: 'rtl' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>תכנון טיול חדש</h3>
          <form onSubmit={handleSaveTripDates} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>יעד הטיול (לדוגמה: איטליה / רומא):</label>
              <input 
                type="text" 
                placeholder="הכנס יעד..."
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>תאריך התחלה:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>תאריך סיום:</label>
              <input 
                type="date" 
                value={endDate} 
                min={startDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', color: '#000', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ padding: '0.75rem', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              שמור טיול למסד הנתונים
            </button>
          </form>

          {savedTrip && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(100, 108, 255, 0.2)', borderRadius: '4px', fontSize: '0.9rem' }}>
              ✈️ יעד פעיל: <strong>{savedTrip.destination}</strong><br />
              📅 טווח: <strong>{savedTrip.startDate}</strong> עד <strong>{savedTrip.endDate}</strong>
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
