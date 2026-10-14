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
        .from('app_
