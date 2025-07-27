import React, { useEffect, useState } from 'react';

import GameBoardPage from './components/GameBoardPage';

// API Configuration - automatically detects environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-mastergoal.onrender.com'
  : 'http://localhost:5000';

console.log('App.jsx - Current environment:', process.env.NODE_ENV);
console.log('App.jsx - Using API URL:', API_BASE_URL);

//ColorSelector Component
const ColorSelector = ({ label, selectedColor, setSelectedColor, options, blockedColor, isOpen, setIsOpen }) => {
  const handleSelect = (value) => {
    setSelectedColor(value);
    setIsOpen(false);
  };

  // Opciones filtradas
  const filteredOptions = options.filter((opt) => opt.value !== blockedColor);

  return (
    <div className="relative flex flex-col items-start">
      <span className="text-[#255935] font-oswald font-semibold mb-2">{label}</span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between border border-[#A4A77E] border-2 px-3 py-1 bg-[#E6DCB7] text-[#255935] font-oswald font-medium text-lg focus:outline-none w-full"
        >
        <img
          src={`/${capitalizeFirstLetter(selectedColor)}Chip.png`}
          alt={`${selectedColor} chip`}
          className="w-6 h-6 mr-2"
        />
        <span>{capitalizeFirstLetter(selectedColor)}</span>
        <svg
          className="w-5 h-5 ml-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#255935"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-[#F5EFD5] border-[#A4A77E] border-2 rounded w-44 overflow-hidden">
          {filteredOptions.map((opt, index) => (
            <div key={opt.value}>
              <button
                onClick={() => handleSelect(opt.value)}
                className="flex items-center w-full px-3 py-1 hover:bg-[#D2C7A0] transition"
              >
                <img
                  src={`/${capitalizeFirstLetter(opt.value)}Chip.png`}
                  alt={`${opt.label} chip`}
                  className="w-6 h-6 mr-2"
                />
                <span className="text-[#255935] font-oswald">{opt.label}</span>
              </button>
              {index < filteredOptions.length - 1 && (
                <div className="border-b-2 border-[#A4A77E]"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Helper function
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


// LandingPage Component
const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#255935] font-open-sans p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-8">
        {/* Left Section */}
        <div className="text-center md:text-left mb-8 md:mb-0 md:mr-8">
          <h1 className="font-oswald text-6xl text-[#F5EFD5] md:text-8xl font-extrabold mb-2 leading-tight">MASTERGOAL</h1>
          <h2 className="font-oswald text-[1.45rem] text-[#F5EFD5] md:text-[2.35rem] font-semibold mb-6">STRATEGY FOOTBALL BOARD GAME</h2>
          <p className="font-open-sans text-lg text-[#F5EFD5] md:text-xl mb-8 max-w-md mx-auto md:mx-0">
            A unique strategy game that combines the excitement of football with deep tactical decision-making and smart positioning.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-[#F5EFD5] text-[#255935] font-bold py-3 px-8 rounded-lg shadow-lg mb-2 hover:bg-[#D2C7A0] transition duration-300 transform hover:scale-105 text-xl"
          >
            GET STARTED
          </button>
        </div>
        {/* Right Section - Board Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img 
            src="/boardPhoto.png" 
            alt="MasterGoal Board Game" 
            className="w-full h-auto max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
};

// PreConfigPage Component
const PreConfigPage = ({ onStartGame, onAdvancedConfig, onGoHome }) => {
  const [mode, setMode] = useState('1player');
  const [level, setLevel] = useState(2);
  const [youColor, setYouColor] = useState('orange');
  const [aiColor, setAiColor] = useState('red');
  const [youColorOpen, setYouColorOpen] = useState(false);
  const [aiColorOpen, setAiColorOpen] = useState(false);

  const colorOptions = [
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
  ];

  const handleYouColorOpen = (isOpen) => {
    setYouColorOpen(isOpen);
    if (isOpen) setAiColorOpen(false); // Close the other dropdown
  };

  const handleAiColorOpen = (isOpen) => {
    setAiColorOpen(isOpen);
    if (isOpen) setYouColorOpen(false); // Close the other dropdown
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#255935] font-open-sans">
      <div className="bg-[#F5EFD5] p-8 rounded-3xl w-full max-w-xs md:max-w-sm">
        <div className="flex justify-left">
          <button
            onClick={onGoHome}
            className="text-[#E6DCB7] hover:text-[#E6DCB7] transition duration-300 -ml-4"
            aria-label="Go to Home"
          >
            <img
              src="/Home.svg"
              alt="Home"
              className="h-6 w-6"
            />
          </button>
        </div>
        {/* Title */}
        <h2 className="text-[3.2rem] font-oswald font-medium text-center text-[#255935] mb-2 tracking-1p">GAME SETTINGS</h2>

        {/* Mode */}
        <div className="mb-2">
          <h3 className="text-xl font-oswald font-medium text-[#255935] mb-2">MODE</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('1player')}
              className={`flex flex-row items-center justify-center py-3 px-2 rounded border w-full ${
                mode === '1player' ? 'bg-[#255935] text-[#F5EFD5]' : 'bg-[#E6DCB7] text-[#255935]  border-[#A4A77E] border-2 hover:bg-[#D2C7A0] transition duration-300 transform'
              } transition duration-200`}
            >
              {/* SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>

              {/* Texts */}
              <div className="flex flex-col items-start">
                <span className="font-oswald font-bold text-lg">1 PLAYER</span>
                <span className="text-xs">{`(vs AI)`}</span>
              </div>
            </button>

            <button
              onClick={() => setMode('2players')}
              className={`flex flex-row items-center justify-center py-3 px-2 rounded border w-full ${
                mode === '2players' ? 'bg-[#255935] text-[#F5EFD5]' : 'bg-[#E6DCB7] text-[#255935] border-[#A4A77E] border-2 hover:bg-[#D2C7A0] transition duration-300 transform'
              } transition duration-200`}
            >
              {/* SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M7 10h.01M17 10h.01M12 12a2 2 0 100-4 2 2 0 000 4zm-4 8a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
              </svg>

              {/* Texts */}
              <div className="flex flex-col items-start">
                <span className="font-oswald font-bold text-lg">2 PLAYERS</span>
                <span className="text-xs">{`(same device)`}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Level */}
        (
          <div className="mb-1">
            <h3 className="text-xl font-oswald font-medium text-[#255935] mb-2">LEVEL</h3>
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`w-13 h-13 rounded-full border flex items-center justify-center font-bold ${
                    level === lvl ? 'bg-[#255935] text-[#F5EFD5]' : 'bg-[#E6DCB7] text-[#255935] border-[#A4A77E] border-2 hover:bg-[#D2C7A0] transition duration-300 transform'
                  } transition duration-200`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )

        {/* Colors */}
        <div className="mb-6">
          <h3 className="text-xl font-oswald font-medium text-[#255935] mb-2">TEAM COLORS</h3>
          <div className="flex justify-evenly gap-2">
             <div className="flex-1">
              <ColorSelector
                label={mode === '1player' ? 'YOU' : 'PLAYER 1'}
                selectedColor={youColor}
                setSelectedColor={setYouColor}
                options={colorOptions}
                blockedColor={aiColor}
                isOpen={youColorOpen}
                setIsOpen={handleYouColorOpen}
              />
              </div>
            <div className="flex-1">
              <ColorSelector
                label={mode === '1player' ? 'AI' : 'PLAYER 2'}
                selectedColor={aiColor}
                setSelectedColor={setAiColor}
                options={colorOptions}
                blockedColor={youColor}
                isOpen={aiColorOpen}
                setIsOpen={handleAiColorOpen}
              />
              </div>
            </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStartGame({ mode, level, youColor, aiColor })}
          className="w-full bg-[#255935] text-[#F5EFD5] font-oswald font-bold text-2xl py-3 transition duration-200 hover:bg-[#2a4d31] mb-2"
        >
          START
        </button>

        {/* Advanced link */}
        <button
          onClick={onAdvancedConfig}
          className="w-full text-[#255935] text-center font-oswald font-bold underline text-lg"
        >
          Advanced Configurations
        </button>
      </div>
    </div>
  );
};


// AdvancedConfigPage Component
const AdvancedConfigPage = ({ onSave, onCancel, onGoHome }) => {
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard, dynamic
  const [playWithTimer, setPlayWithTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30); // in seconds
  const [limitTurns, setLimitTurns] = useState(false);
  const [maxTurns, setMaxTurns] = useState(40);

  const timerOptions = [15, 30, 45, 60, 90, 120]; // in seconds
  const turnOptions = [20, 30, 40, 50, 60, 80]; // maximum turns

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#255935] font-open-sans p-4">
      <div className="bg-[#F5EFD5] p-8 rounded-3xl w-full max-w-xs md:max-w-sm">
        <div className="flex justify-left mb-2">
          <button
            onClick={onGoHome}
            className="text-[#E6DCB7] hover:text-[#E6DCB7] transition duration-300 -ml-4"
            aria-label="Go to Home"
          >
            <img
              src="/Home.svg"
              alt="Home"
              className="h-6 w-6"
            />
          </button>
        </div>
        <div className="flex items-center justify-center mb-5">

          <h2 className="text-[2.8rem] font-oswald font-medium text-center text-[#255935] mb-6 tracking-1p">ADVANCED CONFIGURATIONS</h2>
        </div>

        

        {/* Difficulty Level */}
        <div className="mb-5">
          <h3 className="text-xl font-oswald font-medium text-[#255935] mb-2">DIFFICULTY LEVEL</h3>
          <div className="flex flex-wrap justify-around bg-[#F5EFD5] rounded-lg p-2">
            {['Easy', 'Medium', 'Hard', 'Dynamic'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff.toLowerCase())}
                className={`flex-1 py-3 px-2 rounded-lg font-oswald font-medium transition duration-300 min-w-[calc(50%-0.5rem)] sm:min-w-0 sm:flex-none mb-2 sm:mb-0 ${
                  difficulty === diff.toLowerCase() ? 'bg-[#255935] text-[#F5EFD5]' : 'text-[#A4A77E] hover:bg-[#D2C7A0]'
                } ${diff === 'Easy' ? 'mr-1 sm:mr-2' : ''} ${diff === 'Medium' ? 'sm:mr-2' : ''} ${diff === 'Hard' ? 'mr-1 sm:mr-2' : ''}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Play with Timer */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-oswald font-medium text-[#255935]">Turn Timer</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={playWithTimer}
                onChange={() => setPlayWithTimer(!playWithTimer)}
              />
              <div className="w-11 h-6 bg-[#E6DCB7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F5EFD5] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#255935]"></div>
            </label>
          </div>
          {playWithTimer && (
            <div className="flex flex-wrap justify-around bg-[#F5EFD5] rounded-lg p-2">
              {timerOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => setTimerDuration(time)}
                  className={`flex-1 py-3 px-2 rounded-lg font-oswald font-medium transition duration-300 min-w-[calc(33%-0.5rem)] sm:min-w-0 sm:flex-none mb-2 sm:mb-0 ${
                    timerDuration === time ? 'bg-[#255935] text-[#F5EFD5]' : 'text-[#255935] hover:bg-[#D2C7A0] text-[#A4A77E]'
                  } ${time === 15 || time === 45 || time === 90 ? 'mr-1 sm:mr-2' : ''} ${time === 30 || time === 60 || time === 120 ? 'mr-1 sm:mr-2' : ''}`}
                >
                  {time < 60 ? `${time}s` : time === 60 ? '1m' : time === 90 ? '1m 30s' : '2m'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Limit Maximum Turns */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-oswald font-medium text-[#255935]">Limit Max Turns</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={limitTurns}
                onChange={() => setLimitTurns(!limitTurns)}
              />
              <div className="w-11 h-6 bg-[#E6DCB7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F5EFD5] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#255935]"></div>
            </label>
          </div>
          {limitTurns && (
            <div className="flex flex-wrap justify-around bg-[#F5EFD5] rounded-lg p-2">
              {turnOptions.map((turns) => (
                <button
                  key={turns}
                  onClick={() => setMaxTurns(turns)}
                  className={`flex-1 py-3 px-2 rounded-lg font-oswald font-medium transition duration-300 min-w-[calc(33%-0.5rem)] sm:min-w-0 sm:flex-none mb-2 sm:mb-0 ${
                    maxTurns === turns ? 'bg-[#255935] text-[#F5EFD5]' : 'text-[#255935] hover:bg-[#D2C7A0] text-[#A4A77E]'
                  } ${turns === 20 || turns === 40 || turns === 60 ? 'mr-1 sm:mr-2' : ''} ${turns === 30 || turns === 50 || turns === 80 ? 'mr-1 sm:mr-2' : ''}`}
                >
                  {turns}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-around">
          <button
            onClick={onCancel}
            className="flex-1 text-xl bg-[#E6DCB7] text-[#255935] font-oswald font-bold border-[#A4A77E] border-2 rounded-lg hover:bg-[#D2C7A0] transition duration-300 transform  mb-3 sm:mb-0 sm:mr-2 tracking-1p"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ difficulty, playWithTimer, timerDuration, limitTurns, maxTurns })}
            className="flex-1 text-xl bg-[#255935] text-[#F5EFD5] font-oswald font-bold rounded-lg hover:bg-[#2a4d31] transition duration-300 transform sm:ml-2 tracking-1p"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [gameSettings, setGameSettings] = useState({});
  const [advancedSettings, setAdvancedSettings] = useState({});
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Wake up the backend service when app loads (for free tier)
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        console.log('Waking up backend service...');
        const response = await fetch(`${API_BASE_URL}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Backend is awake and ready!');
          setBackendStatus('online');
        } else {
          console.log('Backend responded but with error:', response.status);
          setBackendStatus('offline');
        }
      } catch (error) {
        console.log('Backend wake-up failed:', error);
        setBackendStatus('offline');
      }
    };

    wakeUpBackend();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleGetStarted = () => {
    setCurrentPage('preconfig');
  };

  const handleStartGame = (settings) => {
    // Show loading state if backend is still starting up
    if (backendStatus === 'checking') {
      alert('Please wait, the game server is starting up...');
      return;
    }

    // Use the dynamic API_BASE_URL
    fetch(`${API_BASE_URL}/start_game`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ level: settings.level })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Backend response:", data);
        setGameSettings(settings);
        setCurrentPage('game');
      })
      .catch(err => {
        console.error("Failed to start game on backend:", err);
        // Show user-friendly error message
        alert("Failed to connect to game server. The server might be starting up - please try again in a moment.");
      });
  };

  // Alternative: Add a fallback mode that works without backend
  const handleStartGameWithFallback = (settings) => {
    // Try to connect to backend first
    fetch('https://backend-mastergoal.onrender.com/start_game', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ level: settings.level })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Backend response:", data);
        setGameSettings(settings);
        setCurrentPage('game');
      })
      .catch(err => {
        console.error("Backend connection failed:", err);
        console.log("Starting game in offline mode...");
        // Continue with game initialization even if backend fails
        setGameSettings(settings);
        setCurrentPage('game');
      });
  };

  const handleAdvancedConfig = () => {
    setCurrentPage('advancedconfig');
  };

  const handleSaveAdvancedConfig = (settings) => {
    setAdvancedSettings(settings);
    setCurrentPage('preconfig');
    console.log('Saved advanced settings:', settings);
  };

  const handleCancelAdvancedConfig = () => {
    setCurrentPage('preconfig');
  };

  const handleGoHome = () => {
    setCurrentPage('landing');
  };

  let content;
  switch (currentPage) {
    case 'landing':
      content = <LandingPage onGetStarted={handleGetStarted} backendStatus={backendStatus} />;
      break;
    case 'preconfig':
      content = (
        <PreConfigPage
          onStartGame={handleStartGame} // or use handleStartGameWithFallback
          onAdvancedConfig={handleAdvancedConfig}
          onGoHome={handleGoHome}
        />
      );
      break;
    case 'advancedconfig':
      content = (
        <AdvancedConfigPage
          onSave={handleSaveAdvancedConfig}
          onCancel={handleCancelAdvancedConfig}
          onGoHome={handleGoHome}
        />
      );
      break;
    case 'game':
      content = (
        <GameBoardPage
          onGoHome={handleGoHome}
          team1Name={gameSettings.mode === '1player' ? 'YOU' : 'PLAYER 1'}
          team2Name={gameSettings.mode === '1player' ? 'AI' : 'PLAYER 2'}
          team1Score={0}
          team2Score={0}
          timerEnabled={advancedSettings.playWithTimer || false}
          timerValue={advancedSettings.timerDuration || 30}
          turnsLimited={advancedSettings.limitTurns || false}
          maxTurns={advancedSettings.limitTurns ? advancedSettings.maxTurns || 40 : null}
          team1Color={gameSettings.youColor || 'orange'}
          team2Color={gameSettings.aiColor || 'red'}
          difficulty={advancedSettings.difficulty || 'medium'}
          mode={gameSettings.mode || '1player'}
          level={gameSettings.level || 1}
        />
      );
      break;
    default:
      content = <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="App h-screen w-full flex items-center justify-center bg-[#255935] p-4 select-none">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
        body {
          font-family: 'Open Sans', sans-serif;
        }
        .font-oswald {
          font-family: 'Oswald', sans-serif;
        }
        .font-open-sans {
          font-family: 'Open Sans', sans-serif;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: none;
        }
        `}
      </style>
      {content}
    </div>
  );
};

export default App;