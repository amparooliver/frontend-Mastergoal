export default function GamePage() {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-[#FFFBE6]">
        <h1 className="text-5xl font-bold text-[#15191C]">Welcome to MasterGoal</h1>
        <p className="text-lg text-[#555] mt-4">Game is loading...</p>
        
        <button 
          onClick={() => window.history.back()} 
          className="mt-6 px-6 py-3 bg-[#15191C] text-white font-bold rounded-lg shadow-md hover:bg-[#333] hover:scale-110 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }
  