// src/components/PauseGameModal.jsx
import React from 'react';

const PauseGameModal = ({ isOpen, onClose }) => { // No onConfirm needed, just close
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#255935] bg-opacity-80 backdrop-blur-sm">
      <div className="bg-[#E6DCB7] p-8 rounded-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-2">
            <img src="/GamePaused.svg" alt="Home" className="w-16 h-16" />
        </div>
        <h2 className="text-[2.6rem] font-oswald font-medium text-center text-[#255935] mb-2 tracking-1p">
          GAME PAUSED
        </h2>
        <h3 className="text-xl font-oswald font-medium text-[#255935] mb-6">
          The game is currently paused. No peeking!
        </h3>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="flex-1/2 text-xl bg-[#255935] text-[#F5EFD5] font-oswald font-semibold rounded-lg hover:bg-[#1C3E28] transition duration-300"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseGameModal;