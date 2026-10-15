import React, { useState, useEffect } from 'react'

const APP_VERSION_LABEL = 'v3.3 Pro Find My'
const ADMIN_PASSWORD = '1967'

interface FamilyMember {
  id: string
  name: string
  subtitle: string
  lat: number
  lng: number
  battery: number
  status: string
  address: string
  avatar: string
  lastUpdated: string
}

const INITIAL_FAMILY: FamilyMember[] = [
  { id: 'arik', name: 'אריק כהן 👑', subtitle: 'מנהל מערכת / אבא', lat: 32.1093, lng: 34.8555, battery: 95, status: 'בטוח', address: 'ראש העין, ישראל', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', lastUpdated: 'עכשיו' },
  { id: 'sigal', name: 'סיגל ❤️', subtitle: 'בת זוג', lat: 32.1150, lng: 34.8170, battery: 90, status: 'בטוח', address: 'השרון, ישראל', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', lastUpdated: 'לפני דקה' },
  { id: 'amit', name: 'Amit Cohen 👑❤️😘', subtitle: 'הבת המועדפת', lat: 32.3250, lng: 35.0150, battery: 88, status: 'בטוח', address: 'בת חפר', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', lastUpdated: 'עכשיו' },
  { id: 'yuly', name: 'Yuly Cohen', subtitle: 'בן משפחה', lat: 32.3220, lng: 35.0120, battery: 92, status: 'בטוח', address: 'בת חפר', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', lastUpdated: 'לפני 2 דקות' },
  { id: 'lian', name: 'Lian Cohen', subtitle: 'בן משפחה', lat: 32.3300, lng: 35.0200, battery: 64, status: 'בדרכים', address: 'בת חפר', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', lastUpdated: 'עכשיו' }
]

export default function App() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<FamilyMember | null>(null)
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(true)
  const [selectedUserId, setSelectedUserId] = useState<string>('arik')
  const [customUserName, setCustomUserName] = useState<string>('')
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)
  const [activeTabInSidebar, setActiveTabInSidebar] = useState<'menu' | 'trivia' | 'radar'>('radar')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      window.addEventListener('online', () => setIsOnline(true))
      window.addEventListener('offline', () => setIsOnline(false))

      if (navigator.geolocation && currentUser) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setFamilyMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, lat: latitude, lng: longitude, lastUpdated: 'עכשיו' } : m))
          },
          (err) => console.error('GPS Error:', err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
        )
        return () => navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [currentUser])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    let user = familyMembers.find(m => m.id === selectedUserId)
    if (selectedUserId === 'new' && customUserName.trim()) {
      const newUser: FamilyMember = {
        id: `user_${Date.now()}`,
        name: customUserName.trim(),
        subtitle: 'משתמש חדש במערכת',
        lat: 32.1093,
        lng: 34.8555,
        battery: 100,
        status: 'בטוח',
        address: 'ישראל',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        lastUpdated: 'עכשיו'
      }
      setFamilyMembers(prev => [...prev, newUser])
      user = newUser
    }
    if (user) {
      setCurrentUser(user)
      setLoginModalOpen(false)
    }
  }

  const sendSoundPing = (member: FamilyMember) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      setTimeout(() => { osc.stop(); }, 800)
    } catch(e) { console.log(e) }
    alert(`נשלח פינג קולי אל ${member.name}!`)
  }

  const openWaze = (loc: string) => window.open(`https://www.waze.com/ul?q=${encodeURIComponent(loc)}&navigate=yes`, '_blank')
  const openGoogleMaps = (lat: number, lng: number) => window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflowY: 'auto', direction: 'rtl', background: '#000', fontFamily: 'sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      
      {loginModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1c1c1e', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '2rem', border: '1px solid #3a3a3c', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📍</div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>Find My Family - התחברות</h2>
            <form onSubmit={handleLogin}>
              <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#2c2c2e', color: '#fff', border: '1px solid #3a3a3c', fontSize: '1rem', marginBottom: '1rem' }}>
                {familyMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.subtitle})</option>
                ))}
                <option value="new">➕ הוסף משתמש חדש...</option>
              </select>

              {selectedUserId === 'new' && (
                <input type="text" placeholder="הכנס את שמך המלא..." value={customUserName} onChange={e => setCustomUserName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#2c2c2e', color: '#fff', border: '1px solid #3a3a3c', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }} required />
              )}

              <button type="submit" style={{ width: '100%', padding: '0.85rem', background: '#007aff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>התחל שיתוף מיקום 🛰️</button>
            </form>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#1c1c1e', borderBottom: '1px solid #3a3a3c', position: 'sticky', top: 0, zIndex: 50, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>Find My ({currentUser?.name || 'אורח'})</span>
          <button onClick={() => setIsVersionModalOpen(true)} style={{ height: '32px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '0 0.6rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', color: '#0a84ff' }}>{APP_VERSION_LABEL}</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => { setActiveTabInSidebar('radar'); setIsSidebarOpen(true); }} style={{ height: '36px', background: '#007aff', border: 'none', borderRadius: '18px', padding: '0 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>🛰️ רשימת אנשים</button>
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', minHeight: '400px', background: '#1c1c1e' }}>
        <iframe 
          title="Live Map"
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentUser?.lng ? currentUser.lng - 0.05 : 34.85}%2C${currentUser?.lat ? currentUser.lat - 0.05 : 32.1}%2C${currentUser?.lng ? currentUser.lng + 0.05 : 34.95}%2C${currentUser?.lat ? currentUser.lat + 0.05 : 32.2}&layer=mapnik&marker=${currentUser?.lat || 32.1093}%2C${currentUser?.lng || 34.8555}`}>
        </iframe>

        <div style={{ position: 'absolute', bottom: '20px', left: '15px', right: '15px', background: 'rgba(28,28,30,0.95)', borderRadius: '20px', padding: '1rem', border: '1px solid rgba(255,255,255,0.15)', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>אנשים מחוברים ({familyMembers.length})</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {familyMembers.map(m => (
              <div key={m.id} onClick={() => setSelectedMember(m)} style={{ minWidth: '90px', background: selectedMember?.id === m.id ? '#3a3a3c' : '#2c2c2e', borderRadius: '14px', padding: '0.6rem', textAlign: 'center', cursor: 'pointer' }}>
                <img src={m.avatar} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', marginBottom: '4px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{m.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.65rem', color: '#32d74b' }}>{m.battery}% 🔋</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedMember && (
        <div onClick={() => setSelectedMember(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1c1c1e', width: '100%', maxWidth: '500px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '1.5rem', border: '1px solid #3a3a3c', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img src={selectedMember.avatar} alt="" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedMember.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#8e8e93' }}>{selectedMember.subtitle} • {selectedMember.address}</div>
                <div style={{ fontSize: '0.75rem', color: '#32d74b', marginTop: '2px' }}>סטטוס: {selectedMember.status} | סוללה: {selectedMember.battery}% 🔋</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <button onClick={() => openGoogleMaps(selectedMember.lat, selectedMember.lng)} style={{ padding: '0.7rem', background: '#007aff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>🧭 נווט</button>
              <button onClick={() => openWaze(selectedMember.address)} style={{ padding: '0.7rem', background: '#33ccff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>🚗 Waze</button>
              <button onClick={() => sendSoundPing(selectedMember)} style={{ padding: '0.7rem', background: '#ff9f0a', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>🔔 פינג</button>
            </div>

            <button onClick={() => setSelectedMember(null)} style={{ width: '100%', padding: '0.6rem', background: '#2c2c2e', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>סגור</button>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: '#1c1c1e', zIndex: 1000, padding: '1.5rem', boxSizing: 'border-box', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid #3a3a3c', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>תפריט מערכת</h3>
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <div>
              <h4 style={{ color: '#0a84ff', marginTop: 0 }}>🛰️ רשימת משתמשים מלאה</h4>
              {familyMembers.map(m => (
                <div key={m.id} onClick={() => { setSelectedMember(m); setIsSidebarOpen(false); }} style={{ background: '#2c2c2e', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '8px' }}>
                  <img src={m.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#8e8e93' }}>{m.address} • {m.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isVersionModalOpen && (
        <div onClick={() => setIsVersionModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1c1c1e', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '1.5rem', border: '1px solid #3a3a3c' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>ניהול גרסאות (1967)</h3>
            {!isAdminAuthenticated ? (
              <form onSubmit={e => { e.preventDefault(); if (adminPasswordInput === ADMIN_PASSWORD) setIsAdminAuthenticated(true); else alert('שגוי'); }}>
                <input type="password" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} placeholder="סיסמה..." style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#2c2c2e', color: '#fff', border: '1px solid #3a3a3c', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#0a84ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>אישור</button>
              </form>
            ) : (
              <div style={{ color: '#32d74b', fontWeight: 'bold', fontSize: '0.85rem' }}>✅ מנהל מערכת מורשה</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
