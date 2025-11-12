// FIX: Implemented the StreamCard component.
import React from 'react';
import { StreamData } from '../types';

interface StreamCardProps {
  stream: StreamData;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-200/50 hover:[transform:rotateX(10deg)_rotateY(-4deg)_scale(1.05)]">
      <div className="p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{stream.title}</h3>
        <p className="text-gray-600 mb-4">{stream.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Core Subjects:</h4>
          <div className="flex flex-wrap gap-2">
            {stream.subjects.map((subject, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {subject}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Potential Career Paths:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {stream.careers.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;