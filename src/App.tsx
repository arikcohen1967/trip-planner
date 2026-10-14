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
  
  // פופ-אפ ניהול גרסאות בלחיצה על מספר הגרסה למעלה
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
      fontFamily: 'system-ui, -apple-system, sans-
