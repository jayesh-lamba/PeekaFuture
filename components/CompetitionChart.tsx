import React, { useState } from 'react';
import { findCompetitions } from '../services/gemini';
import type { Competition, GuidanceResult } from '../types';
import { ExclamationTriangleIcon, LinkIcon, SparklesIcon, SpinnerIcon } from './Icons';

const CompetitionCard: React.FC<{ competition: Competition }> = ({ competition }) => {
    const categoryColors: { [key: string]: string } = {
        'Hackathon': 'bg-blue-100 text-blue-800',
        'Olympiad': 'bg-green-100 text-green-800',
        'Contest': 'bg-yellow-100 text-yellow-800',
        'Essay Contest': 'bg-indigo-100 text-indigo-800',
    };
    const categoryColor = categoryColors[competition.category] || 'bg-gray-100 text-gray-800';

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{competition.name}</h4>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
                        {competition.category}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{competition.description}</p>
                <p className="text-sm text-gray-800"><span className="font-semibold">Eligibility:</span> {competition.eligibility}</p>
            </div>
            <a href={competition.link} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex justify-center items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-2 px-4 rounded-lg transition-colors">
                <LinkIcon className="h-4 w-4" />
                <span>Visit Website</span>
            </a>
        </div>
    );
};

const CompetitionsTab: React.FC<{ guidanceResult: GuidanceResult | null, onTakeSurvey: () => void }> = ({ guidanceResult, onTakeSurvey }) => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindCompetitions = async () => {
        if (!guidanceResult?.recommendedCareer) return;

        setIsLoading(true);
        setError(null);
        setCompetitions([]);

        try {
            const result = await findCompetitions(guidanceResult.recommendedCareer);
            setCompetitions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!guidanceResult) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800">Find Competitions Tailored for You</h2>
                <p className="mt-2 text-gray-600 max-w-lg mx-auto">
                    Take the AI survey first. We'll use your recommended career path to find relevant competitions and hackathons.
                </p>
                <button
                    onClick={onTakeSurvey}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 w-auto mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Take the AI Survey</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Live Competition Finder</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                    Based on your recommended career as a <span className="font-bold text-purple-600">{guidanceResult.recommendedCareer}</span>, we'll use Google Search to find relevant, up-to-date competitions for you.
                </p>
                 <button
                    onClick={handleFindCompetitions}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                >
                    {isLoading ? (
                        <>
                            <SpinnerIcon className="animate-spin h-5 w-5" />
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="h-5 w-5" />
                            <span>Find Competitions</span>
                        </>
                    )}
                </button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                            <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-5/6 mb-4"></div>
                             <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-slate-200 rounded mt-4"></div>
                        </div>
                    ))}
                </div>
            )}
            
            {error && (
                 <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    <div>
                        <h4 className="font-bold">Search Failed</h4>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {competitions.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {competitions.map((comp, i) => (
                        <CompetitionCard key={i} competition={comp} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompetitionsTab;