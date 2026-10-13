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
    <div style={{ position: 'relative', minHeight: '100vh', direction: 'rtl', background: '#f8fafc', paddingBottom: '3rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* סרגל עליון נקי עם כפתור 3 נקודות לתפריט צדדי */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>TripMaster</span>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#1e293b'
          }}
          title="תפריט ניהול"
        >
          ⋮
        </button>
      </header>

      {/* תפריט צדדי נפתח מימין (Drawer) עם רקע מוצלל */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, backdropFilter: 'blur(2px)' }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '300px',
              height: '100vh',
              background: '#ffffff',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
              zIndex: 1000,
              padding: '1.5rem',
              boxSizing: 'border-box',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>תפריט ניהול מערכת</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              {/* אזור ניהול העל והגרסאות */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#4f46e5', marginBottom: '1rem' }}>🔒 אזור מנהל על (Disaster Recovery)</h4>
                
                {!isAdminAuthenticated ? (
                  <form onSubmit={handleAdminLogin}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#475569' }}>סיסמת מנהל</label>
                      <input 
                        type="password" 
                        value={adminPasswordInput} 
                        onChange={e => setAdminPasswordInput(e.target.value)}
                        placeholder="הכנס סיסמה..."
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>התחבר כמנהל</button>
                  </form>
                ) : (
                  <div>
                    <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                      ✅ מחובר כמנהל על
                    </div>

                    <button 
                      type="button" 
                      onClick={handleSaveNewVersion} 
                      style={{ background: '#10b981', color: '#fff', width: '100%', padding: '0.6rem', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                      💾 צור גרסה חדשה (Commit)
                    </button>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', display: 'block', color: '#475569' }}>שחזור מערכת מגרסה:</label>
                      <select 
                        value={selectedVersionToRestore} 
                        onChange={e => setSelectedVersionToRestore(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.5rem', fontSize: '0.85rem' }}
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
                        style={{ width: '100%', padding: '0.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        שחזר גרסה
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* אזור לפונקציות עתידיות שיווספו לתפריט */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>פעולות נוספות במערכת</h4>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '0.4rem 0' }}>• ניהול משתמשים (בקרוב)</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '0.4rem 0' }}>• הג
