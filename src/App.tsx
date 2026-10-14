import React, { useState, useEffect } from 'react'

const APP_VERSION = 'v3.0 Stable'
const ADMIN_PASS = '1967'

export default function App() {
  const [destination, setDestination] = useState<string>('צפון אגם גארדה, איטליה')
  const [hotelAddress, setHotelAddress] = useState<string>('Hotel Riva, Garda, Italy')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [passInput, setPassInput] = useState<string>('')
  const [isAuthed, setIsAuthed] = useState<boolean>(false)

  useEffect(() => {
    const savedDest = localStorage.getItem('trip_destination')
    const savedHotel = localStorage.getItem('trip_hotel')
    if (savedDest) setDestination(savedDest)
    if (savedHotel) setHotelAddress(savedHotel)
  }, [])

  const handleSaveData = () => {
    if (!isAuthed) return alert('נדרשת התחברות מנהל (סיסמה: 1967).')
    localStorage.setItem('trip_destination', destination)
    localStorage.setItem('trip_hotel', hotelAddress)
    alert('הנתונים נשמרו בהצלחה במכשיר!')
    setIsModalOpen(false)
  }

  const openWaze = (loc: string) => window.open(`https://www.waze.com/ul?q=${encodeURIComponent(loc)}&navigate=yes`, '_blank')

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflowY: 'auto', direction: 'rtl', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>אריק - TripMaster</span>
          <button onClick={() => setIsModalOpen(true)} style={{ height: '38px', background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '0 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#4f46e5' }}>{APP_VERSION}</button>
        </div>
        
        <button onClick={() => hotelAddress ? openWaze(hotelAddress) : alert('אין כתובת מלון')} style={{ height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 0.85rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>🏨 למלון</button>
      </header>

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '1.5rem', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>ניהול מערכת (1967)</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            {!isAuthed ? (
              <form onSubmit={e => { e.preventDefault(); if (passInput === ADMIN_PASS) { setIsAuthed(true); alert('מחובר!'); } else alert('שגיאה'); }}>
                <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} placeholder="סיסמה..." style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>התחבר</button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.4rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>✅ מחובר כמנהל</div>
                <button type="button" onClick={handleSaveData} style={{ width: '100%', padding: '0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>💾 שמור נתונים במכשיר</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '550px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', boxSizing: 'border-box', flex: 1 }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>ניהול יעדים</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>יעד טיול</label>
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginTop: '0.3rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>כתובת מלון</label>
            <input type="text" value={hotelAddress} onChange={e => setHotelAddress(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', marginTop: '0.3rem', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => alert('המסלולים מעודכנים!')} style={{ width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>שמור מסלול</button>
        </div>
      </div>
    </div>
  )
}
