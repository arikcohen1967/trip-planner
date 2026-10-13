import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const supabaseUrl = 'https://feuiggffrildwnpjjjty.supabase.co'
const supabaseKey = 'sb_publishable_tchXNojzt_Mii-kqLL-PQ0_GHE6xDg' 
const supabase = createClient(supabaseUrl, supabaseKey)

const ADMIN_PASSWORD = 'arik123' // סיסמת מנהל העל שלך

interface Attraction {
  id: string
  name: string
  location: string
}

interface DayItinerary {
  dayNumber: number
  title: string
  attractions: Attraction[]
}

interface AppVersion {
  versionNumber: string
  timestamp: string
  itinerary: DayItinerary[]
  destination: string
}

function App() {
  const [destination, setDestination] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  
  const [itinerary, setItinerary] = useState<DayItinerary[]>([
    {
      dayNumber: 1,
      title: 'הגעה וסיור היכרות',
      attractions: [
        { id: '1', name: 'מרכז העיר / טיילת', location: 'Riva del Garda, Italy' }
      ]
    }
  ])

  // ניהול גרסאות
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)
  const [versionsHistory, setVersionsHistory] = useState<AppVersion[]>([])
  const [selectedVersionToRestore, setSelectedVersionToRestore] = useState<string>('')

  // טעינת היסטוריית גרסאות מ-Supabase בעליית האפליקציה
  useEffect(() => {
    fetchVersions()
  }, [])

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('app_versions')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setVersionsHistory(data.map(item => item.version_data))
      }
    } catch (err) {
      console.error('Error fetching versions:', err)
    }
  }

  // אימות מנהל
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      alert('התחברת בהצלחה כמנהל העל!')
    } else {
      alert('סיסמת מנהל שגויה.')
    }
  }

  // שמירת גרסה חדשה (רק למנהל)
  const handleSaveNewVersion = async () => {
    if (!isAdminAuthenticated) {
      alert('פעולה זו דורשת התחברות כמנהל העל.')
      return
    }

    const nextVersionNum = `v1.${versionsHistory.length + 1}`
    const newVersionObj: AppVersion = {
      versionNumber: nextVersionNum,
      timestamp: new Date().toLocaleString('he-IL'),
      itinerary,
      destination
    }

    try {
      const { error } = await supabase.from('app_versions').insert([
        { version_number: nextVersionNum, version_data: newVersionObj }
      ])

      if (error) {
        alert('שגיאה בשמירת הגרסה במסד הנתונים.')
      } else {
        alert(`הגרסה ${nextVersionNum} נשמרה בהצלחה במערכת!`)
        fetchVersions()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // שחזור גרסה (Disaster Recovery)
  const handleRestoreVersion = () => {
    if (!isAdminAuthenticated) {
      alert('נדרשת סיסמת מנהל לביצוע שחזור מערכת.')
      return
    }

    const targetVersion = versionsHistory.find(v => v.versionNumber === selectedVersionToRestore)
    if (targetVersion) {
      setItinerary(targetVersion.itinerary)
      setDestination(targetVersion.destination)
      alert(`האפליקציה שוחזרה בהצלחה לגרסה ${targetVersion.versionNumber}!`)
    } else {
      alert('נא לבחור גרסה תקינה לשחזור.')
    }
  }

  const openWaze = (location: string) => {
    const encoded = encodeURIComponent(location)
    window.open(`https://www.waze.com/ul?q=${encoded}&navigate=yes`, '_blank')
  }

  const openGoogleMaps = (location: string) => {
    const encoded = encodeURIComponent(location)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank')
  }

  return (
    <>
      <div className="hero">
        <img src={heroImg} className="base" width="120" height="126" alt="" />
        <img src={reactLogo} className="framework" width="40" alt="React logo" />
        <img src={viteLogo} className="vite" width="40" alt="Vite logo" />
      </div>
      
      <div>
        <h1>תכנון נסיעות וחופשות</h1>
        <p>מערכת ניהול מרובת משתמשים עם בקרת גרסאות למנהל העל</p>
      </div>

      {/* אזור ניהול העל והגנת סיסמה */}
      <div className="trip-card" style={{ borderColor: isAdminAuthenticated ? '#10b981' : '#cbd5e1', marginBottom: '2rem' }}>
        <h3>🔒 אזור ניהול העל (Control Center)</h3>
        
        {!isAdminAuthenticated ? (
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label>הכנס סיסמת מנהל מערכת</label>
              <input 
                type="password" 
                value={adminPasswordInput} 
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="סיסמה..."
              />
            </div>
            <button type="submit" className="submit-btn" style={{ background: '#0f172a' }}>
              התחבר כמנהל
            </button>
          </form>
        ) : (
          <div>
            <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px', color: '#065f46', marginBottom: '1rem', fontWeight: 'bold' }}>
              ✅ מחובר כמנהל העל — יש לך הרשאות מלאות לשמירה ושחזור גרסאות.
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                type="button" 
                onClick={handleSaveNewVersion} 
                className="submit-btn"
                style={{ margin: 0, background: '#10b981' }}
              >
                💾 צור ושמור גרסה חדשה (Commit)
              </button>
            </div>

            {/* שחזור חירום (Disaster Recovery) */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <label style={{ marginBottom: '0.5rem', display: 'block' }}>שחזור מערכת מגרסה קודמת (Disaster Recovery):</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={selectedVersionToRestore} 
                  onChange={(e) => setSelectedVersionToRestore(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">בחר גרסה לשחזור...</option>
                  {versionsHistory.map(ver => (
                    <option key={ver.versionNumber} value={ver.versionNumber}>
                      {ver.versionNumber} - {ver.timestamp} ({ver.destination || 'ללא יעד'})
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={handleRestoreVersion}
                  style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  שחזר גרסה
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* מסגרת הטיול הכללית */}
      <div className="trip-card" style={{ marginBottom: '2rem' }}>
        <h3>פרטי הטיול המרכזיים</h3>
        <div className="form-group">
          <label>יעד הטיול</label>
          <input 
            type="text" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)}
            placeholder="לדוגמה: איטליה - אגם גארדה"
          />
        </div>
        <div className="form-group">
          <label>תאריך התחלה</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>תאריך סיום</label>
          <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* תשתית נקודות ציון וניווט */}
      <div className="trip-card">
        <h3>מסלול יומי וניווט מהיר</h3>
        {itinerary.map(day => (
          <div key={day.dayNumber} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#4f46e5' }}>יום {day.dayNumber}: {day.title}</h4>
            {day.attractions.map(attr => (
              <div key={attr.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{attr.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6366f1' }}>📍 {attr.location}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openWaze(attr.location)} style={{ padding: '0.4rem 0.75rem', background: '#33ccff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>Waze</button>
                  <button onClick={() => openGoogleMaps(attr.location)} style={{ padding: '0.4rem 0.75rem', background: '#34a853', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>Maps</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
