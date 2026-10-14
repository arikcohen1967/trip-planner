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
  { id: 3, q: "מהו בעל החיים המהיר ביותר ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס", "צבי"], answer: 1 }
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
    { id: '1', name: 'Amit Cohen 👑❤️😘', subtitle: 'שיש ביקום (הבת המועדפת)', location: 'Bat Khefer - Now', battery: 88, distance: '26 km', status: 'בטוח', address: 'Bet Keshet 28, Bat Khefer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '2', name: 'Yuly Cohen', subtitle: 'בן משפחה', location: 'Bat Khefer - Now', battery: 92, distance: '25 km', status: 'בטוח', address: 'Haifa St 12, Bat Khefer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      window.addEventListener('online', () => setIsOnline(true))
      window.addEventListener('offline', () => setIsOnline(false))
      fetchVersions()
    }
  }, [])

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase.from('app_versions').select('*').order('created_at', { ascending: false })
      if (!error && data) setVersionsHistory(data.map((item: any) => item.version_data))
    } catch (err) { console.error(err) }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      alert('התחברת בהצלחה כמנהל על!')
    } else { alert('סיסמת מנהל שגויה.') }
  }

  const handleSaveNewVersion = async () => {
    if (!isAdminAuthenticated) return alert('נדרשת התחברות מנהל.')
    const nextVersionNum = `v2.${versionsHistory.length + 1}`
    const newVersionObj: AppVersion = { versionNumber: nextVersionNum, timestamp: new Date().toLocaleString('he-IL'), destination, startDate, endDate, hotelAddress, itinerary }
    const { error } = await supabase.from('app_versions').insert([{ version_number: nextVersionNum, version_data: newVersionObj }])
    if (!error) { alert(`גרסה ${nextVersionNum} נשמרה בהצלחה!`); fetchVersions(); }
  }

  const handleRestoreVersion = () => {
    if (!isAdminAuthenticated) return
    const target = versionsHistory.find(v => v.versionNumber === selectedVersionToRestore)
    if (target) {
      setDestination(target.destination); setStartDate(target.startDate); setEndDate(target.endDate); setHotelAddress(target.hotelAddress || ''); setItinerary(target.itinerary);
      alert(`שוחזרה גרסה ${target.versionNumber}!`); setIsVersionModalOpen(false);
    }
  }

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ destination, startDate, endDate, hotelAddress, itinerary }))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr); downloadAnchor.setAttribute("download", `trip.json`);
    document.body.appendChild(downloadAnchor); downloadAnchor.click(); downloadAnchor.remove();
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    if (e.target.files?.[0]) {
      reader.readAsText(e.target.files[0], "UTF-8")
      reader.onload = evt => {
        try {
          const parsed = JSON.parse(evt.target?.result as string)
          if (parsed.destination && parsed.itinerary) {
            setDestination(parsed.destination); setStartDate(parsed.startDate || ''); setEndDate(parsed.endDate || ''); setHotelAddress(parsed.hotelAddress || ''); setItinerary(parsed.itinerary);
            alert('הטיול נטען בהצלחה!'); setCurrentStep('itinerary');
          }
        } catch (err) { alert('קובץ לא תקין.'); }
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

      {isVersionModalOpen && (
        <div onClick={() => setIsVersionModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '1.5rem', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>ניהול גרסאות (1967)</h3>
              <button onClick={() => setIsVersionModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminLogin}>
                <input type="password" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} placeholder="סיסמה..." style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>התחבר</button>
              </form>
            ) : (
              <div>
                <button type="button" onClick={handleSaveNewVersion} style={{ background: '#10b981', color: '#fff', width: '100%', padding: '0.6rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>💾 שמור גרסה חדשה</button>
                <select value={selectedVersionToRestore} onChange={e => setSelectedVersionToRestore(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.5rem', boxSizing: 'border-box' }}>
                  <option value="">בחר גרסה לשחזור...</option>
                  {versionsHistory.map(ver => <option key={ver.versionNumber} value={ver.versionNumber}>{ver.versionNumber} - {ver.timestamp}</option>)}
                </select>
                <button type="button" onClick={handleRestoreVersion} style={{ width: '100%', padding: '0.5rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>שחזר גרסה</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: '#ffffff', zIndex: 1000, padding: '1.5rem', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>תפריט מערכת</h3>
                <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '8px' }}>
                <button onClick={() => setActiveTabInSidebar('menu')} style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'menu' ? '#fff' : 'transparent', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}>⚙️ ניהול</button>
                <button onClick={() => setActiveTabInSidebar('trivia')} style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'trivia' ? '#fff' : 'transparent', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}>🎯 טריוויה</button>
                <button onClick={() => setActiveTabInSidebar('radar')} style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: 'none', background: activeTabInSidebar === 'radar' ? '#fff' : 'transparent', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}>🛰️ מצא את</button>
              </div>

              {activeTabInSidebar === 'menu' && (
                <div>
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.85rem', marginTop: 0 }}>📊 טעינת אקסל</h4>
                    <input type="file" accept=".csv, .xlsx, .txt" onChange={handleExcelUpload} style={{ fontSize: '0.75rem', width: '100%' }} />
                  </div>
                </div>
              )}

              {activeTabInSidebar === 'radar' && (
                <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '1rem', color: '#fff' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>People</div>
                  {familyMembers.map(m => (
                    <div key={m.id} onClick={() => openWaze(m.address)} style={{ background: '#2c2c2e', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                      <img src={m.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{m.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#8e8e93' }}>{m.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '550px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', boxSizing: 'border-box', flex: 1 }}>
        {currentStep === 'setup' ? (
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem' }}>הגדרת יעדים ומלון מרכזי</h3>
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
            <input type="text" value={hotelAddress} onChange={e => setHotelAddress(e.target.value)} placeholder="כתובת מלון" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginBottom: '1rem', boxSizing: 'border-box' }} />
            <button onClick={() => setCurrentStep('itinerary')} style={{ width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>המשך למסלולים ⬅️</button>
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>יעד: {destination}</h3>
            {itinerary.map(day => (
              <div key={day.dayNumber}>
                <h4 style={{ color: '#4f46e5' }}>{day.title}</h4>
                {day.attractions.map(attr => (
                  <div key={attr.id} style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span>{attr.name}</span>
                    <button onClick={() => openWaze(attr.location)} style={{ padding: '0.35rem 0.6rem', background: '#33ccff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Waze</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
