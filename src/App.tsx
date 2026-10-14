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

export default function App() {
  const [currentStep, setCurrentStep] = useState<'setup' | 'itinerary'>('setup')
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [destination, setDestination] = useState<string>('צפון אגם גארדה, איטליה')
  const [hotelAddress, setHotelAddress] = useState<string>('Hotel Riva, Garda, Italy')
  const [itinerary, setItinerary] = useState<DayItinerary[]>([
    {
      dayNumber: 1,
      title: 'הגעה וסיור היכרות',
      attractions: [{ id: '101', name: 'מרכז העיר', location: 'Riva del Garda, Italy', type: 'attraction' }]
    }
  ])
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)

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
    } else {
      alert('סיסמת מנהל שגויה.')
    }
  }

  const handleSavePhoneVersion = () => {
    if (!isAdminAuthenticated) return alert('נדרשת התחברות מנהל (סיסמה: 1967).')
    const versionData = { versionLabel: APP_VERSION_LABEL, timestamp: new Date().toLocaleString('he-IL'), destination, hotelAddress, itinerary }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(versionData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `TripMaster_Backup.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    alert('הגרסה נשמרה בהצלחה כקובץ במכשירך!')
  }

  const handleRestorePhoneVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdminAuthenticated) return alert('נדרשת התחברות מנהל לפני שחזור.')
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string)
        if (parsed.destination && parsed.itinerary) {
          setDestination(parsed.destination)
          setHotelAddress(parsed.hotelAddress || '')
          setItinerary(parsed.itinerary)
          alert('האפליקציה שוחזרה בהצלחה מהקובץ!')
          setIsVersionModalOpen(false)
        }
      } catch (err) { alert('שגיאה בקריאת הקובץ.') }
    }
    reader.readAsText(file)
  }

  const openWaze = (loc: string) => window.open(`https://www.waze.com/ul?q=${encodeURIComponent(loc)}&navigate=yes`, '_blank')

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflowY: 'auto', direction: 'rtl', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>אריק - TripMaster</span>
          <button onClick={() => setIsVersionModalOpen(true)} style={{ height: '38px', background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '0 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#4f46e5' }}>{APP_VERSION_LABEL}</button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => hotelAddress ? openWaze(hotelAddress) : alert('אין כתובת מלון')} style={{ height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>🏨 למלון</button>
          <div style={{ height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#10b981' : '#ef4444' }}></span>{isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>יעד: {destination}</h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>🏨 מלון: {hotelAddress}</div>
              </div>
              <button onClick={() => setCurrentStep('setup')} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>✏️ ערוך פרטים</button>
            </div>

            {itinerary.map(day => (
              <div key={day.dayNumber}>
                <h4 style={{ color: '#4f46e5', marginBottom: '0.8rem', fontSize: '0.95rem' }}>{day.title}</h4>
                {day.attractions.map(attr => (
                  <div key={attr.id} style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', boxSizing: 'border-box' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{attr.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{attr.location}</div>
                    </div>
                    <button onClick={() => openWaze(attr.location)} style={{ padding: '0.35rem 0.6rem', background: '#33ccff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' }}>Waze</button>
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
