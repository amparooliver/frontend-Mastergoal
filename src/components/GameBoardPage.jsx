import React, { useState } from 'react';

import ChipIcon from './ChipIcon';

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
  team1Color = 'orange', // Add this prop
  team2Color = 'blue',    // Add this prop
  difficulty = 'medium',  // Add this prop
  maxTurns = 40,         // Add this prop
}) => {
  const [gameState, setGameState] = useState({
    // Game pieces positions
    leftPiece: { row: 5, col: 4 },
    RightPiece: { row: 5, col: 10 },
    centerPiece: { row: 5, col: 7 },
  // Special tiles (dots)
  specialTiles: [
    // Left side vertical line
    { row: 3, col: 1 }, { row: 4, col: 1 }, { row: 5, col: 1 },
    { row: 6, col: 1 }, { row: 7, col: 1 },
    // Right side vertical line
    { row: 3, col: 13 }, { row: 4, col: 13 }, { row: 5, col: 13 },
    { row: 6, col: 13 }, { row: 7, col: 13 },
    // Corners
    { row: 0, col: 1 }, { row: 0, col: 13 },
    { row: 10, col: 1 }, { row: 10, col: 13 }
  ]
  });

  const boardRows = 11;
  const boardCols = 15; // Including goal areas
  
  const isGoalArea = (row, col) => {
    // Left goal area
    if (col === 0 && row >= 3 && row <= 7) return 'left';
    // Right goal area  
    if (col === 14 && row >= 3 && row <= 7) return 'right';
    return false;
  };

  const isPiece = (row, col) => {
    if (gameState.leftPiece.row === row && gameState.leftPiece.col === col) return team1Color;
    if (gameState.RightPiece.row === row && gameState.RightPiece.col === col) return team2Color;
    if (gameState.centerPiece.row === row && gameState.centerPiece.col === col) return 'center';
    return false;
  };

    const isSpecialTile = (row, col) => {
    return gameState.specialTiles.some(tile => tile.row === row && tile.col === col);
    };


  const getCellBackground = (row, col) => {
    const goalArea = isGoalArea(row, col);
    if (goalArea) {
      return goalArea === 'left' ? '#48763B' : '#48763B';
    }
    
    // Main field checkerboard pattern
    if (col >= 1 && col <= 13) {
      return ((row + col) % 2 === 0) ? '#48763B' : '#436836';
    }
    
    return 'transparent';
  };

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
        {/* Home Icon Button */}
        <button 
        className="p-3 flex items-center justify-center bg-transparent"
        onClick={onGoHome}
        >
          <img src="/HomeVerticalMenu.svg" alt="Home" className="w-9 h-9" />
        </button>
        {/* Pause Icon Button */}
        <button className="p-3 flex items-center justify-center bg-transparent">
          <img src="/PauseVerticalMenu.svg" alt="Pause" className="w-9 h-9" />
        </button>
        {/* Restart Icon Button */}
        <button className="p-3 flex items-center justify-center bg-transparent">
          <img src="/RestartVerticalMenu.svg" alt="Restart" className="w-9 h-9" />
        </button>
        {/* About/Questionmark Icon Button */}
        <button className="p-3 flex items-center justify-center bg-transparent">
          <img src="/AboutVerticalMenu.svg" alt="About" className="w-9 h-9" />
        </button>
        {/* Settings Icon Button */}
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
                  const isGoal = isSpecialTile(row, col);
                  
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="relative flex items-center justify-center"
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
                      {piece === 'center' && (
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