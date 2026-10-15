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
              <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#2c2c2e', color: '#fff', border: '1px solid #3a3a3c', fontSize: '1rem
