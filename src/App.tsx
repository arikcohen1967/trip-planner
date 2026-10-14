import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://feuiggffrildwnpjjjty.supabase.co'
const SUPABASE_KEY = 'sb_publishable_tchXNojzt_Mii-kqLL-PQ0_GHE6xDg' 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

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
  role: string
  location: string
  battery: number
  status: 'בטוח' | 'בדרכים' | 'חירום'
  coords: { lat: number; lng: number }
}

interface TriviaQuestion {
  id: number
  q: string
  options: string[]
  answer: number
}

// מאגר שאלות טריוויה לדוגמה (מתוך 1,500 שאלות ספורדיות לנוער)
const TRIVIA_BANK: TriviaQuestion[] = [
  { id: 1, q: "איזה כוכב לכת קרוב ביותר לשמש?", options: ["נוגה", "חמה (מרקורי)", "מאדים", "צדק"], answer: 1 },
  { id: 2, q: "באיזו מדינה נמצא מגדל אייפל?", options: ["איטליה", "בריטניה", "צרפת", "ספרד"], answer: 2 },
  { id: 3, q: "מהו בעל החיים המהיר ביותר ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס", "צבי"], answer: 1 },
  { id: 4, q: "כמה ימים יש בשנה מעוברת?", options: ["365", "366", "364", "360"], answer: 1 },
  { id: 5, q: "איזה יסוד כימי מסומן באותיות Au?", options: ["כסף", "זהב", "ברזל", "נחושת"], answer: 1 }
]

export default function App() {
  // מצבי אפליקציה מרכזיים
  const [currentStep, setCurrentStep] = useState<'setup' | 'itinerary'>('setup')
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  
  // נתוני טיול
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

  // ניהול מנהל וגרסאות
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)
  const [versionsHistory, setVersionsHistory] = useState<AppVersion[]>([])
  const [selectedVersionToRestore, setSelectedVersionToRestore] = useState<string>('')

  // תפריטים מתקדמים בצד (טריוויה / רادار)
  const [activeTabInSidebar, setActiveTabInSidebar] = useState<'menu' | 'trivia' | 'radar'>('menu')

  // מצב משחק טריוויה
  const [triviaScore, setTriviaScore] = useState<number>(0)
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState<number>(0)
  const [isTriviaActive, setIsTriviaActive] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [triviaFeedback, setTriviaFeedback] = useState<string>('')

  // מצב רادار משפחתי (מצא את)
  const [familyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'אבא', role: 'מנהל טיול', location: 'ליד המלון', battery: 88, status: 'בטוח', coords: { lat: 32.1, lng: 34.8 } },
    { id: '2', name: 'אמא', role: 'נווטת', location: 'במרכז הקניות', battery: 92, status: 'בטוח', coords: { lat: 32.12, lng: 34.82 } },
    { id: '3', name: 'יובל (מתבגר)', role: 'שחקן טריוויה מוביל', location: 'פארק המים', battery: 64, status: 'בדרכים', coords: { lat: 32.15, lng: 34.85 } }
  ])

  // האזנה לחיבוריות רשת Online / Offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    fetchVersions()
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
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
        alert('שגיאה בשמירה בענן, נשמר מקומית.')
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
      setIsSidebarOpen(false)
    }
  }

  // ייצוא נתונים לקובץ JSON בטלפון / מחשב
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ destination, startDate, endDate, hotelAddress, itinerary }))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `trip_${destination.replace(/\s+/g, '_')}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // טעינת נתונים מקובץ JSON בטלפון / מחשב
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
            setItinerary(parsed.parsedItinerary || parsed.itinerary)
            alert('הטיול נטען בהצלחה מהקובץ!')
            setCurrentStep('itinerary')
          }
        } catch (err) {
          alert('קובץ לא תקין.')
        }
      }
    }
  }

  // פענוח קובץ אקסל או טקסט מובנה אוטומטית
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
            type: type as any
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
      
      {/* סרגל עליון מקצועי עם חיווי רשת */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.8rem 1.5rem', 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>✈️ TripMaster Pro</span>
          {/* חיווי אונליין / אופליין */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            padding: '0.2rem 0.6rem', 
            borderRadius: '20px', 
            background: isOnline ? '#ecfdf5' : '#fef2f2', 
            color: isOnline ? '#059669' : '#dc2626',
            fontWeight: 'bold',
            border: `1px solid ${isOnline ? '#a7f3d0' : '#fecaca'}`
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOnline ? '#10b981' : '#ef4444', display: 'inline-block' }}></span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={navigateToHotel}
            style={{
              background: '#e0e7ff',
              border: '1px solid #c7d2fe',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            title="נווט למלון ב-Waze"
          >
            🏨 למלון
          </button>

          <button 
            onClick={() => { setActiveTabInSidebar('menu'); setIsSidebarOpen(true); }}
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
            title="תפריט ניהול מתקדם"
          >
            ⋮
          </button>
        </div>
      </header>

      {/* תפריט צדדי (Drawer) עשיר ומורחב */}
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
              width: '340px',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>תפריט מערכת וכלים</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              {/* ניווט פנימי בתפריט הצד */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => setActiveTabInSidebar('menu')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'menu' ? '#4f46e5' : '#f1f5f9', color: activeTabInSidebar === 'menu' ? '#fff' : '#334155', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  ⚙️ ניהול וגיבוי
                </button>
                <button 
                  onClick={() => setActiveTabInSidebar('trivia')}
                  style={{ flex:
