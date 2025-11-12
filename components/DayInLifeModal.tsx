import React from 'react';
import { DayInLifeSimulation } from '../types';
import { XIcon, SpinnerIcon, ExclamationTriangleIcon } from './Icons';
import Logo from './Logo';

interface DayInLifeModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: DayInLifeSimulation | null;
  isLoading: boolean;
  error: string | null;
}

const DayInLifeModal: React.FC<DayInLifeModalProps> = ({ isOpen, onClose, simulation, isLoading, error }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center text-center text-gray-600 min-h-[300px] justify-center">
          <SpinnerIcon className="animate-spin h-8 w-8 text-purple-600 mb-4" />
          <p className="font-semibold">Crafting your story...</p>
          <p className="text-sm">Bringing a day in the life of a professional to you.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center text-center text-red-600 min-h-[300px] justify-center p-4">
           <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mb-4"/>
          <h3 className="font-bold text-lg text-red-800">Oops! Story Time Failed</h3>
          <p className="text-red-700">{error}</p>
        </div>
      );
    }
    
    if (simulation) {
      return (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">{simulation.storyTitle}</h1>
            <p className="text-lg text-gray-600 text-center italic border-b pb-6">"{simulation.introduction}"</p>
            {simulation.segments.map((segment, index) => (
                <div key={index} className="pt-4">
                    <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">{segment.timeOfDay}</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{segment.title}</h2>
                    <p className="mt-2">{segment.description}</p>
                </div>
            ))}
            <div className="mt-8 pt-6 border-t">
                <h2 className="text-2xl font-bold text-gray-800">A Day's Reflection</h2>
                <p className="mt-2">{simulation.conclusion}</p>
            </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-start">
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">A Day in the Life: {simulation?.careerTitle || '...'}</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                    An AI-powered story by <Logo className="text-sm" />
                </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="px-6 md:px-8 py-8 overflow-y-auto">
          {renderContent()}
        </div>

        <div className="p-4 bg-gray-50 rounded-b-2xl text-center border-t mt-auto">
            <button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default DayInLifeModal;