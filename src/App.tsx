import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v4.7 ---
const APP_VERSION = 'v4.7';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "רביעי · 30/09", title: "נחיתה והגעה למלון", icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    challengeDesc: "הרגע נחתנו ביום הראשון של הטיול! המשימה שלכם: סלפי משפחתי ראשון בשדה או עם הרכב השכור.",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה وרונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "איסוף מזוודות וקבלת הרכב השכור." },
      { time: "18:00", name: "נסיעה למלון והתארגנות", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", lat: 45.4192, lng: 10.6908, note: "צ׳ק-אין במלון ומנוחה קצרה לפני ארוחת הערב." }
    ],
    culinary: { name: "Pizzeria Trattoria al Ponte (פסקיירה)", dest: "Peschiera del Garda, Italy", desc: "פיצות נפוליטניות מעולות ופסטה קלאסית בפיצריה משפחתית, ולקינוח גלידה איטלקית אמיתית (Gelateria Popolare)." },
    creative: { name: "נהר המינצ'ו בפסקיירה", dest: "Peschiera del Garda, Italy", desc: "עצירה קצרה ליד גדת הנהר לפתיחת מחברות ציור ותיעוד הנוף הראשון שלכם באיטליה." }
  },
  {
    date: "2026-10-01", label: "חמישי · 01/10", title: "Gardaland – יום פארק מלא", icon: "🎢",
    challenge: "לבחור יחד את שלושת המתקנים הכי אקסטרימיים!",
    challengeDesc: "צלמו תמונה צועקים על אחד המתקנים וספרו מי צעק הכי חזק.",
    stops: [
      { time: "08:30", name: "יציאה מהמלון לגארדלנד", dest: "Gardaland Resort, Castelnuovo del Garda", lat: 45.4526, lng: 10.7153, note: "הגעה מוקדמת לפני פתיחת השערים." },
      { time: "13:00", name: "ארוחת צהריים בפארק", dest: "Gardaland Resort", lat: 45.4526, lng: 10.7153, note: "אוכל מהיר והמבורגרים במסעדות הפארק." }
    ],
    culinary: { name: "Roadhouse Restaurant (פסקיירה)", dest: "Peschiera del Garda, Italy", desc: "הבורגרים עסיסיים וסטייקים מעולים על האש לאחר יום הבילוי בפארק." },
    creative: { name: "הכנת סיכות אמיצים", dest: "Gardaland Resort", desc: "הכנת סיכת 'אמיצים בגארדלנד' מקרטון קשיח וטושים בתיק המשפחתי." }
  },
  {
    date: "2026-10-02", label: "שישי · 02/10", title: "מונטה באלדו + סירמיונה", icon: "🚠",
    challenge: "תמונת פנורמה משפחתית מפסגת הרכבל!",
    challengeDesc: "תצפית מרהיבה מגובה 1,800 מטר באלדו ולאחר מכן שיטוט בסמטאות סירמיונה.",
    stops: [
      { time: "08:30", name: "רכבל מונטה באלדו (מלצ׳סינה)", dest: "Funivia Malcesine-Monte Baldo", lat: 45.7797, lng: 10.8105, note: "רכבל מסתובב אל פסגת ההר." },
      { time: "13:00", name: "סירמיונה וחצי האי", dest: "Sirmione, Italy", lat: 45.4925, lng: 10.6053, note: "עיירת ימי ביניים קסומה על שפת האגם." }
    ],
    culinary: { name: "Trattoria La Marsa & Gelateria Iguana", dest: "Sirmione, Italy", desc: "פסטה טרטליני מדהימה צופה לאגם, וגלידריית בוטיק עם עשרות טעמים ייחודיים." },
    creative: { name: "פסגת מונטה באלדו", dest: "Funivia Malcesine-Monte Baldo", desc: "ציור הנוף מלמעלה כמפה של הרפתקנים על רקע העננים." }
  },
  {
    date: "2026-10-03", label: "שבת · 03/10", title: "Movieland + Medieval Times", icon: "🎬",
    challenge: "סלפי משפחתי שנראה כמו פוסטר של סרט הוליוודי!",
    challengeDesc: "פוזה דרמטית ליד תפאורת סרט ב-Movieland.",
    stops: [
      { time: "09:00", name: "Movieland The Hollywood Park", dest: "Movieland The Hollywood Park, Lazise", lat: 45.4745, lng: 10.7291, note: "יום אקשן וחוויות קולנועיות." },
      { time: "20:00", name: "Medieval Times – מופע האבירים", dest: "Medieval Times, Lazise", lat: 45.4745, lng: 10.7291, note: "ארוחת ערב חווייתית ללא סכו״ם." }
    ],
    culinary: { name: "Medieval Times Banquet", dest: "Medieval Times, Lazise", desc: "ארוחת אבירים מסורתית הכוללת עוף צלוי, תפוחי אדמה ומאפים." },
    creative: { name: "סדנת כתרים אביריים", dest: "Medieval Times, Lazise", desc: "הכנת כתרים מקושטים מנייר כסף ודפים צבעוניים לפני תחילת המופע." }
  },
  {
    date: "2026-10-04", label: "ראשון · 04/10", title: "ונציה – עיר המים", icon: "🛶",
    challenge: "למצוא גשר קטן ומיוחד מחוץ למסלול הראשי!",
    challengeDesc: "צלמו את הגשר הכי מיוחד שמצאתם בסמטאות ונציה.",
    stops: [
      { time: "07:30", name: "יציאה לוונציה", dest: "Venezia Tronchetto Parking", lat: 45.4384, lng: 12.3167, note: "חנייה מסודרת ומעבר בסירה למרכז העיר." },
      { time: "09:30", name: "כיכר סן מרקו", dest: "St. Mark's Square, Venice", lat: 45.4343, lng: 12.3388, note: "הלב הפועם והמרכזי של ונציה." }
    ],
    culinary: { name: "Suso Gelatoteca & Pizza al Taglio", dest: "St. Mark's Square, Venice", desc: "פיצה מהירה בסמטאות וגלידת בוטיק מעולה המפורסמת ביותר בעיר." },
    creative: { name: "גשר הציורים בוונציה", dest: "Venice, Italy", desc: "עצירה קצרה על גשר שקט לציור מהיר של סירת גונדולה חולפת." }
  },
  {
    date: "2026-10-05", label: "שני · 05/10", title: "X Rafting + Borghetto", icon: "🚣",
    challenge: "תמונה משפחתית מטורפת מהראפטינג!",
    challengeDesc: "אקשן מים מסעיר בבוקר וטיול רומנטי בבורגטו בצהריים.",
    stops: [
      { time: "09:00", name: "X Rafting", dest: "X Rafting, Italy", lat: 45.5512, lng: 10.8523, note: "שיט ראפטינג משפחתי מרגש בנהר." },
      { time: "12:30", name: "Borghetto sul Mincio", dest: "Borghetto sul Mincio", lat: 45.3524, lng: 10.6972, note: "ביקור בכפר הטחנות הקסום." }
    ],
    culinary: { name: "Ristorante Alla Borsa (Valeggio)", dest: "Valeggio sul Mincio, Italy", desc: "טעימת טורטליני האהבה המפורסם באחת המסעדות הוותיקות על גדות הנהר." },
    creative: { name: "טחנות המים בבורגטו", dest: "Borghetto sul Mincio", desc: "בניית סירות עץ ועלים קטנות ושילוחן בזרם המינצ'ו." }
  },
  {
    date: "2026-10-06", label: "שלישי · 06/10", title: "ורונה + חזרה לישראל", icon: "❤️",
    challenge: "לבחור יחד את רגע השיא של הטיול כולו!",
    challengeDesc: "סיכום חוויות בוורונה וטיסה חזרה הביתה.",
    stops: [
      { time: "09:00", name: "סיור בוורונה", dest: "Piazza Cittadella, Verona", lat: 45.4384, lng: 10.9916, note: "סיור בארנה והמרפסת של יוליה." },
      { time: "18:30", name: "שדה התעופה وרונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "החזרת הרכב וטיסה חזרה לישראל." }
    ],
    culinary: { name: "Farcito Verona", dest: "Verona, Italy", desc: "המבורגר משובח ופיצה דקה ומיוחדת במרכז וורונה ממש לפני הנסיעה לשדה." },
    creative: { name: "גלוית פרידה איטלקית", dest: "Verona, Italy", desc: "כתיבת גלוית סיכום וציור מזכרת אישית מהטיול במלון לפני העזיבה." }
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🚤 ונציה'];
const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', isLink: true, url: '#', passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'flight-amit', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', isLink: true, url: '#', passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
  { id: 'flight-yuly', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)', isLink: true, url: '#', passenger: 'COHEN/YULY MS', ticketNo: '8180011314104' },
  { id: 'flight-lian', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)', isLink: true, url: '#', passenger: 'COHEN/LIAN CHD', ticketNo: '8180011314105' },
  { id: 'flight-harel', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - הראל כהן (8180011314106)', isLink: true, url: '#', passenger: 'VILNAI COHEN/HAREL MR', ticketNo: '8180011314106' },
  { id: 'aig-insurance', folder: '✈️ טיסות ורכב', title: 'ביטוח נסיעות AIG (170270213826)', isInsuranceInfo: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', isHotelInfo: true },
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 1 (Serial 600)', ticketCode: 'BKN1P01Y901MART', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-2', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 2 (Serial 601)', ticketCode: 'VKN1P01Y901ME4T', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-3', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 3 (Serial 606)', ticketCode: 'TKN1P01Y901MUTT', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-4', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 4 (Serial 607)', ticketCode: 'VKN1P01Y901MY6T', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-5', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 5 (Serial 608)', ticketCode: 'CKN1P01Y901N2IT', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'movieland-1', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 1', ticketCode: 'EA35DB7A2EA540D5', trans: '017JUNAR0070', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-2', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 2', ticketCode: '256612CCD43B8E08', trans: '017JUNAR0069', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-3', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 3', ticketCode: '934FEA2F66750267', trans: '017JUNAR0071', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-4', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 4', ticketCode: '52CACC0D5CAE334B', trans: '017JUNAR0072', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-5', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 5', ticketCode: '32D6C578DF258ACF', trans: '017JUNAR0073', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' }
];

const ROAD_TRIVIA_QUESTIONS = [
  { q: "כמה שיניים יש לאדם מבוגר בדרך כלל (כולל שיני בינה)?", options: ["28", "32", "36", "24"], correct: 1 },
  { q: "באיזו מדינה באירופה נמצא אגם גארדה?", options: ["צרפת", "ספרד", "איטליה", "אוסטריה"], correct: 2 },
  { q: "איזה בעל חיים ימי נחשב למהיר ביותר באוקיינוס?", options: ["כריש לבן", "דג מפרש", "דולפין", "לווייתן כחול"], correct: 1 },
  { q: "מהי בירת איטליה?", options: ["מילאנו", "ונציה", "רומא", "פירנצה"], correct: 2 },
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 }
];

const TRAVELERS_LIST = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];

const calculateDistanceAndDuration = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return { dist: '---', duration: '---' };
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = R * c;
  
  const hours = distKm / 70;
  const mins = Math.round(hours * 60);
  
  let durationStr = `${mins} דק'`;
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    durationStr = `${h} שע' ${m > 0 ? `${m} דק'` : ''}`;
  }

  return {
    dist: `${distKm.toFixed(1)} ק"מ`,
    duration: durationStr
  };
};

const generateRouteMapHTML = (myLoc, targetDayIndex, isDark) => {
  const currentLat = myLoc?.lat || 45.4384;
  const currentLng = myLoc?.lng || 10.6816;

  const targetDayObj = INITIAL_TRIP_DAYS[targetDayIndex] || INITIAL_TRIP_DAYS[0];
  const firstStop = targetDayObj.stops[0];
  const destLat = firstStop?.lat || 45.4192;
  const destLng = firstStop?.lng || 10.6908;
  const destName = firstStop?.name || targetDayObj.title;

  const { dist, duration } = calculateDistanceAndDuration(currentLat, currentLng, destLat, destLng);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: ${isDark ? '#0b0f19' : '#ffffff'}; }
        #map { width: 100%; height: 100%; }
        .route-badge {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          background: ${isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)'};
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          padding: 10px 18px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 13px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          backdrop-filter: blur(10px);
          border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'};
          display: flex;
          align-items: center;
          gap: 12px;
          direction: rtl;
        }
        .route-badge span { color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="route-badge">
        <span>🚗 יעד:</span> ${destName} | <span>📏 מרחק:</span> ${dist} | <span>⏱️ זמן:</span> ${duration}
      </div>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${currentLat}, ${currentLng}], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        L.marker([${currentLat}, ${currentLng}]).addTo(map).bindPopup('📍 המיקום הנוכחי שלך (GPS)').openPopup();
        L.marker([${destLat}, ${destLng}]).addTo(map).bindPopup('🏁 <b>יעד המסלול:</b> ' + "${destName}");

        const latlngs = [
          [${currentLat}, ${currentLng}],
          [${destLat}, ${destLng}]
        ];
        L.polyline(latlngs, {color: '#ef4444', weight: 5, opacity: 0.85, dashArray: '10, 10'}).addTo(map);
      </script>
    </body>
    </html>
  `;
};

const generateMapHTML = (familyLocs, myLoc, sosState, activeDayIndex, isDark) => {
  let centerLat = 45.4384, centerLng = 10.6816;
  if (sosState?.lat) { centerLat = sosState.lat; centerLng = sosState.lng; }
  else if (myLoc?.lat) { centerLat = myLoc.lat; centerLng = myLoc.lng; }

  const currentDayObj = INITIAL_TRIP_DAYS[activeDayIndex] || INITIAL_TRIP_DAYS[0];
  const nextStop = currentDayObj.stops[0];
  const nextLat = nextStop?.lat || 45.4192;
  const nextLng = nextStop?.lng || 10.6908;
  const nextName = nextStop?.name || 'היעד הבא';

  let markersJS = '';
  Object.values(familyLocs).forEach(loc => {
    if (loc && loc.lat) {
      markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>עודכן: ${loc.updated_at || 'עכשיו'}');\n`;
    }
  });

  let routePolylineJS = '';
  if (myLoc && myLoc.lat) {
    routePolylineJS = `
      const latlngs = [
        [${myLoc.lat}, ${myLoc.lng}],
        [${nextLat}, ${nextLng}]
      ];
      const polyline = L.polyline(latlngs, {color: '#ef4444', weight: 5, opacity: 0.85, dashArray: '10, 10'}).addTo(map);
      L.marker([${nextLat}, ${nextLng}]).addTo(map).bindPopup('🏁 <b>יעד הבא:</b> ${nextName}');
    `;
  } else {
    routePolylineJS = `
      L.marker([${nextLat}, ${nextLng}]).addTo(map).bindPopup('🏁 <b>יעד הבא:</b> ${nextName}');
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: ${isDark ? '#0b0f19' : '#ffffff'}; } #map { width: 100%; height: 100%; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${centerLat}, ${centerLng}], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        const myLocData = ${JSON.stringify(myLoc)};
        if (myLocData && myLocData.lat) {
          L.marker([myLocData.lat, myLocData.lng]).addTo(map).bindPopup('📍 המיקום שלי');
        }
        ${markersJS}
        ${routePolylineJS}
      </script>
    </body>
    </html>
  `;
};

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem('garda-current-user') || 'אריק'; } catch (e) { return 'אריק'; }
  });

  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem('garda-theme-mode') || 'light'; } catch (e) { return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem('garda-current-user', currentUser); } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try { localStorage.setItem('garda-theme-mode', themeMode); } catch (e) {}
  }, [themeMode]);

  const [viewerItem, setViewerItem] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'לפני דקה' },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'לפני 5 דקות' },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'לפני 10 דקות' },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'לפני 12 דקות' },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'עכשיו' }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // מנגנון חנה וסע בטוח עם טיפול מלא במצבי null ומונע מסך לבן
  const [savedCarParking, setSavedCarParking] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-car-parking');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [carNoteInput, setCarNoteInput] = useState('');
  const [carHeading, setCarHeading] = useState(0);
  const [carDistanceToWalk, setCarDistanceToWalk] = useState('0 ק"מ');
  const [carBearingToWalk, setCarBearingToWalk] = useState(0);

  useEffect(() => {
    try {
      if (savedCarParking) {
        localStorage.setItem('garda-car-parking', JSON.stringify(savedCarParking));
      } else {
        localStorage.removeItem('garda-car-parking');
      }
    } catch (e) {}
  }, [savedCarParking]);

  useEffect(() => {
    if (!savedCarParking || !myLocation || typeof myLocation.lat !== 'number' || typeof myLocation.lng !== 'number') return;
    try {
      const lat1 = myLocation.lat * (Math.PI / 180);
      const lon1 = myLocation.lng * (Math.PI / 180);
      const lat2 = savedCarParking.lat * (Math.PI / 180);
      const lon2 = savedCarParking.lng * (Math.PI / 180);

      const dLon = lon2 - lon1;
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      let brng = Math.atan2(y, x) * (180 / Math.PI);
      brng = (brng + 360) % 360;
      setCarBearingToWalk(brng);

      const { dist } = calculateDistanceAndDuration(myLocation.lat, myLocation.lng, savedCarParking.lat, savedCarParking.lng);
      setCarDistanceToWalk(dist);
    } catch (err) {
      setCarDistanceToWalk('---');
    }
  }, [myLocation, savedCarParking]);

  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.alpha !== null) setCarHeading(e.alpha);
      else if (e.webkitCompassHeading !== undefined) setCarHeading(e.webkitCompassHeading);
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  const saveCarLocationNow = () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    navigator.geolocation.getCurrentPosition(pos => {
      const newCarLoc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        note: carNoteInput || 'חניה ללא הערה',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('he-IL')
      };
      setSavedCarParking(newCarLoc);
      setCarNoteInput('');
      setModalType(null);
      alert('🔴 כפתור אדום ננעץ! מיקום הרכב נשמר בהצלחה.');
    }, () => {
      alert('❌ לא ניתן לקבוע את מיקום ה-GPS. בדוק את הרשאות המיקום.');
    });
  };

  const clearCarLocation = () => {
    if (window.confirm('למחוק את מיקום הרכב השמור?')) {
      setSavedCarParking(null);
    }
  };

  const [aroundMeQuery, setAroundMeQuery] = useState('');
  const [carCompassHeading, setCarCompassHeading] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [currentWeather, setCurrentWeather] = useState({ temp: 'טוען...', condition: '⏳ מזג אוויר' });

  // חלון גיבוי מנהל מעוצב
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');

  const handleProtectedBackup = () => {
    setAdminPassInput('');
    setBackupModalOpen(true);
  };

  const executeBackupDownload = () => {
    if (adminPassInput.trim() === "1967") {
      try {
        const componentSource = document.documentElement.outerHTML;
        const fullSourceCode = `// Garda-Mobile ${APP_VERSION} Full Backup Source Code\n// תאריך הפקה: ${new Date().toLocaleString('he-IL')}\n\n` + componentSource;
        const blob = new Blob([fullSourceCode], { type: 'text/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `garda-mobile-${APP_VERSION}-full-backup.js`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setBackupModalOpen(false);
        alert(`💾 גיבוי מלא של גרסה ${APP_VERSION} הורד בהצלחה למכשירך!`);
      } catch (err) {
        alert("❌ שגיאה בהורדת קובץ הגיבוי.");
      }
    } else {
      alert("❌ סיסמה שגויה!");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setMyLocation({ lat, lng: lon });
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await res.json();
            if (data && data.current_weather) {
              const tempVal = Math.round(data.current_weather.temperature);
              const code = data.current_weather.weathercode;
              let condIcon = '☀️ שמש';
              if (code >= 1 && code <= 3) condIcon = '🌤️ מעונן';
              else if (code >= 51 && code <= 67) condIcon = '🌧️ גשם';
              else if (code >= 71 && code <= 77) condIcon = '❄️ שלג';
              else if (code >= 95) condIcon = '⛈️ סערה';

              setCurrentWeather({ temp: `${tempVal}°C`, condition: condIcon });
            }
          } catch (e) {
            setCurrentWeather({ temp: '24°C', condition: '☀️ שמש' });
          }
        },
        () => {
          setCurrentWeather({ temp: '25°C', condition: '☀️ שמש נעימה' });
        }
      );
    }
  }, []);

  const [triviaIndex, setTriviaIndex] = useState(() => {
    try { const saved = localStorage.getItem('garda-trivia-index'); return saved ? Number(saved) : 0; } catch (e) { return 0; }
  });
  const [travelerIndex, setTravelerIndex] = useState(() => {
    try { const saved = localStorage.getItem('garda-traveler-index'); return saved ? Number(saved) : 0; } catch (e) { return 0; }
  });
  const [travelerScores, setTravelerScores] = useState(() => {
    try { const saved = localStorage.getItem('garda-traveler-scores'); return saved ? JSON.parse(saved) : { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 }; } catch (e) { return { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 }; }
  });
  const [isTriviaPaused, setIsTriviaPaused] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);

  useEffect(() => {
    try {
      localStorage.setItem('garda-trivia-index', triviaIndex);
      localStorage.setItem('garda-traveler-index', travelerIndex);
      localStorage.setItem('garda-traveler-scores', JSON.stringify(travelerScores));
    } catch (e) {}
  }, [triviaIndex, travelerIndex, travelerScores]);

  useEffect(() => {
    if (modalType !== 'trivia' || isTriviaPaused || selectedAnswer !== null) return;

    if (questionTimeLeft <= 0) {
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => prev + 1);
      setTravelerIndex(prev => (prev + 1) % TRAVELERS_LIST.length);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [modalType, isTriviaPaused, questionTimeLeft, selectedAnswer]);

  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);

  const audioCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const sendSoundAlert = async (targetName) => {
    const customMsg = prompt(`שלח הודעה וצליל אל ${targetName}:`, "נא להגיע אל נקודת המפגש!");
    if (customMsg === null) return;

    playLongChime();

    const soundAlertPayload = {
      name: targetName,
      sound_msg: customMsg || "התראה קולית מהרדאר המשפחתי!",
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };

    setActiveSoundAlert(soundAlertPayload);

    try {
      await supabase.from('family_radar').upsert([soundAlertPayload], { onConflict: 'name' });
    } catch (e) {}
  };

  const playLongChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
          } catch (err) {}
        }, idx * 200);
      });
    } catch (e) {}
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const channel = supabase.channel('family_trip_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
            triggerSirenSound();
          }
          if (payload.new.is_sound_alert && payload.new.name === currentUser) {
            setActiveSoundAlert(payload.new);
            playLongChime();
          }
        }
      })
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(channel);
      stopSirenSound();
    };
  }, [currentUser]);

  const triggerSirenSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      let freq = 300;
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);

      alarmIntervalRef.current = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);

          freq += 80;
          if (freq > 1200) freq = 300;
        } catch (e) {}
      }, 500);
    } catch (e) {}
  };

  const stopSirenSound = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const triggerSos = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    if (!window.confirm('🚨 להפעיל אזעקת חירום SOS לכל בני המשפחה?')) return;

    navigator.geolocation.getCurrentPosition(async pos => {
      const sosData = {
        name: currentUser,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        is_sos: true
      };
      setActiveSosAlert(sosData);
      triggerSirenSound();
      try {
        await supabase.from('family_radar').upsert([sosData], { onConflict: 'name' });
      } catch (e) {}
    });
  };

  const dismissSos = async () => {
    stopSirenSound();
    setActiveSosAlert(null);
    try {
      await supabase.from('family_radar').upsert([{ name: currentUser, is_sos: false }], { onConflict: 'name' });
    } catch (e) {}
  };

  const requestCompassPermission = () => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', (e) => {
            if (e.alpha !== null) setCarCompassHeading(e.alpha);
          });
          alert("🧭 גישה למצפן אושרה בהצלחה!");
        } else {
          alert("❌ גישה למצפן נדחתה.");
        }
      }).catch(() => alert("שגיאה בבקשת גישה למצפן"));
    } else {
      window.addEventListener('deviceorientation', (e) => {
        if (e.alpha !== null) setCarCompassHeading(e.alpha);
      });
      alert("🧭 מצפן הופעל!");
    }
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#060913' : '#ffffff';
  const cardBg = isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff';
  const textColor = isDark ? '#f3f4f6' : '#0f172a';
  const textSub = isDark ? '#9ca3af' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1';
  const accentGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
  const enhancedCardShadow = isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(15, 23, 42, 0.08)';

  const day = INITIAL_TRIP_DAYS[activeDay];

  useEffect(() => {
    if (!activeTimer || !activeTimer.endTime || isTimerPaused) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((activeTimer.endTime - Date.now()) / 1000));
      setTimerRemainingSec(diff);
      if (diff === 0) {
        alert(`⏱️ הזמן נגמר עבור: ${activeTimer.title}!`);
        setActiveTimer(null);
        setIsTimerPaused(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer, isTimerPaused]);

  const startTimer = (mins) => {
    const duration = Number(mins) || 10;
    const endTime = Date.now() + duration * 60 * 1000;
    setActiveTimer({ title: 'טיימר משפחתי', endTime, duration });
    setTimerRemainingSec(duration * 60);
    setIsTimerPaused(false);
    setModalType(null);
  };

  const stopTimer = () => {
    setIsTimerPaused(prev => !prev);
  };

  const resetTimer = () => {
    if (activeTimer) {
      const endTime = Date.now() + activeTimer.duration * 60 * 1000;
      setActiveTimer(prev => ({ ...prev, endTime }));
      setTimerRemainingSec(activeTimer.duration * 60);
      setIsTimerPaused(false);
    }
  };

  const formatClock = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const broadcastMyLocation = async (coords) => {
    const locObj = { name: currentUser, lat: coords.latitude, lng: coords.longitude, updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }), is_sos: false };
    setMyLocation({ lat: coords.latitude, lng: coords.longitude });
    setFamilyLocations(prev => ({ ...prev, [currentUser]: locObj }));
    try { await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' }); } catch (e) {}
  };

  const handleTriviaAnswer = (optIdx) => {
    if (isTriviaPaused || selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);
    const currentQ = ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length];
    const currentTraveler = TRAVELERS_LIST[travelerIndex];
    if (optIdx === currentQ.correct) {
      setTravelerScores(prev => ({ ...prev, [currentTraveler]: (prev[currentTraveler] || 0) + 10 }));
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => prev + 1);
      setTravelerIndex(prev => (prev + 1) % TRAVELERS_LIST.length);
    }, 1200);
  };

  const handleAdminReset = () => {
    const adminPassword = window.prompt("🔒 אזור מנהל בלבד: הזן סיסמת איפוס");
    if (adminPassword && adminPassword.trim() === "1967") {
      setTriviaIndex(0);
      setTravelerIndex(0);
      setTravelerScores({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
      setIsTriviaPaused(true);
      setQuestionTimeLeft(45);
      alert("🔄 המשחק אותחל בהצלחה על ידי המנהל (מושהה עד ללחיצה על המשך)!");
    } else if (adminPassword !== null) {
      alert("❌ סיסמה שגויה!");
    }
  };

  const handleNewGame = () => {
    if (window.confirm("🎮 להתחיל משחק חדש מאפס? (הניקוד והשאלות יתאפסו)")) {
      setTriviaIndex(0);
      setTravelerIndex(0);
      setTravelerScores({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
      setIsTriviaPaused(true);
      setQuestionTimeLeft(45);
    }
  };

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', transition: 'background 0.3s ease, color 0.3s ease' }}>
      
      {/* GLOBAL HALF-SCREEN RED SOS EMERGENCY BANNER */}
      {activeSosAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '50vh', background: 'rgba(239, 68, 68, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', color: '#fff', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '44px', marginBottom: '8px' }}>🚨</span>
          <h2 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 6px' }}>התרעת חירום SOS פעילה!</h2>
          <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>משתמש/ת: {activeSosAlert.name} זקוק/ה לעזרה מיידית!</p>
          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '16px' }}>זמן עדכון: {activeSosAlert.updated_at}</p>
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
            <a href={`https://maps.google.com/?q=${activeSosAlert.lat},${activeSosAlert.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '12px', background: '#fff', color: '#ef4444', borderRadius: '14px', fontWeight: '900', textDecoration: 'none', fontSize: '13px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              נווט למיקום 🗺️
            </a>
            <button onClick={dismissSos} style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              בטל אזעקה ✓
            </button>
          </div>
        </div>
      )}

      {/* חלון מודל גיבוי מנהל מעוצב */}
      {backupModalOpen && (
        <div onClick={() => setBackupModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '26px', borderRadius: '24px', width: '100%', maxWidth: '380px', border: `2px solid ${borderColor}`, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '32px' }}>🔒</span>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900' }}>גרסה עדכנית: v{APP_VERSION}</h3>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: textSub }}>להורדת גיבוי מקומי לחץ כאן</p>
            
            <input 
              type="password" 
              placeholder="הזן סיסמת מנהל (1967)" 
              value={adminPassInput} 
              onChange={e => setAdminPassInput(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '14px', border: `1.5px solid ${borderColor}`, background: isDark ? '#0b0f19' : '#f8fafc', color: textColor, outline: 'none', fontSize: '14px', textAlign: 'center', boxSizing: 'border-box', fontWeight: 'bold' }} 
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button 
                onClick={executeBackupDownload} 
                style={{ flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
              >
                לחץ
              </button>
              <button 
                onClick={() => setBackupModalOpen(false)} 
                style={{ flex: 1, padding: '12px', background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INCOMING SOUND & MESSAGE ALERT BANNER */}
      {activeSoundAlert && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', background: '#2563eb', zIndex: 9998, borderRadius: '22px', padding: '18px', textAlign: 'center', color: '#fff', boxShadow: '0 15px 40px rgba(37, 99, 235, 0.4)', boxSizing: 'border-box', border: '2px solid rgba(255,255,255,0.3)' }}>
          <span style={{ fontSize: '32px' }}>🔔</span>
          <h3 style={{ margin: '6px 0', fontSize: '16px', fontWeight: '900' }}>התראה קולית התקבלה!</h3>
          <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '800', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
            "{activeSoundAlert.sound_msg}"
          </p>
          <span style={{ fontSize: '11px', opacity: 0.85, display: 'block', marginBottom: '12px' }}>נשלח על ידי: {activeSoundAlert.name} ({activeSoundAlert.updated_at})</span>
          <button onClick={() => setActiveSoundAlert(null)} style={{ padding: '8px 22px', background: '#fff', color: '#2563eb', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}>
            אישור והסרה ✓
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <header style={{ background: isDark ? 'rgba(11, 15, 25, 0.9)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: `1.5px solid ${borderColor}`, padding: '12px 16px 14px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: isDark ? '#1e293b' : '#f8fafc', color: textColor, border: `1.5px solid ${borderColor}`, width: '38px', height: '38px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
              ☰
            </button>
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button 
              onClick={handleProtectedBackup}
              style={{
                background: 'transparent',
                border: 'none',
                color: textColor,
                fontSize: '15px',
                fontWeight: '900',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
              title={`לחץ להורדת גיבוי קוד מלא (גרסה ${APP_VERSION})`}
            >
              garda-mobile
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: isOnline ? '#22c55e' : '#f59e0b' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b', display: 'inline-block' }}></span>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1.2fr', gap: '8px', alignItems: 'center' }}>
          <button onClick={triggerSos} style={{ height: '38px', padding: '0 10px', borderRadius: '12px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
            <span>🚨</span> SOS חירום
          </button>

          <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ height: '38px', padding: '0 10px', borderRadius: '12px', background: '#38bdf8', color: '#0f172a', textDecoration: 'none', fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)' }}>
            {WAZE_SVG} למלון Vojon
          </a>

          <div style={{ height: '38px', padding: '0 10px', borderRadius: '12px', background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#f8fafc', color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '800', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }} title="מזג אוויר מותאם לפי מיקום המכשיר">
            <span>{currentWeather.condition.split(' ')[0]}</span>
            <span>{currentWeather.temp}</span>
          </div>
        </div>

      </header>

      {activeTimer && (
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '13px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' }}>
          <span onClick={() => setModalType('timer')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⏱️ טיימר {isTimerPaused ? '(מושהה)' : 'פועל'}: <span style={{ fontFamily: 'monospace', fontSize: '15px' }}>{formatClock(timerRemainingSec)}</span>
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={stopTimer} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
              {isTimerPaused ? '▶️ המשך' : '⏸️ עצור'}
            </button>
            <button onClick={resetTimer} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
              🔄 איפוס
            </button>
            <button onClick={() => { setActiveTimer(null); setIsTimerPaused(false); }} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>
      )}

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2500, backdropFilter: 'blur(8px)', transition: 'opacity 0.3s ease' }} />}
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '315px', background: isDark ? 'rgba(11, 15, 25, 0.98)' : 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(25px)', zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', overflowY: 'auto', borderLeft: `1px solid ${borderColor}`, boxShadow: isDark ? '-15px 0 40px rgba(0,0,0,0.7)' : '-15px 0 40px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)' }}>
              🇮🇹
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', letterSpacing: '-0.01em' }}>תפריט הטיול</h3>
              <span style={{ fontSize: '11px', color: textSub, fontWeight: '700' }}>גארדה ואזור הטיול ({APP_VERSION})</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: isDark ? '#1e293b' : '#f1f5f9', border: `1px solid ${borderColor}`, color: isDark ? '#f8fafc' : '#1e293b', width: '34px', height: '34px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>✕</button>
        </div>

        <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', border: '1.5px solid rgba(59, 130, 246, 0.3)', padding: '12px', borderRadius: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6', display: 'block', marginBottom: '6px' }}>👤 מי משתמש בטלפון הזה?</label>
          <select 
            value={currentUser} 
            onChange={e => setCurrentUser(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '10px', background: isDark ? '#1e293b' : '#ffffff', color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '14px', outline: 'none' }}
          >
            {TRAVELERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <p style={{ fontSize: '10px', color: textSub, margin: '6px 0 0', lineHeight: '1.4' }}>בחר את השם שלך כדי שתוכל לעדכן את מיקומך למשפחה.</p>
        </div>

        <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: isDark ? '#1e293b' : '#f8fafc', border: `1.5px solid ${borderColor}`, color: textColor, padding: '12px 16px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span>{isDark ? 'מצב תצוגה: כהה' : 'מצב תצוגה: בהיר'}</span>
          <span style={{ fontSize: '16px' }}>{isDark ? '🌙' : '☀️'}</span>
        </button>

        <div style={categoryGroupStyle(isDark, borderColor)}>
          <div style={categoryTitleStyle('#3b82f6')}>
            <span>📍</span> ניווט ראשי
          </div>
          <button onClick={() => { setSidebarOpen(false); setActiveDay(activeDay); setModalType(null); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>📅</span> מסלול ימי הטיול
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🧭</span> רדאר משפחתי חי
          </button>
        </div>

        <div style={categoryGroupStyle(isDark, borderColor)}>
          <div style={categoryTitleStyle('#f59e0b')}>
            <span>📍</span> סביבי (בקרבת מקום)
          </div>
          <button onClick={() => { setSidebarOpen(false); setModalType('around-me'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>📍</span> סביבי (Around Me)
          </button>
        </div>

        <div style={categoryGroupStyle(isDark, borderColor)}>
          <div style={categoryTitleStyle('#10b981')}>
            <span>⚡</span> כלים ושימושי
          </div>
          <button onClick={() => { setSidebarOpen(false); setModalType('timer'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>⏱️</span> טיימר משפחתי
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🚗</span> שמירת מיקום רכב חכם
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🧠</span> טריויה משפחתית
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🎟️</span> ארנק כרטיסים ומסמכים
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderTop: `1px solid ${borderColor}` }}>
          <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={{ ...menuBtnStyle(isDark, textColor), background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <span style={{ fontSize: '16px' }}>🆘</span> מספרי חירום ושגרירות
          </button>
        </div>

      </aside>

      {/* Main Container */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '22px', scrollbarWidth: 'none' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => {
            const isActive = activeDay === i;
            return (
              <button 
                key={i} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDay(i);
                }} 
                style={{ 
                  flex: '1 0 auto', 
                  padding: '12px 18px', 
                  borderRadius: '20px', 
                  background: isActive ? '#0f172a' : (isDark ? '#111827' : '#ffffff'), 
                  color: isActive ? '#ffffff' : textColor, 
                  border: `1.5px solid ${isActive ? '#0f172a' : borderColor}`, 
                  fontSize: '13px', 
                  fontWeight: '800', 
                  cursor: 'pointer', 
                  boxShadow: isActive ? '0 6px 16px rgba(15, 23, 42, 0.25)' : '0 2px 8px rgba(0,0,0,0.03)', 
                  transition: 'all 0.2s ease' 
                }}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Active Day Content */}
        <div style={{ marginBottom: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', padding: '0 4px' }}>
            <span style={{ fontSize: '32px' }}>{day.icon}</span>
            <div>
              <small style={{ color: '#2563eb', fontWeight: '800', fontSize: '11px', letterSpacing: '0.02em' }}>{day.date}</small>
              <button 
                onClick={() => setModalType('route-map')}
                style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'right', cursor: 'pointer' }}
                title="לחץ לפתיחת מפת ניווט מהמיקום שלך ליעד עם הערכת זמן ומרחק"
              >
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-0.01em', color: textColor, transition: 'color 0.2s' }}>
                  {day.title} 📍
                </h2>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setModalType('daily-tasks')}
            style={{ 
              width: '100%', 
              background: '#0f172a', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '16px', 
              padding: '16px 20px', 
              fontWeight: '900', 
              fontSize: '14px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '20px', 
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>✨</span>
              <span>משימות והמלצות היום</span>
            </div>
            <span style={{ fontSize: '14px', opacity: 0.85 }}>פתח ➔</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={{ background: cardBg, borderRadius: '20px', padding: '18px', border: `2px solid ${borderColor}`, boxShadow: enhancedCardShadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: textColor }}>{stop.name}</h4>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: textSub, background: isDark ? '#1e293b' : '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: `1.5px solid ${borderColor}` }}>{stop.time}</span>
                </div>
                <p style={{ margin: '0 0 14px', fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{stop.note}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ background: isDark ? '#1e293b' : '#ffffff', color: textColor, padding: '10px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', textAlign: 'center', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>{MAPS_SVG} Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '10px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}>{WAZE_SVG} Waze</a>
                </div>
              </div>
            ))}
          </div>

        </div>

      </main>

      {viewerItem && (
        <div onClick={() => setViewerItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '24px', width: '100%', maxWidth: '400px', border: `2px solid ${borderColor}`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '36px' }}>🎟️</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>{viewerItem.title}</h3>
            <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '14px', borderRadius: '14px', border: `1.5px solid ${borderColor}`, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: textSub }}>קטגוריה: {viewerItem.folder}</span>
              {viewerItem.ticketCode && <span style={{ fontSize: '14px', fontWeight: '900', color: textColor, fontFamily: 'monospace' }}>🔑 קוד כרטיס: {viewerItem.ticketCode}</span>}
              {viewerItem.trans && <span style={{ fontSize: '13px', fontWeight: '800', color: textSub }}>📋 קוד טרנזקציה: {viewerItem.trans}</span>}
              {viewerItem.desc && <span style={{ fontSize: '13px', fontWeight: '700', color: textColor }}>ℹ️ פרטים: {viewerItem.desc}</span>}
              {viewerItem.passenger && <span style={{ fontSize: '13px', fontWeight: '900', color: '#2563eb' }}>👤 נוסע: {viewerItem.passenger}</span>}
              {viewerItem.ticketNo && <span style={{ fontSize: '13px', fontWeight: '900', color: textColor, fontFamily: 'monospace' }}>🎫 מספר כרטיס: {viewerItem.ticketNo}</span>}
            </div>
            {viewerItem.isLink ? (
              <a href={viewerItem.url} target="_blank" rel="noreferrer" style={{ padding: '12px', background: '#2563eb', color: '#fff', borderRadius: '14px', fontWeight: '900', textDecoration: 'none', fontSize: '14px', display: 'block' }}>
                פתח קובץ PDF 📄
              </a>
            ) : null}
            <button onClick={() => setViewerItem(null)} style={{ padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>
              סגור ✓
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {modalType && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bgMain, color: textColor, padding: 0, borderRadius: 0, width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none', overflowY: 'auto', border: 'none', boxShadow: 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', flexShrink: 0, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10050, background: isDark ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(20px)', borderBottom: `1.5px solid ${borderColor}`, boxSizing: 'border-box', minHeight: '76px' }}>
              <button onClick={() => setModalType(null)} style={{ background: isDark ? '#1e293b' : '#f1f5f9', border: `1.5px solid ${borderColor}`, color: textColor, width: '42px', height: '42px', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 }}>✕</button>
              
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '900', textAlign: 'center', flex: 1, padding: '0 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {modalType === 'radar' && '📡 רדאר משפחתי חי ומופת האגם'}
                {modalType === 'route-map' && `🗺️ ניווט ליעד: ${day.title}`}
                {modalType === 'daily-tasks' && `✨ משימות והמלצות: ${day.title}`}
                {modalType === 'around-me' && '📍 סביבי (Around Me)'}
                {modalType === 'timer' && '⏱️ טיימר משפחתי'}
                {modalType === 'parking' && '🚗 Car Finder Pro - שמירת מיקום רכב'}
                {modalType === 'trivia' && '🧠 טריויה משפחתית'}
                {modalType === 'tickets' && '🎟️ ארנק כרטיסים ומסמכים'}
                {modalType === 'emergency' && '🆘 מספרי חירום ושגרירות'}
              </h2>

              {modalType === 'trivia' ? (
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => setIsTriviaPaused(prev => !prev)} style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {isTriviaPaused ? '▶️ המשך' : '⏸️ השהה'}
                  </button>
                  <button onClick={handleAdminReset} style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
                    🔒 איפוס
                  </button>
                </div>
              ) : <div style={{ width: '42px', flexShrink: 0 }} />}
            </div>

            {modalType === 'route-map' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '75px' }}>
                <div style={{ width: '100%', flex: 1, minHeight: '80vh', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <iframe title="Route Map" srcDoc={generateRouteMapHTML(myLocation, activeDay, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
              </div>
            )}

            {modalType === 'daily-tasks' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 20px 30px', boxSizing: 'border-box', overflowY: 'auto', gap: '20px', background: bgMain }}>
                
                <div style={{ background: cardBg, border: `2px solid ${borderColor}`, borderRadius: '20px', padding: '20px', boxShadow: enhancedCardShadow }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🎯</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#2563eb' }}>אתגר משפחתי להיום</h3>
                  </div>
                  <p style={{ margin: '0 0 6px', fontWeight: '900', fontSize: '15px', color: textColor }}>{day.challenge}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{day.challengeDesc}</p>
                </div>

                <div style={{ background: cardBg, border: `2px solid ${borderColor}`, borderRadius: '20px', padding: '20px', boxShadow: enhancedCardShadow }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🍝</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#d97706' }}>המלצה קולינרית (פסטה, פיצה, גלידה)</h3>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '900', color: textColor }}>{day.culinary.name}</p>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{day.culinary.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(day.culinary.dest)}`} target="_blank" rel="noreferrer" style={{ background: isDark ? '#1e293b' : '#f8fafc', color: textColor, padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '13px', textAlign: 'center', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{MAPS_SVG} Google Maps</a>
                    <a href={`https://www.waze.com/ul?q=${encodeURIComponent(day.culinary.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{WAZE_SVG} Waze</a>
                  </div>
                </div>

                <div style={{ background: cardBg, border: `2px solid ${borderColor}`, borderRadius: '20px', padding: '20px', boxShadow: enhancedCardShadow }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🎨</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#10b981' }}>תחנת יצירה וחוויות</h3>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '900', color: textColor }}>{day.creative.name}</p>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{day.creative.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(day.creative.dest)}`} target="_blank" rel="noreferrer" style={{ background: isDark ? '#1e293b' : '#f8fafc', color: textColor, padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '13px', textAlign: 'center', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{MAPS_SVG} Google Maps</a>
                    <a href={`https://www.waze.com/ul?q=${encodeURIComponent(day.creative.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{WAZE_SVG} Waze</a>
                  </div>
                </div>

              </div>
            )}

            {modalType === 'around-me' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '16px', background: bgMain }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(aroundMeQuery)}`} target="_blank" rel="noreferrer" style={{ padding: '14px 24px', background: accentGradient, color: '#fff', borderRadius: '16px', fontWeight: '900', textDecoration: 'none', fontSize: '14px', textAlign: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)' }}>
                    חפש
                  </a>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, borderRadius: '16px', padding: '0 14px', boxShadow: enhancedCardShadow }}>
                    <input type="text" placeholder="" value={aroundMeQuery} onChange={e => setAroundMeQuery(e.target.value)} style={{ width: '100%', padding: '14px 0', border: 'none', background: 'transparent', color: textColor, outline: 'none', fontSize: '16px', fontWeight: '800' }} />
                    <span style={{ fontSize: '18px', cursor: 'pointer' }}>🎙️</span>
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: '800', color: textSub, margin: '4px 0 0' }}>או בחר קטגוריה מהירה לחיפוש במפה:</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="https://www.google.com/maps/search/?api=1&query=Autogrill" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '18px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: '#d97706', fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>☕</span> עצרת דרך / Autogrill & שירותים
                  </a>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <a href="https://www.google.com/maps/search/?api=1&query=pharmacy" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>💊</span> פארם
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=gas+station" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>⛽</span> תחנת דלק
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=gelateria" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🍦</span> גלידריה
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=pizza" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🍕</span> פיצה
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=restaurant" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🍲</span> מסעדות
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=supermarket" target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: enhancedCardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🛒</span> סופרמרקט
                    </a>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'radar' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '85px' }}>
                <div style={{ width: '100%', flex: 1, minHeight: '60vh', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <iframe title="Map" srcDoc={generateMapHTML(familyLocations, myLocation, activeSosAlert, activeDay, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
                
                <div style={{ background: isDark ? 'rgba(11, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(15px)', padding: '12px 16px 20px', borderTop: `1.5px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: textSub }}>מיקומי כל בני המשפחה:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                    {Object.values(familyLocations).map((person, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#ffffff', padding: '8px 12px', borderRadius: '12px', border: `1.5px solid ${borderColor}`, boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>👤</span>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '900', color: textColor }}>{person.name}</div>
                            <div style={{ fontSize: '9px', color: textSub }}>עודכן: {person.updated_at || 'עכשיו'}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => sendSoundAlert(person.name)} style={{ background: isDark ? '#1e293b' : '#f8fafc', color: textColor, border: `1.5px solid ${borderColor}`, padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                            🔔 צליל
                          </button>
                          <a href={`https://maps.google.com/?q=${person.lat},${person.lng}`} target="_blank" rel="noreferrer" style={{ background: accentGradient, color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            Directions 🧭
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => navigator.geolocation.getCurrentPosition(pos => broadcastMyLocation(pos.coords))} style={{ flex: 1, padding: '12px', background: accentGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>📍 עדכן מיקום יום</button>
                    <button onClick={() => alert('🔄 המיקומים עודכנו בהצלחה!')} style={{ flex: 1, padding: '12px', background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>🔄 רענן מיקומים</button>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'timer' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '16px', background: bgMain }}>
                <p style={{ fontSize: '14px', fontWeight: '800', color: textSub, margin: 0 }}>בחר משך זמן מהיר לטיימר:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
                  <button onClick={() => startTimer(5)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⚡ 5 דקות</button>
                  <button onClick={() => startTimer(15)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏳ 15 דקות</button>
                  <button onClick={() => startTimer(30)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏳ 30 דקות</button>
                  <button onClick={() => startTimer(45)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏳ 45 דקות</button>
                  <button onClick={() => startTimer(60)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏰ 60 דקות (שעה)</button>
                </div>

                {activeTimer && (
                  <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: '10px' }}>
                    <button onClick={stopTimer} style={{ flex: 1, padding: '14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>
                      {isTimerPaused ? '▶️ המשך' : '⏸️ עצור'}
                    </button>
                    <button onClick={resetTimer} style={{ flex: 1, padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>
                      🔄 איפוס
                    </button>
                  </div>
                )}
              </div>
            )}

            {modalType === 'trivia' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '14px', background: bgMain }}>
                {isTriviaPaused && (
                  <div style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, padding: '12px 16px', borderRadius: '14px', textAlign: 'center', fontWeight: '900', fontSize: '13px' }}>
                    ⏸️ המשחק מושהה (לחץ למעלה על "המשך" כדי להפעיל את הזמן)
                  </div>
                )}

                <div style={{ background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '8px', height: '8px', width: '100%', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ background: questionTimeLeft <= 10 ? '#ef4444' : '#3b82f6', width: `${(questionTimeLeft / 45) * 100}%`, transition: 'width 1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: textSub, marginTop: '-6px' }}>
                  <span>⏳ זמן נותר לשאלה:</span>
                  <span style={{ color: questionTimeLeft <= 10 ? '#ef4444' : '#3b82f6' }}>{questionTimeLeft} שניות</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '46px', background: isDark ? '#1e293b' : '#ffffff', padding: '0 14px', borderRadius: '14px', border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: textColor, boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <span>תורו של:</span> <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>{TRAVELERS_LIST[travelerIndex]}</span>
                  </div>
                  <button onClick={handleNewGame} style={{ flex: 1, height: '46px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, padding: '0 14px', borderRadius: '14px', fontSize: '13px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    משחק חדש
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {TRAVELERS_LIST.map((t, tIdx) => {
                    const isCurrent = tIdx === travelerIndex;
                    return (
                      <div key={tIdx} style={{ background: isCurrent ? (isDark ? '#334155' : '#e2e8f0') : (isDark ? '#1e293b' : '#ffffff'), color: textColor, padding: '10px 4px', borderRadius: '12px', textAlign: 'center', border: `1.5px solid ${isCurrent ? '#64748b' : borderColor}`, boxShadow: isCurrent ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.03)', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '12px', fontWeight: '900', marginBottom: '2px' }}>{t}</div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: textSub }}>{travelerScores[t] || 0} נק'</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid rgba(59, 130, 246, 0.3)', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)' }}>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: textColor }}>
                    (שאלה #{ (triviaIndex % ROAD_TRIVIA_QUESTIONS.length) + 1 }) {ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length].q}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length].options.map((opt, oIdx) => {
                    const currentQ = ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length];
                    let btnBg = isDark ? '#1e293b' : '#ffffff';
                    let btnColor = textColor;
                    let btnBorder = borderColor;
                    if (selectedAnswer !== null) {
                      if (oIdx === currentQ.correct) {
                        btnBg = '#10b981'; btnColor = '#fff'; btnBorder = '#10b981';
                      } else if (oIdx === selectedAnswer) {
                        btnBg = '#ef4444'; btnColor = '#fff'; btnBorder = '#ef4444';
                      }
                    }
                    return (
                      <button key={oIdx} onClick={() => handleTriviaAnswer(oIdx)} style={{ width: '100%', height: '48px', borderRadius: '14px', background: btnBg, color: btnColor, border: `1.5px solid ${btnBorder}`, fontWeight: '900', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {modalType === 'tickets' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '12px', background: bgMain }}>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {folders.map((f, idx) => {
                    const isActiveFolder = activeFolder === f;
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setActiveFolder(f)} 
                        style={{ 
                          padding: '10px 14px', 
                          borderRadius: '12px', 
                          background: isActiveFolder ? '#0f172a' : (isDark ? '#1e293b' : '#f1f5f9'), 
                          color: isActiveFolder ? '#ffffff' : textColor, 
                          border: `1.5px solid ${isActiveFolder ? '#0f172a' : borderColor}`, 
                          fontWeight: '800', 
                          fontSize: '12px', 
                          cursor: 'pointer', 
                          whiteSpace: 'nowrap',
                          boxShadow: isActiveFolder ? '0 4px 12px rgba(15, 23, 42, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ticketFiles.filter(d => d.folder === activeFolder).map((doc, dIdx) => (
                    <div key={dIdx} onClick={() => setViewerItem(doc)} style={{ background: isDark ? 'rgba(11, 15, 25, 0.4)' : '#ffffff', padding: '16px', borderRadius: '16px', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: enhancedCardShadow }}>
                      <span style={{ fontSize: '14px', fontWeight: '800' }}>📄 {doc.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalType === 'emergency' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '10px', background: bgMain }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <a href="tel:112" style={emergencyBtnStyle}>🚨 חירום כללי: 112</a>
                  <a href="tel:118" style={emergencyBtnStyle}>🚑 אמבולנס: 118</a>
                  <a href="tel:113" style={emergencyBtnStyle}>👮 משטרה: 113</a>
                  <a href="tel:115" style={emergencyBtnStyle}>🚒 כיבוי אש: 115</a>
                </div>
                <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', border: `1.5px solid rgba(59, 130, 246, 0.3)`, padding: '16px', borderRadius: '16px', marginTop: '6px', boxShadow: enhancedCardShadow }}>
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#3b82f6' }}>🇮🇱 שגרירות ישראל באיטליה (רומא)</strong>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: textSub }}>כתובת: Via Michele Mercati 12, 00197 Roma</p>
                  <a href="tel:+3906361981" style={{ display: 'block', padding: '12px', background: '#3b82f6', color: '#fff', textAlign: 'center', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '14px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>📞 חיוג לשגרירות: +39 06 361981</a>
                </div>
              </div>
            )}

            {modalType === 'parking' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '95px 16px 16px', boxSizing: 'border-box', overflow: 'hidden', gap: '10px', background: bgMain }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: isDark ? '#1e293b' : '#ffffff', color: textColor, borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '900', fontSize: '12px', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    🏡 למלון Vojon
                  </a>
                  <a href={`https://maps.google.com/?q=${savedCarParking ? `${savedCarParking.lat},${savedCarParking.lng}` : HOTEL_ADDRESS}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: '#1e3a8a', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}>
                    🚗 לרכב החונה
                  </a>
                </div>

                {!savedCarParking ? (
                  <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `1.5px solid ${borderColor}`, borderRadius: '20px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: enhancedCardShadow, marginTop: '10px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '26px' }}>
                      🚗
                    </div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: textColor }}>חנית את הרכב?</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: textSub }}>לחץ על הכפתור האדום לשמירת מיקום ה-GPS המדויק.</p>
                    
                    <input 
                      type="text" 
                      placeholder="הוסף הערה (למשל: קומה 2, ליד עמוד B4)" 
                      value={carNoteInput} 
                      onChange={e => setCarNoteInput(e.target.value)} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: `1.5px solid ${borderColor}`, background: isDark ? '#0b0f19' : '#f8fafc', color: textColor, outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} 
                    />

                    <button 
                      onClick={saveCarLocationNow}
                      style={{ width: '100%', padding: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '0 6px 16px rgba(239, 68, 68, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <span>🔴</span> נָעץ מיקום חניה עכשיו
                    </button>
                  </div>
                ) : (
                  <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff', border: `2px solid #ef4444`, borderRadius: '20px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', boxShadow: enhancedCardShadow, marginTop: '10px' }}>
                    <span style={{ background: '#ef4444', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900' }}>נשמר ב-{savedCarParking.time} ({savedCarParking.date})</span>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: textColor }}>{savedCarParking.note}</h4>

                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `2.5px solid #ef4444`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: isDark ? '#0b0f19' : '#f8fafc', margin: '4px 0' }}>
                      <div style={{ position: 'absolute', top: '4px', fontSize: '9px', fontWeight: '900', color: '#ef4444' }}>צפון</div>
                      <div style={{ width: '40px', height: '40px', transform: `rotate(${carBearingToWalk - carHeading}deg)`, transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '28px' }}>🚗⬆️</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#10b981' }}>
                      מרחק הליכה: {carDistanceToWalk}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                      <a href={`https://maps.google.com/?q=${savedCarParking.lat},${savedCarParking.lng}`} target="_blank" rel="noreferrer" style={{ padding: '10px', background: accentGradient, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center' }}>
                        נווט ב-Google 🗺️
                      </a>
                      <button onClick={clearCarLocation} style={{ padding: '10px', background: isDark ? '#1e293b' : '#f1f5f9', color: '#ef4444', border: `1.5px solid ${borderColor}`, borderRadius: '10px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}>
                        אפס חניה 🗑️
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

const categoryGroupStyle = (isDark, borderColor) => ({
  background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
  border: `1.5px solid ${borderColor}`,
  borderRadius: '16px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
});

const categoryTitleStyle = (accentColor) => ({
  fontSize: '11px',
  fontWeight: '900',
  color: accentColor,
  paddingRight: '6px',
  marginBottom: '2px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  letterSpacing: '0.02em'
});

const menuBtnStyle = (isDark, textColor) => ({
  background: 'transparent',
  border: 'none',
  color: textColor,
  padding: '10px 12px',
  borderRadius: '12px',
  textAlign: 'right',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  transition: 'all 0.2s ease'
});

const timerPresetBtn = {
  padding: '16px',
  borderRadius: '14px',
  background: 'rgba(59, 130, 246, 0.1)',
  color: '#3b82f6',
  border: '1.5px solid rgba(59, 130, 246, 0.3)',
  fontWeight: '900',
  fontSize: '15px',
  cursor: 'pointer',
  textAlign: 'center'
};

const emergencyBtnStyle = {
  padding: '14px',
  borderRadius: '14px',
  background: '#fee2e2',
  color: '#ef4444',
  fontWeight: '800',
  fontSize: '13px',
  textAlign: 'center',
  textDecoration: 'none',
  border: '1.5px solid #fecaca',
  boxSizing: 'border-box'
};
