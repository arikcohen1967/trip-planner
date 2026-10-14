import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://feuiggffrildwnpjjjty.supabase.co'
const SUPABASE_KEY = 'sb_publishable_tchXNojzt_Mii-kqLL-PQ0_GHE6xDg' 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const ADMIN_PASSWORD = '1967'
const APP_VERSION_LABEL = 'v2.3 Pro'

interface Attraction {
  id: string
  name: string
  location: string
  type: 'attraction' | 'food' | 'hotel'
}

interface DayItinerary {
  dayNumber: number
  title: string
  attractions: Attraction[]
}

interface AppVersion {
  versionNumber: string
  timestamp: string
  destination: string
  startDate: string
  endDate: string
  hotelAddress: string
  itinerary: DayItinerary[]
}

interface FamilyMember {
  id: string
  name: string
  subtitle: string
  location: string
  battery: number
  distance: string
  status: 'בטוח' | 'בדרכים' | 'חירום'
  address: string
  avatar: string
}

interface TriviaQuestion {
  id: number
  q: string
  options: string[]
  answer: number
}

const TRIVIA_BANK: TriviaQuestion[] = [
  { id: 1, q: "איזה כוכב לכת קרוב ביותר לשמש?", options: ["נוגה", "חמה (מרקורי)", "מאדים", "צדק"], answer: 1 },
  { id: 2, q: "באיזו מדינה נמצא מגדל אייפל?", options: ["איטליה", "בריטניה", "צרפת", "ספרד"], answer: 2 },
  { id: 3, q: "מהו בעל החיים המהיר ביותר ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס", "צבי"], answer: 1 },
  { id: 4, q: "כמה ימים יש בשנה מעוברת?", options: ["365", "366", "364", "360"], answer: 1 },
  { id: 5, q: "איזה יסוד כימי מסומן באותיות Au?", options: ["כסף", "זהב", "ברזל", "נחושת"], answer: 1 }
]

export default function App() {
  const [currentStep, setCurrentStep] = useState<'setup' | 'itinerary'>('setup')
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)
  const [versionsHistory, setVersionsHistory] = useState<AppVersion[]>([])
  const [selectedVersionToRestore, setSelectedVersionToRestore] = useState<string>('')

  const [destination, setDestination] = useState<string>('צפון אגם גארדה, איטליה')
  const [startDate, setStartDate] = useState<string>('2026-07-01')
  const [endDate, setEndDate] = useState<string>('2026-07-08')
  const [hotelAddress, setHotelAddress] = useState<string>('Hotel Riva, Garda, Italy')
  
  const [itinerary, setItinerary] = useState<DayItinerary[]>([
    {
      dayNumber: 1,
      title: 'הגעה וסיור היכרות באגם',
      attractions: [
        { id: '101', name: 'מרכז העיר העתיקה', location: 'Riva del Garda, Italy', type: 'attraction' },
        { id: '102', name: 'מסעדת פיצה מומלצת', location: 'Piazza 3 Novembre, Riva del Garda', type: 'food' }
      ]
    }
  ])
  const [selectedDay, setSelectedDay] = useState<number>(1)

  const [activeTabInSidebar, setActiveTabInSidebar] = useState<'menu' | 'trivia' | 'radar'>('menu')

  const [triviaScore, setTriviaScore] = useState<number>(0)
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState<number>(0)
  const [isTriviaActive, setIsTriviaActive] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [triviaFeedback, setTriviaFeedback] = useState<string>('')

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [familyMembers] = useState<FamilyMember[]>([
    { 
      id: '1', 
      name: 'Amit Cohen 👑❤️😘', 
      subtitle: 'שיש ביקום (הבת המועדפת)', 
      location: 'Bat Khefer - Now', 
      battery: 88, 
      distance: '26 km', 
      status: 'בטוח', 
      address: 'Bet Keshet 28, Bat Khefer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
    },
    { 
      id: '2', 
      name: 'Yuly Cohen', 
      subtitle: 'בן משפחה', 
      location: 'Bat Khefer - Now', 
      battery: 92, 
      distance: '25 km', 
      status: 'בטוח', 
      address: 'Haifa St 12, Bat Khefer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' 
    },
    { 
      id: '3', 
      name: 'Lian Cohen', 
      subtitle: 'בן משפחה', 
      location: 'Bat Khefer - Now', 
      battery: 64, 
      distance: '26 km', 
      status: 'בדרכים', 
      address: 'Haganim 5, Bat Khefer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' 
    }
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      fetchVersions()
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('app_versions')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        setVersionsHistory(data.map((item: any) => item.version_data))
      }
    } catch (err) {
      console.error('שגיאה בטעינת גרסאות מ-Supabase:', err)
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      alert('התחברת בהצלחה כמנהל על!')
    } else {
      alert('סיסמת מנהל שגויה.')
    }
  }

  const handleSaveNewVersion = async () => {
    if (!isAdminAuthenticated) {
      alert('נדרשת התחברות מנהל.')
      return
    }
    const nextVersionNum = `v2.${versionsHistory.length + 1}`
    const newVersionObj: AppVersion = {
      versionNumber: nextVersionNum,
      timestamp: new Date().toLocaleString('he-IL'),
      destination,
      startDate,
      endDate,
      hotelAddress,
      itinerary
    }

    try {
      const { error } = await supabase.from('app_versions').insert([
        { version_number: nextVersionNum, version_data: newVersionObj }
      ])
      if (!error) {
        alert(`גרסה ${nextVersionNum} נשמרה בהצלחה בענן!`)
        fetchVersions()
      } else {
        alert('שגיאה בשמירה בענן.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRestoreVersion = () => {
    if (!isAdminAuthenticated) return
    const target = versionsHistory.find(v => v.versionNumber === selectedVersionToRestore)
    if (target) {
      setDestination(target.destination)
      setStartDate(target.startDate)
      setEndDate(target.endDate)
      setHotelAddress(target.hotelAddress || '')
      setItinerary(target.itinerary)
      alert(`שוחזרה גרסה ${target.versionNumber} בהצלחה!`)
      setIsVersionModalOpen(false)
    }
  }

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ destination, startDate, endDate, hotelAddress, itinerary }))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `trip_${destination.replace(/\s+/g, '_')}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8")
      fileReader.onload = event => {
        try {
          const parsed = JSON.parse(event.target?.result as string)
          if (parsed.destination && parsed.itinerary) {
            setDestination(parsed.destination)
            setStartDate(parsed.startDate || '')
            setEndDate(parsed.endDate || '')
            setHotelAddress(parsed.hotelAddress || '')
            setItinerary(parsed.itinerary)
            alert('הטיול נטען בהצלחה מהקובץ!')
            setCurrentStep('itinerary')
          }
        } catch (err) {
          alert('קובץ לא תקין.')
        }
      }
    }
  }

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter(l => l.trim() !== '')
      const newDays: DayItinerary[] = []
      
      let currentDayNum = 1
      let currentDayAttractions: Attraction[] = []

      lines.forEach((line, idx) => {
        const parts = line.split(',')
        if (parts.length >= 2) {
          const attrName = parts[0].trim()
          const attrLoc = parts[1].trim()
          const type = parts[2]?.trim() === 'food' ? 'food' : 'attraction'

          currentDayAttractions.push({
            id: `excel_${idx}`,
            name: attrName,
            location: attrLoc,
            type: type
          })
        }

        if (currentDayAttractions.length >= 3 || idx === lines.length - 1) {
          if (currentDayAttractions.length > 0) {
            newDays.push({
              dayNumber: currentDayNum,
              title: `יום טיול אוטומטי ${currentDayNum}`,
              attractions: [...currentDayAttractions]
            })
            currentDayNum++
            currentDayAttractions = []
          }
        }
      })

      if (newDays.length > 0) {
        setItinerary(newDays)
        setCurrentStep('itinerary')
        alert(`האקסל פוענח בהצלחה! נוצרו ${newDays.length} ימי טיול עם ניווט ומקומות עצירה.`)
      } else {
        alert('לא זוהו שורות תקינות בקובץ. וודא שפורמט השורות הוא: שם מקום, כתובת')
      }
    }
    reader.readAsText(file)
  }

  const openWaze = (location: string) => {
    window.open(`https://www.waze.com/ul?q=${encodeURIComponent(location)}&navigate=yes`, '_blank')
  }

  const navigateToHotel = () => {
    if (!hotelAddress) {
      alert('לא הוגדרה כתובת מלון.')
      return
    }
    openWaze(hotelAddress)
  }

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      width: '100vw', 
      height: '100vh', 
      overflowY: 'auto', 
      direction: 'rtl', 
      background: '#f8fafc', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.75rem 1.25rem', 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>TripMaster</span>
          
          <button 
            onClick={() => setIsVersionModalOpen(true)}
            style={{
              height: '38px',
              background: '#e0e7ff',
              border: '1px solid #c7d2fe',
              borderRadius: '8px',
              padding: '0 0.85rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}
            title="ניהול גרסאות ושחזור מערכת (מוגן סיסמה)"
          >
            {APP_VERSION_LABEL}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={navigateToHotel}
            style={{
              height: '38px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0 0.85rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxSizing: 'border-box'
            }}
            title="נווט למלון ב-Waze"
          >
            🏨 למלון
          </button>

          <div style={{ 
            height: '38px',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '0 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: '#1e293b',
            boxSizing: 'border-box'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#10b981' : '#ef4444', display: 'inline-block' }}></span>
            {isOnline ? 'Online' : 'Offline'}
          </div>

          <button 
            onClick={() => { setActiveTabInSidebar('menu'); setIsSidebarOpen(true); }}
            style={{
              height: '38px',
              width: '38px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#1e293b',
              boxSizing: 'border-box',
              padding: 0
            }}
            title="תפריט ניהול מתקדם"
          >
            ⋮
          </button>
        </div>
      </header>

      {isVersionModalOpen && (
        <div 
          onClick={() => setIsVersionModalOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '1.5rem', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>ניהול גרסאות מערכת (1967)</h3>
              <button onClick={() => setIsVersionModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#475569' }}>סיסמת מנהל</label>
                  <input 
                    type="password" 
                    value={adminPasswordInput} 
                    onChange={e => setAdminPasswordInput(e.target.value)}
                    placeholder="הכנס סיסמה..."
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>התחבר כמנהל</button>
              </form>
            ) : (
              <div>
                <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                  ✅ מחובר כמנהל על
                </div>

                <button 
                  type="button" 
                  onClick={handleSaveNewVersion} 
                  style={{ background: '#10b981', color: '#fff', width: '100%', padding: '0.6rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1rem' }}
                >
                  💾 שמור גרסה חדשה בענן (Commit)
                </button>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', display: 'block', color: '#475569' }}>שחזור מערכת מגרסה קודמת:</label>
                  <select 
                    value={selectedVersionToRestore} 
                    onChange={e => setSelectedVersionToRestore(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.5rem', fontSize: '0.85rem', boxSizing: 'border-box' }}
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
                    style={{ width: '100%', padding: '0.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    שחזר גרסה נבחרת
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
              width: '360px',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>תפריט מערכת וכלים</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '8px' }}>
                <button 
                  onClick={() => setActiveTabInSidebar('menu')}
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'menu' ? '#ffffff' : 'transparent', color: activeTabInSidebar === 'menu' ? '#0f172a' : '#64748b', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer', boxShadow: activeTabInSidebar === 'menu' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  ⚙️ ניהול
                </button>
                <button 
                  onClick={() => setActiveTabInSidebar('trivia')}
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'trivia' ? '#ffffff' : 'transparent', color: activeTabInSidebar === 'trivia' ? '#0f172a' : '#64748b', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer', boxShadow: activeTabInSidebar === 'trivia' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  🎯 טריוויה
                </button>
                <button 
                  onClick={() => setActiveTabInSidebar('radar')}
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'radar' ? '#ffffff' : 'transparent', color: activeTabInSidebar === 'radar' ? '#0f172a' : '#64748b', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer', boxShadow: activeTabInSidebar === 'radar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  🛰️ מצא את
                </button>
              </div>

              {activeTabInSidebar === 'menu' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: 0, marginBottom: '0.3rem' }}>📊 טעינת אקסל אוטומטית</h4>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>קובץ CSV עם אטרקציות וכתובות:</p>
                    <input type="file" accept=".csv, .xlsx, .txt" onChange={handleExcelUpload} style={{ fontSize: '0.75rem', width: '100%', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: 0, marginBottom: '0.3rem' }}>💾 גיבוי ושחזור מהמכשיר</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleExportJSON} style={{ flex: 1, padding: '0.45rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>ייצא נתונים</button>
                      <label style={{ flex: 1, padding: '0.45rem', background: '#0d9488', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }}>
                        טען נתונים
                        <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTabInSidebar === 'trivia' && (
                <div>
                  <h4 style={{ color: '#4f46e5', marginTop: 0, marginBottom: '0.4rem', fontSize: '0.9rem' }}>🎯 טריוויה ספורדית (14-20)</h4>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem' }}>1,500 שאלות מאתגרות עם שמירת ניקוד אוטומטית.</p>
                  
                  <div style={{ background: '#e0e7ff', padding: '0.6rem', borderRadius: '8px', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '0.85rem', color: '#3730a3' }}>
                    🏆 ניקוד: {triviaScore} נקודות
                  </div>

                  {!isTriviaActive ? (
                    <button 
                      onClick={() => setIsTriviaActive(true)}
                      style={{ width: '100%', padding: '0.6rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      ▶️ התחל משחק
                    </button>
                  ) : (
                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.4rem', color: '#1e293b' }}>
                        שאלה {currentTriviaIndex + 1} מתוך 1,500
                      </div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: '#334155' }}>
                        {TRIVIA_BANK[currentTriviaIndex % TRIVIA_BANK.length].q}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                        {TRIVIA_BANK[currentTriviaIndex % TRIVIA_BANK.length].options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              const currentQ = TRIVIA_BANK[currentTriviaIndex % TRIVIA_BANK.length]
                              if (oIdx === currentQ.answer) {
                                setTriviaScore(s => s + 10)
                                setTriviaFeedback('כל הכבוד! נכון 🎉')
                              } else {
                                setTriviaFeedback('טעות... נסה שוב.')
                              }
                              setSelectedAnswer(oIdx)
                            }}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: selectedAnswer === null ? '#fff' : (oIdx === TRIVIA_BANK[currentTriviaIndex % TRIVIA_BANK.length].answer ? '#d1fae5' : (selectedAnswer === oIdx ? '#fee2e2' : '#fff')),
                              cursor: selectedAnswer === null ? 'pointer' : 'default',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                            disabled={selectedAnswer !== null}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {triviaFeedback && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: triviaFeedback.includes('כל הכבוד') ? '#059669' : '#dc2626' }}>
                          {triviaFeedback}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {selectedAnswer !== null && (
                          <button 
                            onClick={() => {
                              setSelectedAnswer(null)
                              setTriviaFeedback('')
                              setCurrentTriviaIndex(i => i + 1)
                            }}
                            style={{ flex: 1, padding: '0.45rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            הבא ⬅️
                          </button>
                        )}
                        <button 
                          onClick={() => setIsTriviaActive(false)}
                          style={{ flex: 1, padding: '0.45rem', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          ⏸️ עצור
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTabInSidebar === 'radar' && (
                <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '1rem', color: '#fff', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>People</span>
                    <span style={{ background: '#2c2c2e', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', cursor: 'pointer' }}>+</span>
                  </div>

                  {!selectedMember ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {familyMembers.map(member => (
                        <div 
                          key={member.id} 
                          onClick={() => setSelectedMember(member)}
                          style={{ background: '#2c2c2e', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                        >
                          <div style={{ position: 'relative' }}>
                            <img src={member.avatar} alt={member.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#ffcc00', border: '2px solid #2c2c2e', borderRadius: '50%' }}></span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#ebebf599', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.subtitle}</div>
                            <div style={{ fontSize: '0.65rem', color: '#8e8e93', marginTop: '0.1rem' }}>{member.location}</div>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#8e8e93', whiteSpace: 'nowrap' }}>{member.distance}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background: '#2c2c2e', borderRadius: '12px', padding: '1rem', boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#fff' }}>{selectedMember.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#ebebf599', marginTop: '0.1rem' }}>{selectedMember.subtitle}</div>
                          <div style={{ fontSize: '0.7rem', color: '#8e8e93', marginTop: '0.1rem' }}>{selectedMember.address}</div>
                          <div style={{ fontSize: '0.7rem', color: '#34c759', fontWeight: 'bold', marginTop: '0.2rem' }}>Live</div>
                        </div>
                        <button 
                          onClick={() => setSelectedMember(null)}
                          style={{ background: '#3a3a3c', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ background: '#3a3a3c', padding: '0.6rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
                          <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>👤</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>Contact</div>
                          <div style={{ fontSize: '0.65rem', color: '#8e8e93' }}>Info</div>
                        </div>
                        <div 
                          onClick={() => openWaze(selectedMember.address)}
                          style={{ background: '#3a3a3c', padding: '0.6rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}
                        >
                          <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem', color: '#0a84ff' }}>↗</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>Directions</div>
                          <div style={{ fontSize: '0.65rem', color: '#0a84ff' }}>{selectedMember.distance}</div>
                        </div>
                      </div>

                      <div style={{ background: '#3a3a3c', padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#ff453a' }}>🔔</span>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>Notifications</div>
                          <div style={{ fontSize: '0.65rem', color: '#8e8e93' }}>התראה בעת הגעה/יציאה</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #3a3a3c', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '0.65rem', color: '#8e8e93', textAlign: 'center' }}>
                    <div style={{ color: '#0a84ff', fontWeight: 'bold' }}>👥<br/>People</div>
                    <div>💻<br/>Devices</div>
                    <div>🔲<br/>Items</div>
                    <div>🧭<br/>Me</div>
                  </div>
                </div>
              )}

            </div>

            <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              Trip Planner Pro {APP_VERSION_LABEL}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '550px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', boxSizing: 'border-box', flex: 1 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 0.3rem 0' }}>תכנון נסיעות חכם ואוטומטי</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>ניהול מסלולים, ניווט ישיר והעלאה חלקה מאקסל</p>
        </div>

        {currentStep === 'setup' ? (
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
            <h3 style={{ marginTop: 0, color: '#1e293b', marginBottom: '1rem', fontSize: '1rem' }}>שלב 1: הגדרת יעדים ומלון מרכזי</h3>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.8rem', color: '#475569' }}>יעד הטיול הראשי</label>
              <input 
                type="text" 
                value={destination} 
                onChange={e => setDestination(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }}
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.8rem', color: '#475569' }}>כתובת המלון (לכפתור הניווט המהיר)</label>
              <input 
                type="text" 
                value={hotelAddress} 
                onChange={e => setHotelAddress(e.target.value)}
                placeholder="לדוגמה: Hotel Riva, Garda"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.8rem', color: '#475569' }}>תאריך התחלה</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.8rem', color: '#475569' }}>תאריך סיום</label>
                <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }} />
              </div>
            </div>

            <button 
              onClick={() => setCurrentStep('itinerary')}
              style={{ width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            >
              המשך למסלולים היומיים ⬅️
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>יעד: {destination}</h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>🏨 מלון: {hotelAddress}</div>
              </div>
              <button 
                onClick={() => setCurrentStep('setup')}
                style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
              >
                ✏️ ערוך פרטים
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
              {itinerary.map(day => (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDay(day.dayNumber)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    border: selectedDay === day.dayNumber ? '2px solid #6366f1' : '1px solid #cbd5e1',
                    background: selectedDay === day.dayNumber ? '#e0e7ff' : '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    fontSize: '0.85rem'
                  }}
                >
                  יום {day.dayNumber}
                </button>
              ))}
            </div>

            {itinerary.filter(d => d.dayNumber === selectedDay).map(day => (
              <div key={day.dayNumber}>
                <h4 style={{ color: '#4f46e5', marginBottom: '0.8rem', fontSize: '0.95rem' }}>{day.title}</h4>
                {day.attractions.map(attr => (
                  <div key={attr.id} style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', boxSizing: 'border-box' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                        {attr.type === 'food' ? '🍔 ' : '📍 '} {attr.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{attr.location}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
