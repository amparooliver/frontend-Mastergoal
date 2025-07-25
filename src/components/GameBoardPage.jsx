import React, { useEffect, useState } from 'react';

import ChipIcon from './ChipIcon';

// API Configuration - automatically detects environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-mastergoal.onrender.com'
  : 'http://localhost:5000';

console.log('Current environment:', process.env.NODE_ENV);
console.log('Using API URL:', API_BASE_URL);

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
  team1Name = 'YOU',
  team2Name = 'AI',
  team1Score = 0,
  team2Score = 0,
  timerEnabled = true,
  timerValue = 30,
  team1Color = 'orange',
  team2Color = 'blue',
  difficulty = 'medium',
  maxTurns = 40,
}) => {
  const [serverGameState, setServerGameState] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

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
      
      console.log("Fetched game state:", gameState);
      console.log("Fetched legal moves:", moves);
      
      setServerGameState(gameState);
      setLegalMoves(moves);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

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
      console.log("Deselected piece");
      return;
    }

    // If it's your piece and it has legal moves → select it
    if (!selectedPiece && piece === team1Color) {
      if (pieceHasLegalMoves(row, col)) {
        setSelectedPiece({ row, col });
        console.log(`Selected piece at frontend (${row}, ${col}) = backend (${frontendToBackend(row, col).backendRow}, ${frontendToBackend(row, col).backendCol})`);
      } else {
        console.log("This piece has no legal moves available");
      }
      return;
    }

    // If it's the ball and there are kick moves available
    if (!selectedPiece && piece === 'ball') {
      // Check if there are any kick moves available
      const kickMoves = legalMoves.filter(move => move.type === 'kick');
      if (kickMoves.length > 0) {
        setSelectedPiece({ row, col, isBall: true });
        console.log(`Selected ball for kicking at frontend (${row}, ${col})`);
      } else {
        console.log("No kick moves available for the ball");
      }
      return;
    }

    // If a piece is selected and clicking on a destination
    if (selectedPiece) {
      const isValidMove = isMoveLegal(selectedPiece.row, selectedPiece.col, row, col);
      
      if (!isValidMove) {
        console.log("This move is not legal");
        // Optionally deselect the piece or play error sound
        return;
      }

      const moveType = getMoveType(selectedPiece.row, selectedPiece.col, row, col);
      const fromBackend = frontendToBackend(selectedPiece.row, selectedPiece.col);
      const toBackend = frontendToBackend(row, col);

      console.log(`Attempting ${moveType} from backend (${fromBackend.backendRow}, ${fromBackend.backendCol}) to backend (${toBackend.backendRow}, ${toBackend.backendCol})`);

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
          console.log("Move rejected by server");
          return;
        }

        const response = await res.json();
        if (response.success) {
          setServerGameState(response.state);
          setSelectedPiece(null);
          console.log(`${moveType} accepted`);
          
          // Fetch new legal moves for the next turn
          await fetchGameData();
        } else {
          console.log("Move failed:", response.error);
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

  if (!serverGameState) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Loading game...
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
        onClick={onGoHome}
        >
          <img src="/HomeVerticalMenu.svg" alt="Home" className="w-9 h-9" />
        </button>
        <button className="p-3 flex items-center justify-center bg-transparent">
          <img src="/PauseVerticalMenu.svg" alt="Pause" className="w-9 h-9" />
        </button>
        <button className="p-3 flex items-center justify-center bg-transparent">
          <img src="/RestartVerticalMenu.svg" alt="Restart" className="w-9 h-9" />
        </button>
        <button className="p-3 flex items-center justify-center bg-transparent">
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
                {team1Name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-3xl" style={{ color: getChipColor(team1Color) }}>
                {team1Score}
              </span>
              <span className="font-bold text-3xl text-[#F5EFD5]">-</span>
              <span className="font-bold text-3xl" style={{ color: getChipColor(team2Color) }}>
                {team2Score}
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: getChipColor(team2Color) }}>
              <span className="font-bold text-lg" style={{ color: team2Color === 'white' ? '#1C0F01' : '#F5EFD5' }}>
                {team2Name}
              </span>
            </div>
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
                  const hasLegalMoves = piece === team1Color && pieceHasLegalMoves(row, col);
                  
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`relative flex items-center justify-center cursor-pointer transition duration-100 ${
                        isSelected ? 'ring-4 ring-yellow-400' : ''
                      } ${
                        isValidDest ? 'ring-2 ring-green-400' : ''
                      } ${
                        hasLegalMoves && !selectedPiece ? 'ring-2 ring-blue-400' : ''
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
          <div className="bg-[#1C0F01] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center justify-center bg-[#FF8C00] rounded-full w-24 h-24 text-center shadow-inner">
              <div className="text-2xl font-bold text-[#1C0F01]">{timerValue}</div>
              <div className="text-xs font-semibold text-[#1C0F01]">
                {timerValue === 1 ? 'second left' : 'seconds left'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoardPage;