import React, { useState, useEffect, useRef } from 'react';
import html2canvas from "html2canvas";
import { 
  Heart, MapPin, Coffee, Dog, Download, ArrowRight, Sparkles, Check, 
  Mountain, Waves, Camera, Image as ImageIcon, ArrowLeft, Lock, Moon,
  Volume2, VolumeX
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('loading'); 
  const [yesTime, setYesTime] = useState(null);
  
  // Transition State
  const [isFading, setIsFading] = useState(false);
  const [displayView, setDisplayView] = useState('loading');

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // Admin State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 1. Check for permanently saved time on load
  useEffect(() => {
    const savedTime = localStorage.getItem('meghna_proposal_time');
    if (savedTime) {
      setYesTime(savedTime);
    }
  }, []);

  // Audio Playback Handler - Reacts to state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Waiting for user interaction to play audio."));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Loading Screen Timer
  useEffect(() => {
    if (currentView === 'loading') {
      const timer = setTimeout(() => {
        navigateTo('home');
      }, 5500); // 5.5 seconds for the beautiful typing effect
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // Global styles for animations, scrollbars, print, cursors, and gradients
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Custom Heart Cursors */
      body {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='%23f9a8d4' stroke='%23be185d' stroke-width='2'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>") 11 11, auto;
      }
      button, a, input, .cursor-pointer {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='%23f43f5e' stroke='%23ffffff' stroke-width='2'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>") 13 13, pointer !important;
      }

      /* Animated Background Gradient */
      @keyframes gradient-xy {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .animate-gradient-xy {
        background-size: 200% 200%;
        animation: gradient-xy 5s ease infinite;
      }

      /* Core Animations */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
      
      @keyframes slowFadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-slow-fade { animation: slowFadeIn 2s ease-in-out forwards; }

      @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
      .animate-heartbeat { animation: heartbeat 1.5s infinite; }
      
      @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } }
      .animate-float { animation: float 6s ease-in-out infinite; }
      
      @keyframes float-up { 0% { transform: translateY(100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; } }

      /* Walking Paws Animation */
      @keyframes paw-appear {
        0% { opacity: 0; transform: scale(0.5) translateY(10px); }
        20% { opacity: 1; transform: scale(1) translateY(0); }
        80% { opacity: 1; transform: scale(1) translateY(0); }
        100% { opacity: 0; transform: scale(0.5) translateY(-10px); }
      }
      .animate-paw { animation: paw-appear 3s infinite; }

      /* Rose Petal Falling Animation */
      @keyframes petal-fall {
        0% { transform: translateY(-10vh) rotateX(0deg) rotateY(0deg) rotateZ(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh) rotateX(360deg) rotateY(180deg) rotateZ(180deg); opacity: 0; }
      }

      /* Gallery Grid */
      .masonry-grid { column-count: 1; column-gap: 1rem; }
      @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
      @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
      .masonry-item { break-inside: avoid; margin-bottom: 1rem; }

      /* Custom scrollbars for mobile certificate and final view */
      .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #fdf2f8; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #f43f5e; border-radius: 10px; border: 2px solid #fdf2f8; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e11d48; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Smooth Page Transition Logic
  const navigateTo = (view) => {
    setIsFading(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setCurrentView(view);
      setDisplayView(view);
      setIsFading(false);
    }, 400); // 400ms fade transition
  };

  // Function to lock the time permanently in the browser
  const lockTimeForever = (time) => {
    localStorage.setItem('meghna_proposal_time', time);
    setYesTime(time);
    navigateTo('certificate');
  };

  // Function to unlock and delete the time (Admin only)
  const unlockTime = () => {
    if (adminPassword === 'sakshamlovesmeghna') {
      localStorage.removeItem('meghna_proposal_time');
      setYesTime(null);
      setShowAdminModal(false);
      setAdminPassword('');
      navigateTo('home');
      alert("Time unlocked and reset! You can start over.");
    } else {
      alert("Wrong password!");
      setAdminPassword('');
    }
  };

  // -------------------------------------------------------------
  // VIEW ROUTING
  // -------------------------------------------------------------
  if (displayView === 'loading') {
    return <LoadingScreen onComplete={() => navigateTo('home')} />;
  }

  // Determine if we should show floating elements
  const showFloatingEffects = ['home', 'family', 'gallery', 'journey'].includes(displayView);
  const showPetals = ['confirm', 'certificate', 'final'].includes(displayView);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 text-rose-900 font-sans selection:bg-pink-300 selection:text-white flex flex-col items-center pt-10 pb-4 px-2 sm:px-4 overflow-hidden">
      
      {/* Background Audio Player (Hidden) */}
      <audio 
        ref={audioRef} 
        src="bg-music.mp3" 
        loop 
        className="hidden"
      />

      {/* Music Toggle Button (Bottom Left) */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl border border-pink-200 text-rose-500 hover:scale-110 transition-transform flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[100px] transition-all duration-300 ease-in-out font-bold text-sm">
          {isPlaying ? 'Music On' : 'Music Off'}
        </span>
      </button>

      {/* Romantic Header */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-2.5 z-40 text-xs sm:text-sm md:text-base tracking-widest font-bold shadow-md">
        <span className="inline-block animate-pulse">Saksham is missing you... 💖</span>
      </div>

      {showFloatingEffects && <BackgroundEffects />}
      {showPetals && <PetalEffects />}

      {/* Main Content Area with Fade Transition */}
      <div className={`relative z-10 w-full flex flex-col items-center justify-center min-h-[90vh] transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {displayView === 'home' && (
          <HomeView 
            onNext={() => {
              // FORCED PLAYBACK ON FIRST CLICK
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => setIsPlaying(true))
                  .catch(e => console.log("Audio play failed:", e));
              }
              navigateTo('family');
            }} 
          />
        )}
        
        {displayView === 'family' && <FamilyView onNext={() => navigateTo('gallery')} onBack={() => navigateTo('home')} />}
        {displayView === 'gallery' && <GalleryView onNext={() => navigateTo('journey')} onBack={() => navigateTo('family')} />}
        {displayView === 'journey' && <JourneyView onNext={() => navigateTo('proposal')} onBack={() => navigateTo('gallery')} />}
        
        {displayView === 'proposal' && (
          <ProposalView 
            isLocked={!!yesTime}
            savedTime={yesTime}
            onViewCertificate={() => navigateTo('certificate')}
            onYes={(time) => {
              setYesTime(time);
              navigateTo('confirm');
            }} 
          />
        )}
        
        {displayView === 'confirm' && (
          <ConfirmTimeView 
            time={yesTime} 
            onConfirm={() => lockTimeForever(yesTime)} 
            onCancel={() => {
              setYesTime(null);
              navigateTo('proposal');
            }} 
          />
        )}
        
        {displayView === 'certificate' && <CertificateView time={yesTime} onNext={() => navigateTo('final')} />}
        {displayView === 'final' && <FinalView />}

      </div>

      {/* HIDDEN ADMIN BUTTON - Invisible square in the absolute bottom right corner */}
      <div 
        className="fixed bottom-0 right-0 w-20 h-20 z-50 opacity-0"
        onDoubleClick={() => setShowAdminModal(true)}
      />

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-fade-in border-4 border-rose-200">
            <h3 className="text-2xl font-bold text-rose-800 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" /> Admin Reset
            </h3>
            <p className="text-sm text-gray-600 mb-6 font-medium">Enter the secret password to unlock the saved time and start over.</p>
            <input 
              type="password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl mb-6 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all font-bold tracking-widest text-center"
              placeholder="••••••••"
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowAdminModal(false)}
                className="px-5 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all w-full cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={unlockTime}
                className="px-6 py-3 font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-md transition-all w-full cursor-pointer"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// LOADING SCREEN COMPONENT (Soft Pink, Typewriter & Paws)
// -------------------------------------------------------------
function LoadingScreen({ onComplete }) {
  const [text, setText] = useState('');
  const [fullText, setFullText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const phrases = [
    "Meghna, my love...\nJust thinking about you.",
    "Je t'aime plus que tout...\n(I love you more than anything...)",
    "Eres el amor de mi vida...\n(You are the love of my life...)",
    "Tu es mon âme sœur...\n(You are my soulmate...)",
    "Siempre pienso en ti...\n(Always thinking about you...)",
    "Waiting for the perfect moment...\nJust for you."
  ];

  // Pick random phrase on mount
  useEffect(() => {
    setFullText(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!fullText) return;
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 60); 
    return () => clearInterval(interval);
  }, [fullText]);

  // Progress Bar & Timer
  useEffect(() => {
    const duration = 5000; 
    const interval = 50;
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      
      if (elapsed >= duration - 500) {
        setIsFadingOut(true);
      }
      if (elapsed >= duration) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-100 to-pink-100 animate-gradient-xy flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      
      <WalkingPaws />

      <div className="text-5xl text-rose-300 mb-8 font-serif opacity-80 animate-pulse z-10">ॐ</div>
      
      {/* Animated Loader Graphic (Soft Pink) */}
      <div className="relative mb-10 flex items-center justify-center z-10">
        <Heart className="w-20 h-20 text-rose-500 animate-heartbeat fill-rose-500 drop-shadow-lg" />
        <div className="absolute -inset-6 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
        <div className="absolute -inset-10 border-2 border-pink-200 border-b-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
      </div>
      
      {/* Typewriter Text */}
      <h1 className="text-2xl md:text-4xl font-serif text-rose-800 font-bold tracking-wide text-center px-6 leading-relaxed drop-shadow-sm min-h-[120px] whitespace-pre-line z-10">
        {text}<span className="animate-pulse font-light text-rose-400">|</span>
      </h1>

      {/* Progress Bar (Pink) */}
      <div className="absolute bottom-24 w-64 md:w-96 h-2 bg-rose-200/50 rounded-full overflow-hidden shadow-inner z-10">
        <div 
          className="h-full bg-rose-500 rounded-full transition-all duration-75 ease-linear shadow-[0_0_12px_rgba(244,63,94,0.6)] relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 w-4 h-full bg-white animate-ping opacity-50"></div>
        </div>
      </div>
      
      <p className="absolute bottom-14 text-rose-500/80 text-xs md:text-sm tracking-[0.3em] uppercase font-bold animate-pulse z-10">
        Loading our memories...
      </p>
    </div>
  );
}

// --- WALKING PAWS ANIMATION ---
function WalkingPaws() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {/* Trail 1: Diagonal Top Left to Bottom Right */}
      <div className="absolute top-[10%] left-[10%] -rotate-45 text-rose-400 animate-paw" style={{ animationDelay: '0s' }}><Dog className="w-8 h-8" /></div>
      <div className="absolute top-[15%] left-[15%] -rotate-45 text-rose-400 animate-paw" style={{ animationDelay: '0.4s' }}><Dog className="w-8 h-8" /></div>
      <div className="absolute top-[20%] left-[20%] -rotate-45 text-rose-400 animate-paw" style={{ animationDelay: '0.8s' }}><Dog className="w-8 h-8" /></div>
      <div className="absolute top-[25%] left-[25%] -rotate-45 text-rose-400 animate-paw" style={{ animationDelay: '1.2s' }}><Dog className="w-8 h-8" /></div>

      {/* Trail 2: Bottom Right curve */}
      <div className="absolute bottom-[25%] right-[10%] rotate-45 text-rose-400 animate-paw" style={{ animationDelay: '1.5s' }}><Dog className="w-10 h-10" /></div>
      <div className="absolute bottom-[20%] right-[15%] rotate-12 text-rose-400 animate-paw" style={{ animationDelay: '1.9s' }}><Dog className="w-10 h-10" /></div>
      <div className="absolute bottom-[10%] right-[12%] -rotate-12 text-rose-400 animate-paw" style={{ animationDelay: '2.3s' }}><Dog className="w-10 h-10" /></div>
    </div>
  );
}

// --- BACKGROUND EFFECTS ---
function BackgroundEffects() {
  const elements = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${10 + Math.random() * 15}s`,
    animationDelay: `${Math.random() * 5}s`,
    isDog: i % 3 === 0 
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      {elements.map((el) => (
        <div 
          key={el.id}
          className="absolute bottom-0 text-pink-300 flex items-center justify-center"
          style={{
            left: el.left,
            animation: `float-up ${el.animationDuration} linear infinite`,
            animationDelay: el.animationDelay,
            fontSize: `${1 + Math.random() * 1.5}rem`
          }}
        >
          {el.isDog ? '🐾' : '💖'}
        </div>
      ))}
    </div>
  );
}

// --- PETAL/CONFETTI EFFECTS (Pink Theme Only) ---
function PetalEffects() {
  const petalColors = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#e11d48'];
  
  const confettiPieces = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 3}s`,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    size: `${10 + Math.random() * 15}px`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {confettiPieces.map((c) => (
        <div 
          key={c.id}
          className="absolute top-0 opacity-90 shadow-sm"
          style={{
            left: c.left,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: '50% 0 50% 0', // This makes it look like a real leaf/petal!
            animation: `petal-fall ${c.animationDuration} linear infinite`,
            animationDelay: c.animationDelay,
          }}
        />
      ))}
    </div>
  );
}

// --- VIEWS ---

function HomeView({ onNext }) {
  return (
    <div className="animate-fade-in text-center max-w-2xl mx-auto flex flex-col items-center justify-center py-10 mt-10">
      <div className="text-4xl md:text-5xl text-rose-400 mb-8 font-serif opacity-80">ॐ</div>
      <div className="relative mb-10">
        <Heart className="w-24 h-24 md:w-32 md:h-32 text-rose-500 animate-heartbeat mx-auto fill-rose-500 drop-shadow-xl" />
        <Dog className="w-10 h-10 md:w-12 md:h-12 text-pink-700 absolute -bottom-2 -right-4 animate-float" />
      </div>
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-500 mb-6 tracking-tight drop-shadow-sm px-4">
        Meghna & Saksham
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-rose-600 mb-12 italic font-light px-6 max-w-lg mx-auto">
        With the blessings of Mahadev, our forever begins here...
      </p>
      <button 
        onClick={onNext}
        className="group cursor-pointer relative inline-flex items-center justify-center px-10 py-5 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-xl hover:shadow-pink-400/50 hover:scale-105 transition-all duration-300 overflow-hidden w-full max-w-[280px] sm:max-w-xs"
      >
        <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:animate-pulse"></span>
        <span className="relative flex items-center gap-3">
          Open Our Story <ArrowRight className="w-6 h-6" />
        </span>
      </button>
    </div>
  );
}

function FamilyView({ onNext, onBack }) {
  const familyMembers = [
    { type: "The Fluffy Boy", name: "Charlie", desc: "The one who is the most possessive", image: "dog1.jpg", color: "from-amber-50 to-orange-100" },
    { type: "The Dark Princess", name: "Bhairavi", desc: "Your beautiful affectionate princess.", image: "dog2.jpg", color: "from-gray-100 to-gray-200" },
    { type: "The Good Boy", name: "Scooby", desc: "Your dog that still scares from me.", image: "dog3.jpg", color: "from-orange-50 to-amber-200" },
    { type: "The Bike Chaser", name: "Tinguuu", desc: "The one that used to scare me initially but now I love him.", image: "dog4.jpg", color: "from-stone-50 to-yellow-100" },
    { type: "My Cutie", name: "Simbaa", desc: "Yeh toh baccha hai mera", image: "dog5.jpg", color: "from-orange-50 to-amber-100" },
  ];
  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto py-10 px-2 sm:px-4">
      <div className="text-center mb-12 mt-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-4 flex justify-center items-center gap-3 px-2">
          <Dog className="w-8 h-8 md:w-10 md:h-10 text-rose-500 flex-shrink-0" /> 
          Our Fur Babies 
          <Dog className="w-8 h-8 md:w-10 md:h-10 text-rose-500 flex-shrink-0" />
        </h2>
        <p className="text-lg md:text-xl text-rose-600 italic">Because it's a family of 7 now!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 px-4">
        {familyMembers.map((dog, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${dog.color} p-6 rounded-3xl shadow-xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group`}>
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-inner mb-4 bg-white/50 flex items-center justify-center relative">
               <img 
                 src={dog.image} 
                 alt={dog.type}
                 className="w-full h-full object-cover absolute inset-0 z-10"
                 onError={(e) => { e.target.style.display = 'none'; }} 
               />
               <Dog className="w-10 h-10 md:w-12 md:h-12 text-rose-300 absolute z-0" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{dog.type}</h3>
            <span className="text-xs md:text-sm font-bold text-rose-500 uppercase tracking-widest mb-3">{dog.name}</span>
            <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">{dog.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 w-full max-w-md mx-auto sm:max-w-none">
        <button onClick={onBack} className="cursor-pointer w-full sm:w-auto justify-center px-8 py-4 font-bold text-rose-700 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors border-2 border-rose-200 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={onNext} className="cursor-pointer w-full sm:w-auto justify-center px-8 py-4 font-bold text-white bg-rose-500 rounded-full shadow-lg hover:bg-rose-600 transition-all flex items-center gap-2">
          Our Memories <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function GalleryView({ onNext, onBack }) {
  const potentialPhotos = Array.from({ length: 20 }, (_, i) => `photo${i + 1}.jpg`);

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto py-10 px-4">
      <div className="text-center mb-8 mt-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-4 flex justify-center items-center gap-3">
          <Camera className="w-8 h-8 md:w-10 md:h-10 text-rose-500" /> 
          Our Gallery 
          <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-rose-500" />
        </h2>
        <p className="text-lg md:text-xl text-rose-600 mb-6">A collection of our beautiful moments together.</p>
      </div>

      <div className="masonry-grid mb-12 px-2 md:px-6">
        {potentialPhotos.map((src, idx) => (
          <img 
            key={`local-${idx}`} 
            src={src} 
            alt={`Memory ${idx + 1}`}
            className="masonry-item w-full rounded-2xl shadow-lg border-4 border-white hover:scale-[1.02] transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 w-full max-w-md mx-auto sm:max-w-none">
        <button onClick={onBack} className="cursor-pointer w-full sm:w-auto justify-center px-8 py-4 font-bold text-rose-700 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors border-2 border-rose-200 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Fur Babies
        </button>
        <button onClick={onNext} className="cursor-pointer w-full sm:w-auto justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
          Our Journey <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function JourneyView({ onNext, onBack }) {
  const journeySteps = [
    {
      icon: <Dog className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />,
      title: "Rescuing Love",
      desc: "It all started with saving some little paws. Rescuing those puppies didn't just save them, it brought our worlds together. Seeing your heart for them made me fall for you."
    },
    {
      icon: <Coffee className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />,
      title: "Coffee & Conversations",
      desc: "Then came the long talks and exploring every new coffee place we could find. With every sip of coffee and every shared laugh, I knew you were the one."
    },
    {
      icon: <Moon className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />,
      title: "Late Night Cravings",
      desc: "Taking you to late night coffee, maggi, and idli dosa dates... I loved every single moment I spent with you. Simple moments became my absolute favorite memories."
    },
    {
      icon: <Mountain className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />,
      title: "Kedarnath Diaries",
      desc: "Our spiritual journey to Kedarnath. Under the blessings of Mahadev (ॐ), the freezing cold breeze, the majestic peaks... everything was perfect because I held your hand."
    },
    {
      icon: <Waves className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />,
      title: "The Holy Ganga Dupki",
      desc: "Taking that holy dip together in the Ganga. It felt like a cleansing of our souls and an unspoken promise that no matter what, we face life's currents together."
    }
  ];

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto py-10 px-2 sm:px-6">
      <div className="text-center mb-16 mt-8">
        <div className="text-3xl md:text-4xl text-rose-400 mb-4 font-serif opacity-80">ॐ नमः शिवाय</div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 px-4">The Path That Led Us Here</h2>
      </div>
      
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[1.75rem] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1.5 before:bg-gradient-to-b before:from-rose-300 before:via-pink-500 before:to-rose-300 before:rounded-full px-2">
        {journeySteps.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white bg-pink-100 text-rose-500 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transform group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3.5rem)] p-5 md:p-8 rounded-3xl border-2 border-white bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white/95 transition-all duration-300 ml-4 md:ml-0">
              <h3 className="font-serif font-bold text-xl md:text-2xl text-rose-800 mb-3">{step.title}</h3>
              <p className="text-rose-900/90 leading-relaxed text-sm md:text-base font-medium">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-20 px-4 w-full max-w-md mx-auto sm:max-w-none">
        <button onClick={onBack} className="cursor-pointer w-full sm:w-auto justify-center px-8 py-4 font-bold text-rose-700 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors border-2 border-rose-200 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Gallery
        </button>
        <button 
          onClick={onNext}
          className="cursor-pointer w-full sm:w-auto justify-center inline-flex items-center gap-2 px-10 py-4 font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 rounded-full shadow-2xl hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300"
        >
          The Big Question <Heart className="w-5 h-5 fill-white animate-pulse" />
        </button>
      </div>
    </div>
  );
}

function ProposalView({ onYes, isLocked, savedTime, onViewCertificate }) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  
  if (isLocked) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-10 w-full max-w-xl mx-auto">
        <Lock className="w-20 h-20 text-rose-500 mb-6 drop-shadow-md" />
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-6 leading-tight">You Already Said YES!</h2>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-pink-200 mb-8 w-full shadow-inner">
          <p className="text-lg md:text-xl text-rose-700 font-medium mb-2">This moment was officially locked in on:</p>
          <span className="font-bold text-rose-900 text-xl md:text-2xl font-serif block">{savedTime}</span>
        </div>
        <button onClick={onViewCertificate} className="cursor-pointer w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-all">
          View Our Certificate
        </button>
      </div>
    );
  }

  const getNoButtonText = () => {
    const phrases = [
      "No", "Are you absolutely sure?", "Please say yes Meghna!", "Think about the dogs!", 
      "They need their parents together!", "Don't do this to Saksham!", "You're breaking my heart ;(", 
      "I'm gonna cry...", "It won't work anyway, say yes!"
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    // Button dodges the mouse randomly, kept within mobile bounds
    setNoPosition({ 
      x: (Math.random() - 0.5) * (window.innerWidth < 600 ? 150 : 250), 
      y: (Math.random() - 0.5) * (window.innerWidth < 600 ? 150 : 250) 
    });
  };

  const handleYesClick = () => {
    const now = new Date();
    const timeString = now.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    onYes(timeString);
  };

  const yesButtonSize = Math.min(window.innerWidth < 600 ? 1.6 : 2.2, 1 + noCount * 0.18);

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[85vh] w-full text-center px-4 mt-8 overflow-hidden">
      <div className="mb-10 relative">
        <img 
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2JiZDRqZ3JzN29jcnV6eHpwZXg5MnUyeHhjY2Y4cWF0d24yMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/MDJ9IbxxvDUQM/giphy.gif" 
          alt="Cute pleading cat" 
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover rounded-full mx-auto mb-8 shadow-2xl border-8 border-white z-10 relative"
        />
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-rose-800 leading-tight drop-shadow-sm px-2">
          Meghna, will you be <br/> my wife forever?
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full relative z-20 min-h-[250px] px-4">
        <button
          onClick={handleYesClick}
          style={{ transform: `scale(${yesButtonSize})`, zIndex: 50 }}
          className="cursor-pointer px-12 py-5 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white text-2xl font-bold rounded-full shadow-2xl transition-all duration-300 hover:shadow-rose-500/50 hover:bg-rose-700 border-2 border-white/20 w-full md:w-auto"
        >
          YES! 💍💖
        </button>

        <button
          onClick={handleNoClick}
          onMouseEnter={handleNoClick}
          style={{ 
            transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
            position: noCount > 0 ? 'absolute' : 'relative',
            zIndex: 40
          }}
          className="cursor-pointer px-8 py-4 bg-white text-rose-500 text-lg font-semibold rounded-full shadow-md border-2 border-rose-200 transition-all duration-200 hover:bg-gray-50 whitespace-nowrap"
        >
          {getNoButtonText()}
        </button>
      </div>
    </div>
  );
}

function ConfirmTimeView({ time, onConfirm, onCancel }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] text-center px-4 max-w-2xl mx-auto w-full">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-pink-200 relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-rose-400 to-pink-500 animate-gradient-xy"></div>
        <Lock className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-rose-800 mb-6">Lock This Moment?</h2>
        <div className="bg-pink-50 p-6 rounded-2xl mb-8 border border-pink-100">
          <p className="text-lg md:text-xl text-gray-700 mb-2 font-medium">You said YES at exactly:</p>
          <span className="font-bold text-rose-700 block text-2xl md:text-3xl font-serif">{time}</span>
        </div>
        <p className="text-sm md:text-base text-gray-500 mb-10 italic px-2">
          Locking this time will stamp it permanently onto your certificate. Even if you refresh the website or change devices, it will remember this exact moment forever.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onCancel}
            className="cursor-pointer w-full sm:w-auto px-8 py-4 font-bold text-rose-600 bg-white rounded-full border-2 border-rose-200 hover:bg-rose-50 transition-all text-lg"
          >
            Wait, go back
          </button>
          <button 
            onClick={onConfirm}
            className="cursor-pointer w-full sm:w-auto px-8 py-4 font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Lock className="w-5 h-5" /> Stamp it Forever!
          </button>
        </div>
      </div>
    </div>
  );
}

function CertificateView({ time, onNext }) {

  const [isSaving, setIsSaving] = useState(false);

  // Directly captures the live DOM element without buggy cloning!
  const printCertificate = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    const element = document.getElementById("certificate-area");
    
    try {
      // html2canvas natively supports capturing scrollable elements directly
      const canvas = await html2canvas(element, {
        scale: 2, 
        backgroundColor: "#fffaf5",
        useCORS: true,
        logging: false
      });
      
      const imageURL = canvas.toDataURL("image/jpeg", 0.95);
      
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "Agreement_of_Forever.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Oops! Had trouble saving the image. Please take a screenshot instead!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col items-center w-full max-w-[100vw] px-0 md:px-4 py-10 mt-4 md:mt-10 overflow-hidden">
      
      <div className="no-print text-center mb-8 px-4 w-full">
        <div className="text-2xl md:text-3xl text-rose-400 mb-3 font-serif">ॐ</div>
        <h2 className="text-3xl md:text-4xl font-bold text-rose-700 flex items-center justify-center gap-3 mb-4 flex-wrap">
          <Sparkles className="w-8 h-8 text-yellow-500 flex-shrink-0" /> 
          MEGHNA SAID YES! 
          <Sparkles className="w-8 h-8 text-yellow-500 flex-shrink-0" />
        </h2>
        <p className="text-rose-600 text-lg font-medium">A monumental moment in history. Save this certificate forever.</p>
        
        {/* Mobile Swipe Hint */}
        <div className="md:hidden mt-6 bg-pink-100/80 border border-pink-200 text-pink-700 py-3 px-4 rounded-xl shadow-inner text-sm font-bold flex items-center justify-center gap-2 animate-pulse mx-auto max-w-xs">
          <ArrowLeft className="w-4 h-4" /> Swipe to see full certificate <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* The Wrapper that enables mobile swiping */}
      <div id="certificate-wrapper" className="w-full overflow-x-auto custom-scrollbar pb-6 px-4 md:px-0">
        
        {/* The Certificate itself. Forced to be at least 800px wide so it always renders identically for the image */}
        <div 
          id="certificate-area" 
          className="min-w-[800px] max-w-5xl w-full bg-[#fffaf5] p-12 md:p-16 border-[16px] border-double border-rose-200 shadow-xl relative rounded-sm mx-auto"
        >
          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 text-pink-200"><Heart className="w-12 h-12 fill-pink-100" /></div>
          <div className="absolute top-8 right-8 text-pink-200"><Heart className="w-12 h-12 fill-pink-100" /></div>
          <div className="absolute bottom-8 left-8 text-pink-200"><Dog className="w-12 h-12 fill-pink-100" /></div>
          <div className="absolute bottom-8 right-8 text-pink-200"><Dog className="w-12 h-12 fill-pink-100" /></div>
          
          <div className="absolute top-10 left-0 w-full flex justify-center opacity-[0.15] pointer-events-none">
             <div className="text-[10rem] font-serif text-rose-400">ॐ</div>
          </div>

          <div className="text-center space-y-12 relative z-10 pt-4">
            
            <div className="inline-block">
              <h1 className="text-5xl md:text-6xl font-serif text-rose-900 tracking-widest uppercase border-b-4 border-rose-300 pb-5">
                Agreement of Forever
              </h1>
              <p className="text-sm tracking-widest text-rose-500 uppercase mt-4 font-bold">Official Record of Eternal Love</p>
            </div>
            
            <div className="py-10 space-y-8">
              <p className="text-2xl text-gray-700 italic font-serif">This document officially certifies that</p>
              <h2 className="text-5xl font-bold text-rose-700 font-serif border-b-2 border-dashed border-rose-300 inline-block pb-3 px-12">
                Meghna Kantak
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 italic font-serif leading-relaxed px-12 max-w-3xl mx-auto">
                has agreed to tolerate, love, and annoy <br/>
                <span className="font-bold text-rose-800 text-3xl md:text-4xl mt-3 mb-1 inline-block">Saksham Talwar</span> <br/>
                and co-parent all our 5 furry babies for the rest of her natural life.
              </p>
            </div>

            <div className="bg-pink-50 p-8 rounded-2xl max-w-md mx-auto border-2 border-rose-100 shadow-inner">
              <p className="text-rose-900 font-bold uppercase tracking-widest text-sm flex justify-center items-center gap-2">
                <Lock className="w-4 h-4" /> Officially Sealed On:
              </p>
              <p className="text-2xl md:text-3xl font-bold text-rose-800 mt-4 font-serif">{time || 'Now'}</p>
            </div>

            <div className="pt-16 flex justify-between items-end px-12 pb-4">
              <div className="text-center w-48">
                <div className="border-b-2 border-rose-500 mb-3 pb-3 h-20 flex items-end justify-center">
                  <span className="font-serif text-4xl text-rose-900 italic">Saksham</span>
                </div>
                <p className="text-sm text-gray-600 uppercase tracking-widest font-bold">Saksham Talwar</p>
              </div>
              
              {/* Seal */}
              <div className="w-32 h-32 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center border-4 border-rose-200 shadow-2xl transform rotate-12 relative mx-4">
                 <div className="absolute inset-2 border-2 border-dashed border-white/70 rounded-full"></div>
                 <span className="text-white font-serif text-4xl font-bold italic drop-shadow-md">S & M</span>
              </div>

              <div className="text-center w-48">
                <div className="border-b-2 border-rose-500 mb-3 pb-3 h-20 flex items-end justify-center">
                  <span className="font-serif text-4xl text-rose-900 italic">Meghna</span>
                </div>
                <p className="text-sm text-gray-600 uppercase tracking-widest font-bold">Meghna Kantak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mt-10 flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-2xl px-4">
        <button 
          onClick={printCertificate}
          disabled={isSaving}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-white text-rose-700 font-bold text-lg rounded-full shadow-lg hover:bg-rose-50 hover:-translate-y-1 transition-all border-2 border-rose-200 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isSaving ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <><Download className="w-6 h-6" /> Save Image</>
          )}
        </button>
        <button 
          onClick={onNext}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          One Last Surprise <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function FinalView() {
  const [inputValue, setInputValue] = useState('');
  const [isMarried, setIsMarried] = useState(false);
  const scrollRef = useRef(null);
  const ilyArray = Array.from({ length: 999 }, (_, i) => i + 1);

  // Auto Scroll Effect
  useEffect(() => {
    if (scrollRef.current && !isMarried) {
      const interval = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += 1.5;
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isMarried]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.toLowerCase().trim() === 'ily') {
      setTimeout(() => setIsMarried(true), 400); 
    }
  };

  if (isMarried) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center min-h-[90vh] w-full px-4 relative z-20 mt-10 py-10">
        <WalkingPaws />
        <div className="text-6xl md:text-7xl text-rose-500 mb-8 font-serif opacity-80 animate-pulse">ॐ</div>
        <div className="relative mb-12">
          <Heart className="w-40 h-40 md:w-56 md:h-56 text-rose-600 fill-rose-600 animate-heartbeat mx-auto drop-shadow-2xl" />
          <div className="absolute top-0 left-0 w-full h-full animate-ping opacity-60">
             <Heart className="w-40 h-40 md:w-56 md:h-56 text-pink-400 fill-pink-400 mx-auto" />
          </div>
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 mb-8 drop-shadow-lg px-2">
          WE ARE FOREVER!
        </h1>
        <div className="border-t-2 border-b-2 border-rose-200 py-10 px-4 w-full max-w-4xl bg-white/40 backdrop-blur-sm rounded-3xl z-10">
          <p className="text-2xl md:text-4xl text-rose-900 leading-relaxed font-serif italic">
            1000 times I love you, and a million more to go. Thank you for making me the happiest man, and making our 5 furry babies a complete family. <br/><br/> Our forever begins right now. 💖🐾
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-4xl flex flex-col items-center py-10 px-4 mt-10">
      <h2 className="text-4xl md:text-6xl font-serif font-bold text-rose-900 text-center mb-6">
        Just One Last Thing, Meghna...
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-rose-700 text-center max-w-3xl mb-12 leading-relaxed font-medium px-4">
        I wanted to prove how much I love you. So I started counting...
      </p>

      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-rose-200 rounded-3xl p-6 md:p-8 shadow-2xl mb-12 relative">
        <div 
          ref={scrollRef}
          className="h-80 md:h-96 overflow-y-auto pr-2 md:pr-4 custom-scrollbar text-center text-rose-600 space-y-3 font-medium text-lg sm:text-xl md:text-2xl"
        >
          {ilyArray.map(num => (
            <div key={num} className="opacity-90">{num}. I love you</div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent rounded-b-3xl pointer-events-none"></div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-2 border-rose-200 text-center w-full max-w-xl transform hover:-translate-y-2 transition-transform duration-300">
        <p className="text-rose-900 font-bold text-2xl md:text-3xl mb-8">Complete the 1000th:</p>
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type it here..."
            className="w-full px-6 py-5 md:px-8 md:py-6 bg-pink-50 border-4 border-rose-300 rounded-2xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all text-center text-2xl md:text-3xl text-rose-800 font-bold placeholder-pink-300 uppercase tracking-widest shadow-inner cursor-text"
          />
          {inputValue.toLowerCase().trim() === 'ily' && (
             <Check className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-green-500 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
          )}
        </div>
        <p className="text-base md:text-lg text-rose-500 mt-6 italic font-bold px-2">
          Hint: Just type those 3 magical letters (ily)
        </p>
      </div>
    </div>
  );
}


