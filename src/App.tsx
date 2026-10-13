import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const supabaseUrl = 'https://feuiggffrildwnpjjjty.supabase.co'
const supabaseKey = 'sb_publishable_tchXNojzt_Mii-kqLL-PQ0_GHE6xDg' 
const supabase = createClient(supabaseUrl, supabaseKey)

const ADMIN_PASSWORD = 'arik123'

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
  const [currentStep, setCurrentStep] = useState<'setup' | 'itinerary'>('setup')
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
  const [selectedDay, setSelectedDay] = useState<number>(1)

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)
  const [versionsHistory, setVersionsHistory] = useState<AppVersion[]>([])
  const [selectedVersionToRestore, setSelectedVersionToRestore] = useState<string>('')

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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      alert('התחברת בהצלחה כמנהל העל!')
    } else {
      alert('סיסמת מנהל שגויה.')
    }
  }

  const handleSaveNewVersion = async () => {
    if (!isAdminAuthenticated) {
      alert('נדרשת התחברות מנהל.')
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

      if (!error) {
        alert(`גרסה ${nextVersionNum} נשמרה בהצלחה!`)
        fetchVersions()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRestoreVersion = () => {
    if (!isAdminAuthenticated) return
    const targetVersion = versionsHistory.find(v => v.versionNumber === selectedVersionToRestore)
    if (targetVersion) {
      setItinerary(targetVersion.itinerary)
      setDestination(targetVersion.destination)
      alert(`האפליקציה שוחזרה לגרסה ${targetVersion.versionNumber}!`)
      setIsSidebarOpen(false)
    }
  }

  const handleSaveSetup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination || !startDate || !endDate) {
      alert('נא למלא את כל פרטי היעד והתאריכים.')
      return
    }
    setCurrentStep('itinerary')
  }

  const openWaze = (location: string) => {
    window.open(`https://www.waze.com/ul?q=${encodeURIComponent(location)}&navigate=yes`, '_blank')
  }

  const openGoogleMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <button 
        onClick={() => setIsSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        ⚙️ ניהול וגרסאות
      </button>

      {isSidebarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '320px',
          height: '100vh',
          background: '#ffffff',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
          zIndex: 1000,
          padding: '2rem 1.5rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
          direction: 'rtl',
          textAlign: 'right'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>ניהול ובקרת גרסאות</h3>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>

          {!isAdminAuthenticated ? (
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label>סיסמת מנהל על</label>
                <input 
                  type="password" 
                  value={adminPasswordInput} 
                  onChange={e => setAdminPasswordInput(e.target.value)}
                  placeholder="הכנס סיסמה..."
                />
              </div>
              <button type="submit" className="submit-btn" style={{ background: '#0f172a' }}>התחבר</button>
            </form>
          ) : (
            <div>
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                ✅ מחובר כמנהל העל
              </div>

              <button 
                type="button" 
                onClick={handleSaveNewVersion} 
                className="submit-btn"
                style={{ background: '#10b981', marginBottom: '1.5rem' }}
              >
                💾 צור גרסה חדשה (Commit)
              </button>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>שחזור מערכת (Disaster Recovery):</label>
                <select 
                  value={selectedVersionToRestore} 
                  onChange={e => setSelectedVersionToRestore(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.75rem' }}
                >
                  <option value="">בחר גרסה לשחזור...</option>
                  {versionsHistory.map(ver => (
                    <option key={ver.versionNumber} value={ver.versionNumber}>
                      {ver.versionNumber} - {ver.timestamp}
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={handleRestoreVersion}
                  style={{ width: '100%', padding: '0.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  שחזר גרסה נבחרת
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="hero">
        <img src={heroImg} className="base" width="100" height="105" alt="" />
        <img src={reactLogo} width="35" alt="" />
        <img src={viteLogo} width="35" alt="" />
      </div>

      <div>
        <h1>תכנון נסיעות וחופשות</h1>
        <p>מערכת ניהול טיולים חכמה ומקצועית</p>
      </div>

      {currentStep === 'setup' ? (
        <div className="trip-card">
          <h3>שלב 1: הגדרת יעד הטיול והמסגרת</h3>
          <form onSubmit={handleSaveSetup}>
            <div className="form-group">
              <label>יעד הטיול</label>
              <input 
                type="text" 
                value={destination} 
                onChange={e => setDestination(e.target.value)}
                placeholder="לדוגמה: איטליה - צפון אגם גארדה"
              />
            </div>
            <div className="form-group">
              <label>תאריך התחלה</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>תאריך סיום</label>
              <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <button type="submit" className="submit-btn">
              המשך לתכנון המסלולים ⬅️
            </button>
          </form>
        </div>
      ) : (
        <div className="trip-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>מסלול טיול: {destination}</h3>
            <button 
              onClick={() => setCurrentStep('setup')}
              style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✏️ ערוך פרטי טיול
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {itinerary.map(day => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDay(day.dayNumber)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: selectedDay === day.dayNumber ? '2px solid #6366f1' : '1px solid #cbd5e1',
                  background: selectedDay === day.dayNumber ? '#e0e7ff' : '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                יום {day.dayNumber}
              </button>
            ))}
          </div>

          {itinerary.filter(d => d.dayNumber === selectedDay).map(day => (
            <div key={day.dayNumber}>
              <h4 style={{ color: '#4f46e5', marginBottom: '1rem' }}>{day.title}</h4>
              {day.attractions.map(attr => (
                <div key={attr.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{attr.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>📍 {attr.location}</div>
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
      )}
    </div>
  )
}

export default App
