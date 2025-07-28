import React, { useEffect, useState, useRef } from 'react';

import ChipIcon from './ChipIcon';
import TimerClock from './TimerClock';
import HomeConfirmationModal from './HomeConfirmationModal';
import PauseGameModal from './PauseGameModal';
import RestartConfirmationModal from './RestartConfirmationModal';

// API Configuration - automatically detects environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-mastergoal.onrender.com'
  : 'http://localhost:5000';

const getChipColor = (colorName) => {
  const colorMap = {
    'orange': '#F18F01',
    'red': '#A40606',
    'white': '#F5EFD5',
    'black': '#1C0F01'
  };
  return colorMap[colorName] || '#FF8C00';
};

const GameBoardPage = ({
  onGoHome,
  team1Name = 'PLAYER 1',
  team2Name = 'PLAYER 2',
  timerEnabled = false,
  timerValue = 30,
  team1Color = 'orange',
  team2Color = 'blue',
  difficulty = 'medium',
  mode = '1player',
  level = 1,
  num_turns = null,
}) => {
  const [serverGameState, setServerGameState] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showRestartConfirmation, setShowRestartConfirmation] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timerValue);
  const [lastTurnTeam, setLastTurnTeam] = useState(null);

  // For local timer interval
  const timerIntervalRef = useRef(null);

  // Get scores from server game state
  const getScores = () => {
    if (!serverGameState) return { leftScore: 0, rightScore: 0 };
    return {
      leftScore: serverGameState.left_goals || 0,
      rightScore: serverGameState.right_goals || 0
    };
  };

  const { leftScore, rightScore } = getScores();

  // Set team names based on mode
  const displayTeam1Name = mode === '1player' ? 'YOU' : team1Name;
  const displayTeam2Name = mode === '1player' ? 'AI' : team2Name;

  // Home button handlers
  const handleHomeClick = () => setShowHomeConfirmation(true);
  const handleConfirmHomeExit = () => {
    setShowHomeConfirmation(false);
    onGoHome();
  };
  const handleCancelHomeExit = () => setShowHomeConfirmation(false);

  // Pause button handlers
  const handlePauseClick = () => setShowPauseModal(true);
  const handleClosePauseModal = () => setShowPauseModal(false);

  // Restart button handlers
  const handleRestartClick = () => setShowRestartConfirmation(true);
  const handleConfirmRestart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/restart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const response = await res.json();
        setServerGameState(response.state);
        setLegalMoves([]);
        setSelectedPiece(null);
        setLastTurnTeam(null);
        fetchGameData();
      }
    } catch (error) {
      console.error("Error restarting game:", error);
    } finally {
      setShowRestartConfirmation(false);
    }
  };
  const handleCancelRestart = () => setShowRestartConfirmation(false);

  // Coordinate conversion helpers
  const frontendToBackend = (frontendRow, frontendCol) => ({
    backendRow: frontendCol,
    backendCol: frontendRow
  });

  const backendToFrontend = (backendRow, backendCol) => ({
    frontendRow: backendCol,
    frontendCol: backendRow
  });

  // Fetch game state and legal moves
  const fetchGameData = async () => {
    try {
      const [stateRes, movesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/state`),
        fetch(`${API_BASE_URL}/legal_moves`)
      ]);
      const gameState = await stateRes.json();
      const moves = await movesRes.json();
      setServerGameState(gameState);
      setLegalMoves(moves);

      // Calculate remaining time from backend
      if (
        timerEnabled &&
        gameState.turn_start_time &&
        gameState.timer_duration
      ) {
        const now = Date.now() / 1000;
        const remaining = Math.ceil(
          gameState.timer_duration - (now - gameState.turn_start_time)
        );
        setRemainingTime(remaining > 0 ? remaining : 0);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  // Local timer effect: only updates remainingTime
  useEffect(() => {
    if (!timerEnabled || !serverGameState) return;
    if (remainingTime <= 0) return;

    timerIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [timerEnabled, serverGameState, remainingTime]);

  // When timer hits zero, fetch backend state once
  useEffect(() => {
    if (!timerEnabled || !serverGameState) return;
    if (remainingTime === 0) {
      fetchGameData();
      setSelectedPiece(null);
    }
  }, [remainingTime, timerEnabled, serverGameState]);

  // When turn changes, fetch backend state and reset timer
  useEffect(() => {
    if (!serverGameState) return;
    if (lastTurnTeam && lastTurnTeam !== serverGameState.current_team) {
      setSelectedPiece(null);
      fetchGameData();
    }
    setLastTurnTeam(serverGameState.current_team);
  }, [serverGameState?.current_team, lastTurnTeam]);

  // On mount: start game and fetch initial state
  useEffect(() => {
    const startGame = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/start_game`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            level, 
            mode, 
            num_turns,
            playWithTimer: timerEnabled,
            timerDuration: timerValue
          })
        });

        if (res.ok) {
          const data = await res.json();
          setServerGameState(data.state);
          setLastTurnTeam(data.state.current_team);
          await fetchGameData();
        }
      } catch (error) {
        console.error("Error starting game:", error);
      }
    };

    startGame();
    // eslint-disable-next-line
  }, [level, mode, timerEnabled, timerValue, num_turns]);

  const specialTiles = [
    { row: 3, col: 1 }, { row: 4, col: 1 }, { row: 5, col: 1 },
    { row: 6, col: 1 }, { row: 7, col: 1 },
    { row: 3, col: 13 }, { row: 4, col: 13 }, { row: 5, col: 13 },
    { row: 6, col: 13 }, { row: 7, col: 13 },
    { row: 0, col: 1 }, { row: 0, col: 13 },
    { row: 10, col: 1 }, { row: 10, col: 13 }
  ];

  const boardRows = 11;
  const boardCols = 15;

  const isGoalArea = (row, col) => {
    if (col === 0 && row >= 3 && row <= 7) return 'left';
    if (col === 14 && row >= 3 && row <= 7) return 'right';
    return false;
  };

  const isPiece = (row, col) => {
    if (!serverGameState) return false;

    // Check players (with coordinate conversion)
    for (const [team, id, pRow, pCol, isGoalkeeper] of serverGameState.players) {
      const { frontendRow, frontendCol } = backendToFrontend(pRow, pCol);
      if (frontendRow === row && frontendCol === col) {
        return team === 'LEFT' ? team1Color : team2Color;
      }
    }

    // Check ball (with coordinate conversion)
    const [ballRow, ballCol] = serverGameState.ball_position;
    const { frontendRow, frontendCol } = backendToFrontend(ballRow, ballCol);
    if (frontendRow === row && frontendCol === col) {
      return 'ball';
    }

    return false;
  };

  const isSpecialTile = (row, col) => {
    return specialTiles.some(tile => tile.row === row && tile.col === col);
  };

  // Check if a piece belongs to the current player
  const isCurrentPlayerPiece = (row, col) => {
    if (!serverGameState) return false;
    
    const piece = isPiece(row, col);
    const currentTeam = serverGameState.current_team;
    
    // In 1-player mode, human can only control LEFT team pieces
    if (mode === '1player') {
      return piece === team1Color && currentTeam === 'LEFT';
    }
    
    // In 2-player mode, current player can control their team's pieces
    if (currentTeam === 'LEFT') {
      return piece === team1Color;
    } else {
      return piece === team2Color;
    }
  };

  // Check if a piece has legal moves available
  const pieceHasLegalMoves = (frontendRow, frontendCol) => {
    const { backendRow, backendCol } = frontendToBackend(frontendRow, frontendCol);
    
    return legalMoves.some(move => {
      const [fromRow, fromCol] = move.from;
      return fromRow === backendRow && fromCol === backendCol;
    });
  };

  // Check if a move is legal
  const isMoveLegal = (fromFrontendRow, fromFrontendCol, toFrontendRow, toFrontendCol) => {
    const fromBackend = frontendToBackend(fromFrontendRow, fromFrontendCol);
    const toBackend = frontendToBackend(toFrontendRow, toFrontendCol);
    
    return legalMoves.some(move => {
      const [fromRow, fromCol] = move.from;
      const [toRow, toCol] = move.to;
      
      return fromRow === fromBackend.backendRow && 
             fromCol === fromBackend.backendCol &&
             toRow === toBackend.backendRow && 
             toCol === toBackend.backendCol;
    });
  };

  // Get the move type for a specific move
  const getMoveType = (fromFrontendRow, fromFrontendCol, toFrontendRow, toFrontendCol) => {
    const fromBackend = frontendToBackend(fromFrontendRow, fromFrontendCol);
    const toBackend = frontendToBackend(toFrontendRow, toFrontendCol);
    
    const move = legalMoves.find(move => {
      const [fromRow, fromCol] = move.from;
      const [toRow, toCol] = move.to;
      
      return fromRow === fromBackend.backendRow && 
             fromCol === fromBackend.backendCol &&
             toRow === toBackend.backendRow && 
             toCol === toBackend.backendCol;
    });
    
    return move ? move.type : null;
  };

  const handleCellClick = async (row, col) => {
    const piece = isPiece(row, col);

    // If clicking the same piece that's already selected → deselect
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
      setSelectedPiece(null);
      return;
    }

    // If it's current player's piece and it has legal moves → select it
    if (!selectedPiece && isCurrentPlayerPiece(row, col)) {
      if (pieceHasLegalMoves(row, col)) {
        setSelectedPiece({ row, col });
      }
      return;
    }

    // If it's the ball and there are kick moves available
    if (!selectedPiece && piece === 'ball') {
      const kickMoves = legalMoves.filter(move => move.type === 'kick');
      if (kickMoves.length > 0) {
        setSelectedPiece({ row, col, isBall: true });
      }
      return;
    }

    // If a piece is selected and clicking on a destination
    if (selectedPiece) {
      const isValidMove = isMoveLegal(selectedPiece.row, selectedPiece.col, row, col);
      
      if (!isValidMove) {
        return;
      }

      const moveType = getMoveType(selectedPiece.row, selectedPiece.col, row, col);
      const fromBackend = frontendToBackend(selectedPiece.row, selectedPiece.col);
      const toBackend = frontendToBackend(row, col);

      try {
        const res = await fetch(`${API_BASE_URL}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: moveType,
            from: [fromBackend.backendRow, fromBackend.backendCol],
            to: [toBackend.backendRow, toBackend.backendCol]
          })
        });

        if (!res.ok) {
          // If timer expired, update UI immediately
          const errorResponse = await res.json();
          if (errorResponse.error && errorResponse.error.includes('timer expired')) {
            console.log("Timer expired during move, updating game state...");
            setSelectedPiece(null);
            await fetchGameData();
          }
          return;
        }

        const response = await res.json();
        if (response.success) {
          setServerGameState(response.state);
          setSelectedPiece(null);
          await fetchGameData();
          
          // Handle AI move only in 1-player mode
          if (mode === '1player' && response.ai_turn) {
            try {
              const aiRes = await fetch(`${API_BASE_URL}/ai_move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              const aiData = await aiRes.json();
              if (aiData.success) {
                setServerGameState(aiData.state);
                await fetchGameData();
                if (aiData.game_over) {
                  alert(`Game Over! Winner: ${aiData.winner || 'None'}`);
                }
              }
            } catch (err) {
              console.error("AI move error:", err);
            }
          }
          
          // Check for game over in any mode
          if (response.game_over) {
            alert(`Game Over! Winner: ${response.winner || 'None'}`);
          }
        } else {
          // If timer expired, update UI immediately
          if (response.error && response.error.includes('timer expired')) {
            console.log("Timer expired during move (response), updating game state...");
            setSelectedPiece(null);
            await fetchGameData();
          }
        }
      } catch (error) {
        console.error("Error sending move:", error);
      }
    }
  };

  const getCellBackground = (row, col) => {
    const goalArea = isGoalArea(row, col);
    if (goalArea) {
      return goalArea === 'left' ? '#48763B' : '#48763B';
    }
    
    if (col >= 1 && col <= 13) {
      return ((row + col) % 2 === 0) ? '#48763B' : '#436836';
    }
    
    return 'transparent';
  };

  // Check if a cell is a valid destination for the selected piece
  const isValidDestination = (row, col) => {
    if (!selectedPiece) return false;
    return isMoveLegal(selectedPiece.row, selectedPiece.col, row, col);
  };

  // Get current turn display
  const getCurrentTurnDisplay = () => {
    if (!serverGameState) return '';
    
    const currentTeam = serverGameState.current_team;
    if (mode === '1player') {
      return currentTeam === 'LEFT' ? 'Your Turn' : 'AI Turn';
    } else {
      return currentTeam === 'LEFT' ? `${displayTeam1Name}'s Turn` : `${displayTeam2Name}'s Turn`;
    }
  };

  if (!serverGameState) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#255935] text-[#F5EFD5] font-bold">
        <div className="text-2xl mb-6 animate-pulse">Loading Mastergoal...</div>
        
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-[#F5EFD5] border-[#1C0F01] rounded-full animate-spin mb-4" />

        {/* Progress bar animation */}
        <div className="relative w-64 h-3 bg-[#1C0F01] rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-[#F5EFD5] animate-loading-bar rounded-full" />
        </div>

        {/* Custom animation class */}
        <style>
          {`
            @keyframes loading-bar {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0%); }
              100% { transform: translateX(100%); }
            }

            .animate-loading-bar {
              width: 50%;
              height: 100%;
              animation: loading-bar 2s infinite;
            }
          `}
        </style>
      </div>
    );
  }

  const renderFieldBorders = () => {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer field border */}
        <div className="absolute border-[3px] border-[#F5EFD5] rounded"
             style={{
               top: '3%',
               left: '8.5%',
               right: '8.5%',
               bottom: '3%'
             }}
        />
        
        {/* Goal areas */}
        <div className="absolute border-[3px] border-[#F5EFD5]"
             style={{
               top: '28.5%',
               left: '2.5%',
               width: '6.4%',
               height: '43%'
             }}
        />
        <div className="absolute border-[3px] border-[#F5EFD5]"
             style={{
               top: '28.5%',
               right: '2.5%',
               width: '6.4%',
               height: '43%'
             }}
        />
        
        {/* Center circle */}
        <div className="absolute border-[3px] border-[#F5EFD5] rounded-full"
             style={{
               top: '45%',
               left: '46%',
               width: '8%',
               height: '10%'
             }}
        />
        
        {/* Penalty areas */}
        <div className="absolute border-[3px] border-[#F5EFD5]"
             style={{
               top: '20%',
               left: '8.5%',
               width: '13%',
               height: '60%'
             }}
        />
        <div className="absolute border-[3px] border-[#F5EFD5]"
             style={{
               top: '20%',
               right: '8.5%',
               width: '13%',
               height: '60%'
             }}
        />

        {/* Big areas */}
        <div className="absolute border-[3px] border-[#F5EFD5]"
             style={{
               top: '12%',
               left: '8.5%',
               width: '26%',
               height: '77%'
             }}
        />
        <div className="absolute border-[3px] border-[#F5EFD5]"
             style={{
               top: '12%',
               right: '8.5%',
               width: '26%',
               height: '77%'
             }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#255935] font-sans items-center">
      {/* Left Menu Panel */}
      <div className="flex flex-col p-4 bg-[#1C0F01] space-y-6 rounded-xl shadow-lg">
        <button 
          className="p-3 flex items-center justify-center bg-transparent"
          onClick={handleHomeClick} 
        >
          <img src="/HomeVerticalMenu.svg" alt="Home" className="w-9 h-9" />
        </button>
        <button 
          className="p-3 flex items-center justify-center bg-transparent"
          onClick={handlePauseClick} 
        >
          <img src="/PauseVerticalMenu.svg" alt="Pause" className="w-9 h-9" />
        </button>
        <button 
          className="p-3 flex items-center justify-center bg-transparent"
          onClick={handleRestartClick}
        >
          <img src="/RestartVerticalMenu.svg" alt="Restart" className="w-9 h-9" />
        </button>
        <button 
          className="p-3 flex items-center justify-center bg-transparent"
        >
          <img src="/AboutVerticalMenu.svg" alt="About" className="w-9 h-9" />
        </button>
        <button className="p-3 flex items-center justify-center bg-transparent">
          <img src="/SettingsVerticalMenu.svg" alt="Settings" className="w-9 h-9" />
        </button>
      </div>

      {/* Main Game Board */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-[#1C0F01] rounded-2xl p-6">
          {/* Scoreboard */}
          <div className="flex items-center justify-center gap-x-4 w-full mb-2 px-16">
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: getChipColor(team1Color) }}>
              <span className="font-bold text-lg" style={{ color: team1Color === 'white' ? '#1C0F01' : '#F5EFD5' }}>
                {displayTeam1Name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-3xl" style={{ color: getChipColor(team1Color) }}>
                {leftScore}
              </span>
              <span className="font-bold text-3xl text-[#F5EFD5]">-</span>
              <span className="font-bold text-3xl" style={{ color: getChipColor(team2Color) }}>
                {rightScore}
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: getChipColor(team2Color) }}>
              <span className="font-bold text-lg" style={{ color: team2Color === 'white' ? '#1C0F01' : '#F5EFD5' }}>
                {displayTeam2Name}
              </span>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="text-center mb-4">
            <span className="text-[#F5EFD5] font-bold text-lg">
              {getCurrentTurnDisplay()}
            </span>
          </div>

          {/* Game Board */}
          <div className="relative bg-[#1C0F01] rounded-xl p-4">
            <div className="grid gap-0" 
                 style={{ 
                   gridTemplateColumns: `repeat(${boardCols}, 2.5rem)`, 
                   gridTemplateRows: `repeat(${boardRows}, 2.5rem)` 
                 }}>
              {Array.from({ length: boardRows }).map((_, row) => (
                Array.from({ length: boardCols }).map((_, col) => {
                  const piece = isPiece(row, col);
                  const goalArea = isGoalArea(row, col);
                  const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
                  const isValidDest = isValidDestination(row, col);
                  const canSelectPiece = isCurrentPlayerPiece(row, col) && pieceHasLegalMoves(row, col);
                  
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`relative flex items-center justify-center cursor-pointer transition duration-100 ${
                        isSelected ? 'ring-4 ring-yellow-400' : ''
                      } ${
                        isValidDest ? 'ring-2 ring-green-400' : ''
                      } ${
                        canSelectPiece && !selectedPiece ? 'ring-2 ring-blue-400' : ''
                      }`}
                      onClick={() => handleCellClick(row, col)}
                      style={{
                        backgroundColor: getCellBackground(row, col),
                        width: '2.5rem',
                        height: '2.5rem',
                      }}
                    >
                      {/* Tile dots */}
                      {isSpecialTile(row, col) && (
                        <div className="w-2 h-2 bg-[#F5EFD5] rounded-full opacity-60" />
                      )}

                      {/* Game pieces */}
                      {piece === team1Color && (
                        <ChipIcon color={getChipColor(team1Color)} width={32} height={32} />
                      )}
                      {piece === team2Color && (
                        <ChipIcon color={getChipColor(team2Color)} width={32} height={32} />
                      )}
                      {piece === 'ball' && (
                        <div className="w-6 h-6 bg-[#F5EFD5] rounded-full border-2 border-[#1C0F01] shadow-lg" />
                      )}
                      
                      {/* Goal area pattern */}
                      {goalArea && (
                        <div className="absolute inset-0 opacity-30">
                          <div className="w-full h-full bg-gradient-to-br from-[#F5EFD5] to-transparent" 
                               style={{
                                 background: `repeating-linear-gradient(
                                   45deg,
                                   transparent,
                                   transparent 3px,
                                   rgba(245, 239, 213, 0.3) 3px,
                                   rgba(245, 239, 213, 0.3) 6px
                                 )`
                               }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
            
            {/* Field borders and markings */}
            {renderFieldBorders()}
          </div>
        </div>
      </div>

      {/* Timer Panel */}
      {timerEnabled && (
        <div className="flex items-center justify-center bg-transparent p-4">
          <TimerClock secondsLeft={remainingTime} totalSeconds={timerValue} />
        </div>
      )}

      {/* Home Confirmation Modal */}
      <HomeConfirmationModal 
        isOpen={showHomeConfirmation}
        onClose={handleCancelHomeExit}
        onConfirm={handleConfirmHomeExit}
        message="You are about to exit to the main page. Are you sure?"
        confirmButtonText="Quit / Continue"
      />

      {/* Pause Modal */}
      <PauseGameModal 
        isOpen={showPauseModal}
        onClose={handleClosePauseModal}
        onConfirm={handleClosePauseModal}
        message="THE GAME IS PAUSED"
        showCancelButton={false}
        confirmButtonText="OK"
      />

      {/* Restart Confirmation Modal */}
      <RestartConfirmationModal 
        isOpen={showRestartConfirmation}
        onClose={handleCancelRestart}
        onConfirm={handleConfirmRestart}
        message="Are you sure you want to restart the game?"
        confirmButtonText="Restart"
      />
    </div>
  );
};

export default GameBoardPage;