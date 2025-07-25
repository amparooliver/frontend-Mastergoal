// src/components/RestartConfirmationModal.jsx
import React from 'react';

const RestartConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#255935] bg-opacity-80 backdrop-blur-sm">
      <div className="bg-[#E6DCB7] p-8 rounded-lg max-w-sm w-full text-center ">
        <div className="flex justify-center mb-2">
            <img src="/GameRestart.svg" alt="Home" className="w-16 h-16" />
        </div>
        <h2 className="text-[2.6rem] font-oswald font-medium text-center text-[#255935] mb-2 tracking-1p">RESTART GAME</h2>
        <h3 className="text-xl font-oswald font-medium text-[#255935] mb-6">
          Are you sure you want to quit the current game and start a new one?
        </h3>
        <div className="flex flex-col sm:flex-row justify-around gap-4">
            <button
                onClick={onClose}
                className="flex-1 text-xl py-3 bg-[#A40606] text-[#F5EFD5] font-oswald font-bold rounded-lg hover:bg-[#850505] transition duration-300"
            >
                CANCEL
            </button>
            <button
                onClick={onConfirm}
                className="flex-1 text-xl py-3 bg-[#255935] text-[#F5EFD5] font-oswald font-bold rounded-lg hover:bg-[#1C3E28] transition duration-300"
            >
                RESTART
            </button>
        </div>
      </div>
    </div>
  );
};

export default RestartConfirmationModal;