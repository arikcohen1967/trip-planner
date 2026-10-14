import React, { useState, useEffect } from 'react'

const APP_VERSION_LABEL = 'v2.4 Pro'
const ADMIN_PASSWORD = '1967'

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

interface FamilyMember {
  id: string
  name: string
  subtitle: string
  location: string
  battery: number
  distance: string
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
  { id: 3, q: "מהו בעל החיים המהיר ביותר ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס", "צבי"], answer: 1 }
]

export default function App() {
  const [currentStep, setCurrentStep] = useState<'setup' | 'itinerary'>('setup')
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)

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
    { id: '1', name: 'Amit Cohen 👑❤️😘', subtitle: 'שיש ביקום (הבת המועדפת)', location: 'Bat Khefer - Now', battery: 88, distance: '26 km', address: 'Bet Keshet 28, Bat Khefer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '2', name: 'Yuly Cohen', subtitle: 'בן משפחה', location: 'Bat Khefer - Now', battery: 92, distance: '25 km', address: 'Haifa St 12, Bat Khefer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      window.addEventListener('online', () => setIsOnline(true))
      window.addEventListener('offline', () => setIsOnline(false))
    }
  }, [])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      alert('התחברת בהצלחה כמנהל על!')
    } else { alert('סיסמת מנהל שגויה.') }
  }

  // שמירת גרסה כקובץ פיזי במכשיר/טלפון
  const handleSavePhoneVersion = () => {
    if (!isAdminAuthenticated) return alert('נדרשת התחברות מנהל (סיסמה: 1967).')
    const versionData = {
      versionLabel: APP_VERSION_LABEL,
      timestamp: new Date().toLocaleString('he-IL'),
      destination,
      startDate,
      endDate,
      hotelAddress,
      itinerary
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(versionData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `TripMaster_Backup_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    alert('הגרסה נשמרה בהצלחה כקובץ במכשירך!')
  }

  // טעינה ושחזור גרסה מקובץ פיזי מהטלפון
  const handleRestorePhoneVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdminAuthenticated) {
      alert('נדרשת התחברות מנהל לפני שחזור גרסה.')
      return
    }
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string)
        if (parsed.destination && parsed.itinerary) {
          setDestination(parsed.destination)
          setStartDate(parsed.startDate || '')
          setEndDate(parsed.endDate || '')
          setHotelAddress(parsed.hotelAddress || '')
          setItinerary(parsed.itinerary)
          alert(`האפליקציה שוחזרה בהצלחה מגרסת קובץ (${parsed.versionLabel || 'גיבוי'})!`)
          setIsVersionModalOpen(false)
        } else {
          alert('הקובץ אינו מכיל מבנה נתונים תקין של הטיול.')
        }
      } catch (err) {
        alert('שגיאה בקריאת קובץ הגיבוי.')
      }
    }
    reader.readAsText(file)
  }

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter(l => l.trim() !== '')
      const newDays: DayItinerary[] = []
      let currAttrs: Attraction[] = []
      lines.forEach((line, idx) => {
        const parts = line.split(',')
        if (parts.length >= 2) {
          currAttrs.push({ id: `e_${idx}`, name: parts[0].trim(), location: parts[1].trim(), type: parts[2]?.trim() === 'food' ? 'food' : 'attraction' })
        }
        if (currAttrs.length >= 3 || idx === lines.length - 1) {
          if (currAttrs.length > 0) { newDays.push({ dayNumber: newDays.length + 1, title: `יום טיול ${newDays.length + 1}`, attractions: [...currAttrs] }); currAttrs = []; }
        }
      })
      if (newDays.length > 0) { setItinerary(newDays); setCurrentStep('itinerary'); alert('האקסל פוענח בהצלחה!'); }
      else alert('פורמט לא תקין');
    }
    reader.readAsText(file)
  }

  const openWaze = (loc: string) => window.open(`https://www.waze.com/ul?q=${encodeURIComponent(loc)}&navigate=yes`, '_blank')
  const navigateToHotel = () => hotelAddress ? openWaze(hotelAddress) : alert('לא הוגדר מלון')

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflowY: 'auto', direction: 'rtl', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      
      {/* סרגל עליון */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>TripMaster</span>
          <button onClick={() => setIsVersionModalOpen(true)} style={{ height: '38px', background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '0 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#4f46e5' }}>{APP_VERSION_LABEL}</button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={navigateToHotel} style={{ height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>🏨 למלון</button>
          <div style={{ height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#10b981' : '#ef4444' }}></span>{isOnline ? 'Online' : 'Offline'}
          </div>
          <button onClick={() => { setActiveTabInSidebar('menu'); setIsSidebarOpen(true); }} style={{ height: '38px', width: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>⋮</button>
        </div>
      </header>

      {/* מודל ניהול גרסאות (לחיצה על מספר הגרסה למעלה) */}
      {isVersionModalOpen && (
        <div onClick={() => setIsVersionModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '1.5rem', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>ניהול גרסאות מערכת (1967)</h3>
              <button onClick={() => setIsVersionModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminLogin}>
                <input type="password" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} placeholder="סיסמת מנהל..." style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>התחבר כמנהל</button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>✅ מחובר כמנהל על</div>
                <button type="button" onClick={handleSavePhoneVersion} style={{ width: '100%', padding: '0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>💾 שמור גרסה כקובץ בטלפון</button>
                <label style={{ width: '100%', padding: '0.6rem', background: '#f59e0b', color: '#fff', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box' }}>
                  📂 טען ושחזר גרסה מהטלפון
                  <input type="file" accept=".json" onChange={handleRestorePhoneVersion} style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* תפריט צד */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background
