import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Coffee, Dog, Download, ArrowRight, Sparkles, Check, Mountain, Waves, Camera, Image as ImageIcon, ArrowLeft, Lock, Moon } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('loading'); 
  const [yesTime, setYesTime] = useState(null);
  
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

  // Loading Screen Timer
  useEffect(() => {
    if (currentView === 'loading') {
      const timer = setTimeout(() => {
        setCurrentView('home');
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // Global styles for animations and print
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
      
      @keyframes slowFadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-slow-fade { animation: slowFadeIn 2s ease-in-out forwards; }

      @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
      .animate-heartbeat { animation: heartbeat 1.5s infinite; }
      
      @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } }
      .animate-float { animation: float 6s ease-in-out infinite; }
      
      @keyframes float-up { 0% { transform: translateY(100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; } }

      .masonry-grid { column-count: 1; column-gap: 1rem; }
      @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
      @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
      .masonry-item { break-inside: avoid; margin-bottom: 1rem; }

            @media print {
        @page { size: portrait; margin: 10mm; }
        body { background-color: white !important; margin: 0; padding: 0; }
        body * { visibility: hidden; }
        #certificate-area, #certificate-area * { visibility: visible; }
        #certificate-area { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100%; 
          margin: 0; 
          padding: 20px; 
          page-break-inside: avoid;
          break-inside: avoid;
          transform: scale(0.85); /* Shrinks it slightly to fit perfectly on 1 page */
          transform-origin: top center;
        }
        .no-print { display: none !important; }
      }

    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navigateTo = (view) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  // 2. Function to lock the time permanently in the browser
  const lockTimeForever = (time) => {
    localStorage.setItem('meghna_proposal_time', time);
    setYesTime(time);
    navigateTo('certificate');
  };

  // 3. Function to unlock and delete the time (Admin only)
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

  if (currentView === 'loading') {
    return (
      <div className="fixed inset-0 bg-rose-900 flex flex-col items-center justify-center z-50 animate-slow-fade">
        <div className="text-5xl text-rose-300 mb-6 font-serif opacity-90 animate-pulse">ॐ</div>
        <Heart className="w-16 h-16 text-rose-300 animate-heartbeat fill-rose-300 mb-6" />
        <h1 className="text-3xl md:text-5xl font-serif text-rose-100 font-light tracking-wider text-center px-4 leading-relaxed">
          Meghna, my love... <br/> Just thinking about you.
        </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 text-rose-900 font-sans selection:bg-pink-300 selection:text-white flex flex-col items-center pt-10 pb-4 px-4 overflow-hidden">
      
      {/* Romantic Header */}
      <div className="fixed top-0 left-0 w-full bg-rose-500 text-white text-center py-2 z-40 text-sm md:text-base tracking-widest font-medium shadow-md">
        <span className="inline-block animate-pulse">Saksham is missing you... 💖</span>
      </div>

      <BackgroundEffects />

      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[90vh]">
        {currentView === 'home' && <HomeView onNext={() => navigateTo('family')} />}
        {currentView === 'family' && <FamilyView onNext={() => navigateTo('gallery')} onBack={() => navigateTo('home')} />}
        {currentView === 'gallery' && <GalleryView onNext={() => navigateTo('journey')} onBack={() => navigateTo('family')} />}
        {currentView === 'journey' && <JourneyView onNext={() => navigateTo('proposal')} onBack={() => navigateTo('gallery')} />}
        
        {currentView === 'proposal' && (
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
        
        {currentView === 'confirm' && (
          <ConfirmTimeView 
            time={yesTime} 
            onConfirm={() => lockTimeForever(yesTime)} 
            onCancel={() => {
              setYesTime(null);
              navigateTo('proposal');
            }} 
          />
        )}
        
        {currentView === 'certificate' && <CertificateView time={yesTime} onNext={() => navigateTo('final')} />}
        {currentView === 'final' && <FinalView />}
      </div>

      {/* HIDDEN ADMIN BUTTON - Invisible square in the absolute bottom right corner */}
      <div 
        className="fixed bottom-0 right-0 w-16 h-16 z-50 cursor-default opacity-0"
        onDoubleClick={() => setShowAdminModal(true)}
      />

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-fade-in">
            <h3 className="text-2xl font-bold text-rose-800 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" /> Admin Reset
            </h3>
            <p className="text-sm text-gray-600 mb-6">Enter the secret password to unlock the saved time and start over.</p>
            <input 
              type="password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl mb-6 focus:outline-none focus:border-rose-500"
              placeholder="Enter password..."
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowAdminModal(false)}
                className="px-5 py-2 font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={unlockTime}
                className="px-6 py-2 font-bold text-white bg-rose-600 rounded-full hover:bg-rose-700 shadow-md transition-all"
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

// --- VIEWS ---
function HomeView({ onNext }) {
  return (
    <div className="animate-fade-in text-center max-w-2xl mx-auto flex flex-col items-center justify-center py-10 mt-10">
      <div className="text-4xl text-rose-400 mb-6 font-serif opacity-80">ॐ</div>
      <div className="relative mb-8">
        <Heart className="w-24 h-24 text-rose-500 animate-heartbeat mx-auto fill-rose-500 drop-shadow-xl" />
        <Dog className="w-10 h-10 text-pink-700 absolute -bottom-2 -right-4 animate-float" />
      </div>
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-500 mb-6 tracking-tight drop-shadow-sm">
        Meghna & Saksham
      </h1>
      <p className="text-xl md:text-2xl text-rose-600 mb-12 italic font-light">
        With the blessings of Mahadev, our forever begins here...
      </p>
      <button 
        onClick={onNext}
        className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-xl hover:shadow-pink-400/50 hover:scale-105 transition-all duration-300 overflow-hidden"
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
    { type: "The Fluffy Boy", name: "Charlie", desc: "The one who is the most prosessive", image: "dog1.jpg", color: "from-amber-50 to-orange-100" },
    { type: "The Dark Princess", name: "Bhairavi", desc: "Your beautiful affectionate princess.", image: "dog2.jpg", color: "from-gray-100 to-gray-200" },
    { type: "The Good Boy", name: "Scooby", desc: "Your dog that still scares from me.", image: "dog3.jpg", color: "from-orange-50 to-amber-200" },
    { type: "The Bike Chaser", name: "Tinguuu", desc: "the one that used to scare me initially but now I love him.", image: "dog4.jpg", color: "from-stone-50 to-yellow-100" },
    { type: "My Cutie ", name: "Simbaa", desc: "yeh toh baccha hai mera", image: "dog5.jpg", color: "from-orange-50 to-amber-100" },
  ];
  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto py-10 px-4">
      <div className="text-center mb-12 mt-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-4 flex justify-center items-center gap-3">
          <Dog className="w-10 h-10 text-rose-500" /> Our Fur Babies <Dog className="w-10 h-10 text-rose-500" />
        </h2>
        <p className="text-xl text-rose-600 italic">Because it's a family of 7 now!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {familyMembers.map((dog, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${dog.color} p-6 rounded-3xl shadow-xl border-4 border-white transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group`}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-inner mb-4 bg-white/50 flex items-center justify-center relative">
               <img 
                 src={dog.image} 
                 alt={dog.type}
                 className="w-full h-full object-cover absolute inset-0 z-10"
                 onError={(e) => { e.target.style.display = 'none'; }} 
               />
               <Dog className="w-12 h-12 text-rose-300 absolute z-0" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{dog.type}</h3>
            <span className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-3">{dog.name}</span>
            <p className="text-gray-700 font-medium">{dog.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="px-6 py-3 font-bold text-rose-700 bg-white/80 rounded-full shadow hover:bg-white transition-colors border border-rose-200 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={onNext} className="px-8 py-3 font-bold text-white bg-rose-500 rounded-full shadow-lg hover:bg-rose-600 transition-all flex items-center gap-2">
          Our Memories <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function GalleryView({ onNext, onBack }) {
  const potentialPhotos = Array.from({ length: 20 }, (_, i) => `photo${i + 1}.jpg`);
  const fallbackPhotos = [
    

  ];

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto py-10 px-4">
      <div className="text-center mb-8 mt-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-4 flex justify-center items-center gap-3">
          <Camera className="w-10 h-10 text-rose-500" /> Our Gallery <ImageIcon className="w-10 h-10 text-rose-500" />
        </h2>
        <p className="text-lg text-rose-600 mb-6">A collection of our beautiful moments together.</p>
      </div>

      <div className="masonry-grid mb-12">
        {potentialPhotos.map((src, idx) => (
          <img 
            key={`local-${idx}`} 
            src={src} 
            alt={`Memory ${idx + 1}`}
            className="masonry-item w-full rounded-2xl shadow-lg border-4 border-white hover:scale-[1.02] transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        ))}
        {fallbackPhotos.map((src, idx) => (
          <img 
            key={`fallback-${idx}`} 
            src={src} 
            alt={`Memory fallback ${idx + 1}`}
            className="masonry-item w-full rounded-2xl shadow-lg border-4 border-white hover:scale-[1.02] transition-transform duration-300 opacity-50 grayscale"
          />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="px-6 py-3 font-bold text-rose-700 bg-white/80 rounded-full shadow hover:bg-white transition-colors border border-rose-200 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Fur Babies
        </button>
        <button onClick={onNext} className="px-8 py-3 font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
          Our Journey <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function JourneyView({ onNext, onBack }) {
  const journeySteps = [
    {
      icon: <Dog className="w-8 h-8 text-rose-500" />,
      title: "Rescuing Love",
      desc: "It all started with saving some little paws. Rescuing those puppies didn't just save them, it brought our worlds together. Seeing your heart for them made me fall for you."
    },
    {
      icon: <Coffee className="w-8 h-8 text-rose-500" />,
      title: "Coffee & Conversations",
      desc: "Then came the long talks and exploring every new coffee place we could find. With every sip of coffee and every shared laugh, I knew you were the one."
    },
    {
      icon: <Moon className="w-8 h-8 text-rose-500" />,
      title: "Late Night Cravings",
      desc: "Taking you to late night coffee, maggi, and idli dosa dates... I loved every single moment I spent with you. Simple moments became my absolute favorite memories."
    },
    {
      icon: <Mountain className="w-8 h-8 text-rose-500" />,
      title: "Kedarnath Diaries",
      desc: "Our spiritual journey to Kedarnath. Under the blessings of Mahadev (ॐ), the freezing cold breeze, the majestic peaks... everything was perfect because I held your hand."
    },
    {
      icon: <Waves className="w-8 h-8 text-rose-500" />,
      title: "The Holy Ganga Dupki",
      desc: "Taking that holy dip together in the Ganga. It felt like a cleansing of our souls and an unspoken promise that no matter what, we face life's currents together."
    }
  ];

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-12 mt-8">
        <div className="text-3xl text-rose-400 mb-2 font-serif opacity-80">ॐ नमः शिवाय</div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800">The Path That Led Us Here</h2>
      </div>
      
      <div className="space-y-10 relative before:absolute before:inset-0 before:ml-6 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1.5 before:bg-gradient-to-b before:from-rose-300 before:via-pink-500 before:to-rose-300 before:rounded-full">
        {journeySteps.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white bg-pink-100 text-rose-500 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transform group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3.5rem)] p-6 rounded-3xl border-2 border-white bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white/95 transition-all duration-300">
              <h3 className="font-serif font-bold text-2xl text-rose-800 mb-2">{step.title}</h3>
              <p className="text-rose-900/90 leading-relaxed text-base md:text-lg font-medium">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-16">
        <button onClick={onBack} className="px-6 py-3 font-bold text-rose-700 bg-white/80 rounded-full shadow hover:bg-white transition-colors border border-rose-200 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Gallery
        </button>
        <button 
          onClick={onNext}
          className="inline-flex items-center gap-2 px-10 py-4 font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 rounded-full shadow-2xl hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300"
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
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Lock className="w-20 h-20 text-rose-500 mb-6" />
        <h2 className="text-4xl font-serif font-bold text-rose-800 mb-4">You Already Said YES!</h2>
        <p className="text-xl text-rose-600 mb-8 font-medium">This moment was officially locked in on: <br/><br/> <span className="font-bold">{savedTime}</span></p>
        <button 
          onClick={onViewCertificate}
          className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-all"
        >
          View Our Certificate
        </button>
      </div>
    );
  }

  const getNoButtonText = () => {
    const phrases = [
      "No", 
      "Are you absolutely sure?", 
      "Please say yes Meghna!", 
      "Think about the dogs!", 
      "They need their parents together!",
      "Don't do this to Saksham!", 
      "You're breaking my heart ;(", 
      "I'm gonna cry...",
      "It won't work anyway, say yes!"
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    // Button dodges the mouse randomly
    setNoPosition({
      x: (Math.random() - 0.5) * 250,
      y: (Math.random() - 0.5) * 250
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

  // Grow the Yes button massively every time No is clicked
  const yesButtonSize = 1 + (noCount * 0.4);

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[85vh] w-full text-center px-4 mt-8 overflow-hidden">
      <div className="mb-10 relative">
        <img 
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2JiZDRqZ3JzN29jcnV6eHpwZXg5MnUyeHhjY2Y4cWF0d24yMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/MDJ9IbxxvDUQM/giphy.gif" 
          alt="Cute pleading cat" 
          className="w-64 h-64 object-cover rounded-full mx-auto mb-8 shadow-2xl border-8 border-white z-10 relative"
        />
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-rose-800 leading-tight drop-shadow-sm">
          Meghna, will you be <br/> my wife forever?
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full relative z-20 min-h-[250px]">
        <button
          onClick={handleYesClick}
          style={{ transform: `scale(${yesButtonSize})`, zIndex: 50 }}
          className="px-12 py-5 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white text-2xl font-bold rounded-full shadow-2xl transition-all duration-300 hover:shadow-rose-500/50 hover:bg-rose-700 border-2 border-white/20"
        >
          YES! 💍💖
        </button>

        <button
          onClick={handleNoClick}
          onMouseEnter={handleNoClick} // Dodges when hovered too!
          style={{ 
            transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
            position: noCount > 0 ? 'absolute' : 'relative',
            zIndex: 40
          }}
          className="px-8 py-4 bg-white text-rose-500 text-lg font-semibold rounded-full shadow-md border-2 border-rose-200 transition-all duration-200 hover:bg-gray-50 whitespace-nowrap"
        >
          {getNoButtonText()}
        </button>
      </div>
    </div>
  );
}

function ConfirmTimeView({ time, onConfirm, onCancel }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-2xl mx-auto mt-10">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-pink-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-pink-500"></div>
        <Lock className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h2 className="text-3xl font-serif font-bold text-rose-800 mb-4">Lock This Moment?</h2>
        <p className="text-xl text-gray-700 mb-6">
          You said YES at exactly: <br/>
          <span className="font-bold text-rose-600 block mt-3 text-2xl">{time}</span>
        </p>
        <p className="text-sm text-gray-500 mb-10 italic">
          Locking this time will stamp it permanently onto your certificate. Even if you refresh the website, it will remember this moment forever.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onCancel}
            className="px-6 py-3 font-bold text-rose-500 bg-white rounded-full border-2 border-rose-200 hover:bg-rose-50 transition-all"
          >
            Wait, go back
          </button>
          <button 
            onClick={onConfirm}
            className="px-8 py-3 font-bold text-white bg-rose-600 rounded-full shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" /> Stamp it Forever!
          </button>
        </div>
      </div>
    </div>
  );
}

function CertificateView({ time, onNext }) {
  const printCertificate = () => window.print();

  return (
    <div className="animate-fade-in flex flex-col items-center w-full max-w-5xl px-4 py-10 mt-10">
      <div className="no-print text-center mb-8">
        <div className="text-2xl text-rose-400 mb-2 font-serif">ॐ</div>
        <h2 className="text-3xl font-bold text-rose-700 flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-yellow-500" /> MEGHNA SAID YES! <Sparkles className="w-8 h-8 text-yellow-500" />
        </h2>
        <p className="text-rose-600 text-lg font-medium">A monumental moment in history. Save this certificate forever.</p>
      </div>

      {/* Certificate Area */}
      <div 
        id="certificate-area" 
        className="w-full bg-[#fffaf5] p-10 md:p-16 border-[20px] border-double border-rose-200 shadow-2xl relative rounded-sm"
      >
        <div className="absolute top-6 left-6 text-pink-200"><Heart className="w-12 h-12 fill-pink-100" /></div>
        <div className="absolute top-6 right-6 text-pink-200"><Heart className="w-12 h-12 fill-pink-100" /></div>
        <div className="absolute bottom-6 left-6 text-pink-200"><Dog className="w-12 h-12 fill-pink-100" /></div>
        <div className="absolute bottom-6 right-6 text-pink-200"><Dog className="w-12 h-12 fill-pink-100" /></div>
        
        <div className="absolute top-8 left-0 w-full flex justify-center opacity-20 pointer-events-none">
           <div className="text-9xl font-serif text-rose-300">ॐ</div>
        </div>

        <div className="text-center space-y-10 relative z-10">
          <div className="inline-block">
            <h1 className="text-5xl md:text-7xl font-serif text-rose-900 tracking-widest uppercase border-b-4 border-rose-300 pb-4">
              Agreement of Forever
            </h1>
            <p className="text-sm tracking-widest text-rose-500 uppercase mt-3 font-bold">Official Record of Eternal Love</p>
          </div>
          
          <div className="py-8 space-y-8">
            <p className="text-xl md:text-2xl text-gray-700 italic font-serif">This document officially certifies that</p>
            <h2 className="text-5xl md:text-6xl font-bold text-rose-700 font-serif border-b-2 border-dashed border-rose-300 inline-block pb-2 px-10">
              Meghna Kantak
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 italic font-serif leading-relaxed px-4 md:px-20">
              has agreed to tolerate, love, and annoy <br/>
              <span className="font-bold text-rose-800 text-3xl mt-2 inline-block">Saksham Talwar</span> <br/>
              and co-parent all our 5 furry babies for the rest of her natural life.
            </p>
          </div>

          <div className="bg-pink-50 p-8 rounded-2xl max-w-lg mx-auto border-2 border-rose-100 shadow-inner">
            <p className="text-rose-900 font-bold uppercase tracking-widest text-sm flex justify-center items-center gap-2">
              <Lock className="w-4 h-4" /> Officially Sealed On:
            </p>
            <p className="text-2xl md:text-3xl font-bold text-rose-800 mt-4 font-serif">{time || 'Now'}</p>
          </div>

          <div className="pt-20 flex flex-col md:flex-row justify-between items-end px-4 md:px-20 gap-10 md:gap-0">
            <div className="text-center w-full md:w-48">
              <div className="border-b-2 border-rose-500 mb-2 pb-2 h-16 flex items-end justify-center">
                <span className="font-serif text-4xl text-rose-900 italic">Saksham</span>
              </div>
              <p className="text-sm text-gray-600 uppercase tracking-widest font-bold">Saksham Talwar</p>
            </div>
            
            {/* Seal */}
            <div className="w-28 h-28 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center border-4 border-rose-200 shadow-2xl transform rotate-12 relative my-4 md:my-0 mx-auto md:mx-0">
               <div className="absolute inset-2 border-2 border-dashed border-white rounded-full"></div>
               <span className="text-white font-serif text-3xl font-bold italic">S & M</span>
            </div>

            <div className="text-center w-full md:w-48">
              <div className="border-b-2 border-rose-500 mb-2 pb-2 h-16 flex items-end justify-center">
                <span className="font-serif text-4xl text-rose-900 italic">Meghna</span>
              </div>
              <p className="text-sm text-gray-600 uppercase tracking-widest font-bold">Meghna Kantak</p>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mt-12 flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        <button 
          onClick={printCertificate}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-white text-rose-700 font-bold text-lg rounded-full shadow-lg hover:bg-rose-50 hover:-translate-y-1 transition-all border-2 border-rose-200"
        >
          <Download className="w-6 h-6" /> Download PDF
        </button>
        <button 
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
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
      setTimeout(() => setIsMarried(true), 300);
    }
  };

  if (isMarried) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center min-h-[90vh] w-full px-4 relative z-20 mt-10">
        <div className="text-6xl text-rose-500 mb-8 font-serif opacity-80 animate-pulse">ॐ</div>
        <div className="relative mb-12">
          <Heart className="w-48 h-48 text-rose-600 fill-rose-600 animate-heartbeat mx-auto drop-shadow-2xl" />
          <div className="absolute top-0 left-0 w-full h-full animate-ping opacity-60">
             <Heart className="w-48 h-48 text-pink-400 fill-pink-400 mx-auto" />
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 mb-8 drop-shadow-lg">
          WE ARE FOREVER!
        </h1>
        <p className="text-2xl md:text-4xl text-rose-900 mt-4 max-w-4xl leading-relaxed font-serif italic border-t-2 border-b-2 border-rose-200 py-8">
          1000 times I love you, and a million more to go. Thank you for making me the happiest man, and making our 5 furry babies a complete family. <br/><br/> Our forever begins right now. 💖🐾
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-4xl flex flex-col items-center py-10 px-4 mt-10">
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-900 text-center mb-6">
        Just One Last Thing, Meghna...
      </h2>
      <p className="text-xl md:text-2xl text-rose-700 text-center max-w-3xl mb-12 leading-relaxed font-medium">
        I wanted to prove how much I love you. So I started counting...
      </p>

      <div className="w-full bg-white/90 backdrop-blur-md border-4 border-rose-200 rounded-3xl p-8 shadow-2xl mb-12 relative">
        <div 
          ref={scrollRef}
          className="h-96 overflow-y-auto pr-4 custom-scrollbar text-center text-rose-600 space-y-3 font-medium text-xl md:text-2xl"
        >
          {ilyArray.map(num => (
            <div key={num} className="opacity-90">{num}. I love you</div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent rounded-b-3xl pointer-events-none"></div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-rose-200 text-center w-full max-w-xl transform hover:-translate-y-2 transition-transform duration-300">
        <p className="text-rose-900 font-bold text-3xl mb-8">Complete the 1000th:</p>
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type it here..."
            className="w-full px-8 py-6 bg-pink-50 border-4 border-rose-300 rounded-2xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all text-center text-3xl text-rose-800 font-bold placeholder-pink-300 uppercase tracking-widest shadow-inner"
          />
          {inputValue.toLowerCase().trim() === 'ily' && (
             <Check className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 w-10 h-10 animate-bounce" />
          )}
        </div>
        <p className="text-lg text-rose-500 mt-6 italic font-bold">
          Hint: Just type those 3 magical letters (ily)
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fdf2f8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f43f5e; border-radius: 10px; border: 3px solid #fdf2f8; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e11d48; }
      `}} />
    </div>
  );
}


