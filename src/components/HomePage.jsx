import { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";


const players = [
  { 
    name: "Messi", 
    image: "/images/messi.png", 
    piece: "/images/BluePiece.png", 
    sizes: { 
      player: { height: '65vh' }, 
      piece: { height: '85vh' } 
    },
    position: { playerTop: '13%', pieceLeft: '-25%', pieceRight: '100%' }
  },
  { 
    name: "Almiron", 
    image: "/images/almiron.png", 
    piece: "/images/RedPiece.png", 
    sizes: { 
      player: { height: '65vh' }, 
      piece: { height: '80vh' } 
    },
    position: { playerTop: '10%', pieceLeft: '-25%', pieceRight: '97%' }
  },
  { 
    name: "Neymar", 
    image: "/images/neymar.png", 
    piece: "/images/YellowPiece.png", 
    sizes: { 
      player: { height: '60vh' }, 
      piece: { height: '80vh' } 
    },
    position: { playerTop: '17%', pieceLeft: '-25%', pieceRight: '100%' }
  }
];

const playerColors = ['#88B8DE', '#CF3331', '#FCCD2A'];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % players.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#FFFBE6] relative">
      <nav className="absolute top-0 flex gap-10 text-lg font-bold text-[#15191C] font-inter text-2xl ">
      <a 
          href="#rules" 
          className={`shadow-mdtransition-colors duration-300 hover:scale-110 hover:text-${playerColors[currentIndex].replace('#', '')}`}>
          Rules
        </a>
        <a 
          href="#home" 
          className={`transition-colors duration-300  hover:scale-110 hover:text-${playerColors[currentIndex].replace('#', '')}`}>
          Home
        </a>
        <a 
          href="#about" 
          className={`transition-colors duration-300 hover:scale-110 hover:text-${playerColors[currentIndex].replace('#', '')}`}>
          About
        </a>
      </nav>

      <div className="relative flex justify-center items-center w-full h-full">
        <img 
          src={players[currentIndex].piece} 
          alt={`${players[currentIndex].name} Piece`} 
          className={`absolute left-0 transition-transform duration-1000 `}
          style={{ height: players[currentIndex].sizes.piece.height, left: players[currentIndex].position.pieceLeft }} 
        />

        {/* Main Circle Container */}
        <div className="relative flex justify-center items-center">
          {/* Outer Circle */}
          <div className="w-[80vh] h-[80vh] bg-[#FFFDF4] rounded-full flex justify-center items-center relative">
            
            {/* Inner Circle */}
            <div className="w-[70vh] h-[70vh] bg-[#F0EBD0] rounded-full flex justify-center items-center">
              <div className="w-[67vh] h-[67vh] bg-[#FFFCEB] rounded-full"></div>
            </div>

            {/* Text "MASTERGOAL" + Button */}
            <div className="absolute flex flex-col items-center">
              <h1 
                className="text-center text-[32vh] font-bebas tracking-wide-plus flex items-center justify-center relative leading-none"
              >
                <span style={{ color: playerColors[currentIndex] }}>MASTER</span>
                <span className="text-[#15191C] relative mx-2">GO</span>
                <span style={{ color: playerColors[currentIndex] }}>AL</span>
              </h1>

              {/* Play Button - Positioned Right Below "GO" */}
              <Link 
                to="/game"
                className="font-inter font-bold tracking-wide-mini text-[3vh] px-[2vh] py-[1vh] bg-[#15191C] text-white rounded-lg shadow-md mt-[0vh] translate-x-[29.5vh] -translate-y-[3.5vh] flex items-center gap-2 transition-all duration-300 ease-in-out 
                hover:bg-[#333] hover:scale-110 hover:shadow-lg"
              >
                PLAY NOW <Icon icon="solar:play-bold" className="text-[3vh]" />
                
              </Link>
            </div>
          </div>

          <img
            src={players[currentIndex].image}
            alt={players[currentIndex].name}
            className={`absolute z-20 transition-opacity duration-1000 ${animate ? 'animate-fade-in' : ''}`}
            style={{ height: players[currentIndex].sizes.player.height, top: players[currentIndex].position.playerTop }} 
          />
        </div>

        <img 
          src={players[currentIndex].piece} 
          alt={`${players[currentIndex].name} Piece`} 
          className={`absolute right-0 transition-transform duration-1000`}
          style={{ height: players[currentIndex].sizes.piece.height, left: players[currentIndex].position.pieceRight }} 
        />
      </div>
    </div>
  );
}
