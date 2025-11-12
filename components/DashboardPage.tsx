// FIX: Implemented the main DashboardPage component to orchestrate the post-login user experience.
import React, { useState, useCallback, useEffect } from 'react';
import { User, DashboardTab, SurveyAnswers, GuidanceResult, RecommendedStream, Roadmap, ArtistRoadmap, DayInLifeSimulation, StreamData } from '../types';
import { signOut, getStreamData } from '../services/firebase';
import { generateGuidance, generateDayInLifeSimulation, generateFollowUpGuidance } from '../services/gemini';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import { MenuIcon, SparklesIcon, SpinnerIcon, CheckBadgeIcon, ExclamationTriangleIcon } from './Icons';
import StreamCard from './StreamCard';
import CompetitionsTab from './CompetitionChart';
import CollegeInsights from './CollegeInsights';
import EntrepreneurshipTab from './EntrepreneurshipTab';
import SurveyModal from './SurveyModal';
import GuidanceModal from './GuidanceModal';
import AcademicNavigatorTab from './AcademicNavigatorTab';
import ArtistsTab from './ArtistsTab';
import DayInLifeModal from './DayInLifeModal';
import FutureTrendsTab from './FutureTrendsTab';

interface DashboardPageProps {
  user: User;
}

const StreamGuidanceTab: React.FC<{ onTakeSurvey: () => void; guidanceResult: GuidanceResult | null }> = ({ onTakeSurvey, guidanceResult }) => {
    const [followUpQuestion, setFollowUpQuestion] = useState('');
    const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
    const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
    const [followUpError, setFollowUpError] = useState<string | null>(null);
    const [streamData, setStreamData] = useState<StreamData[]>([]);
    const [isStreamDataLoading, setIsStreamDataLoading] = useState(true);


    useEffect(() => {
        // Reset follow-up state when a new survey result is generated
        setFollowUpQuestion('');
        setFollowUpAnswer(null);
        setIsFollowUpLoading(false);
        setFollowUpError(null);
    }, [guidanceResult]);

    useEffect(() => {
        const fetchStreamData = async () => {
            try {
                setIsStreamDataLoading(true);
                const data = await getStreamData();
                setStreamData(data);
            } catch (error) {
                console.error("Failed to fetch stream data:", error);
            } finally {
                setIsStreamDataLoading(false);
            }
        };
        fetchStreamData();
    }, []);

    const handleFollowUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!followUpQuestion.trim() || !guidanceResult) return;

        setIsFollowUpLoading(true);
        setFollowUpError(null);
        setFollowUpAnswer(null);
        try {
            const result = await generateFollowUpGuidance(followUpQuestion, guidanceResult);
            setFollowUpAnswer(result);
        } catch (err) {
            let errorMessage = 'An unknown error occurred while generating the response.';
            if (err instanceof Error) {
                const lowerCaseError = err.message.toLowerCase();
                if (lowerCaseError.includes('503') || lowerCaseError.includes('overloaded') || lowerCaseError.includes('unavailable')) {
                    errorMessage = 'The AI service is currently busy. Please wait a moment and try again.';
                } else if (lowerCaseError.includes('api key')) {
                    errorMessage = 'There seems to be an issue with the API configuration.';
                } else {
                    // Attempt to parse a more specific error from a potential JSON response
                    try {
                        const errorJson = JSON.parse(err.message);
                        if (errorJson?.error?.message) {
                            errorMessage = errorJson.error.message;
                        }
                    } catch {
                        // Not a JSON error, use the original message
                        errorMessage = err.message;
                    }
                }
            }
            setFollowUpError(errorMessage);
        } finally {
            setIsFollowUpLoading(false);
        }
    };
    
    const renderFollowUpResponse = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="space-y-4 pl-1">{listItems}</ul>);
                listItems = [];
            }
        };

        const processLineContent = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
            return parts.map((part, i) =>
                part.startsWith('**') ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : part
            );
        };

        lines.forEach((line, index) => {
            line = line.trim();
            if (line.startsWith('* ')) {
                listItems.push(
                    <li key={index} className="flex items-start gap-3">
                        <CheckBadgeIcon className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-base leading-relaxed">{processLineContent(line.substring(2))}</span>
                    </li>
                );
                return;
            }

            flushList();

            if (line.startsWith('### ')) {
                elements.push(<h4 key={index} className="text-xl font-bold text-gray-800 mt-8 mb-3">{line.replace('### ', '')}</h4>);
            } else if (line.startsWith('## ')) {
                elements.push(<h3 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b-2 border-purple-200 pb-2">{line.replace('## ', '')}</h3>);
            } else {
                elements.push(<p key={index} className="text-gray-700 leading-relaxed text-base">{processLineContent(line)}</p>);
            }
        });
        
        flushList();
        
        return <div className="space-y-4">{elements}</div>;
    };


    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AI-Powered Stream Guidance</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                             {guidanceResult ? 'Your personalized recommendation is ready. Explore further or take the survey again.' : 'Answer a few questions about your interests and personality to get a personalized recommendation.'}
                        </p>
                    </div>
                    <button
                        onClick={onTakeSurvey}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>{guidanceResult ? 'Take Survey Again' : 'Take the AI Survey'}</span>
                    </button>
                </div>
            </div>
            
            {guidanceResult ? (
                 <>
                    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up animation-delay-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Your AI Recommendation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-purple-700">RECOMMENDED STREAM</p>
                                <p className="text-2xl font-bold text-purple-900">{guidanceResult.recommendedStream}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-green-700">TOP CAREER PATH</p>
                                <p className="text-2xl font-bold text-green-900">{guidanceResult.recommendedCareer}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up animation-delay-400">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Explore "What If?" Scenarios</h3>
                        <p className="text-gray-600 mb-4">Curious about other paths? Ask the AI for blended career ideas or alternatives.</p>
                        <form onSubmit={handleFollowUpSubmit}>
                            <textarea
                                value={followUpQuestion}
                                onChange={e => setFollowUpQuestion(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base p-3"
                                placeholder="e.g., What if I like both Science and Arts? What careers combine them?"
                                rows={3}
                            />
                            <button
                                type="submit"
                                disabled={isFollowUpLoading || !followUpQuestion.trim()}
                                className="mt-4 w-full sm:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
                            >
                                {isFollowUpLoading ? (
                                    <>
                                        <SpinnerIcon className="animate-spin h-5 w-5" />
                                        <span>Thinking...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-5 w-5" />
                                        <span>Ask AI</span>
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-6">
                             {isFollowUpLoading && (
                                <div className="pt-6 border-t animate-pulse flex space-x-4">
                                    <div className="flex-shrink-0 bg-slate-200 rounded-lg h-12 w-12"></div>
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="h-3 bg-slate-200 rounded"></div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-3 bg-slate-200 rounded col-span-2"></div>
                                            <div className="h-3 bg-slate-200 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-3 bg-slate-200 rounded"></div>
                                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            )}
                            {followUpError && 
                                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3">
                                    <ExclamationTriangleIcon className="h-6 w-6" />
                                    <div>
                                        <h4 className="font-bold">Generation Failed</h4>
                                        <p>{followUpError}</p>
                                    </div>
                                </div>
                            }
                            {followUpAnswer && (
                                <div className="pt-6 border-t animate-fade-in-up">
                                    {renderFollowUpResponse(followUpAnswer)}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                isStreamDataLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-8 space-y-4">
                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                <div className="h-8 bg-slate-200 rounded w-1/2 mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {streamData.map((stream, index) => (
                            <div key={stream.id} className={`animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
                                <StreamCard stream={stream} />
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.StreamGuidance);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSurveyOpen, setSurveyOpen] = useState(false);
  const [isGuidanceOpen, setGuidanceOpen] = useState(false);
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResult | null>(null);
  const [isGuidanceLoading, setGuidanceLoading] = useState(false);
  const [recommendedStream, setRecommendedStream] = useState<RecommendedStream>('Unknown');
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);
  const [isRoadmapLoading, setRoadmapLoading] = useState(false);
  const [artistRoadmapData, setArtistRoadmapData] = useState<ArtistRoadmap | null>(null);
  const [isArtistRoadmapLoading, setIsArtistRoadmapLoading] = useState(false);

  const [isDayInLifeModalOpen, setIsDayInLifeModalOpen] = useState(false);
  const [dayInLifeData, setDayInLifeData] = useState<DayInLifeSimulation | null>(null);
  const [isDayInLifeLoading, setIsDayInLifeLoading] = useState(false);
  const [dayInLifeError, setDayInLifeError] = useState<string | null>(null);


  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSurveySubmit = useCallback(async (answers: SurveyAnswers) => {
    setSurveyOpen(false);
    setGuidanceOpen(true);
    setGuidanceLoading(true);
    setRoadmapData(null); // Reset roadmap when new survey is taken
    setArtistRoadmapData(null); // Reset artist roadmap as well
    try {
      const result = await generateGuidance(answers);
      setGuidanceResult(result);
      if (result) {
        setRecommendedStream(result.recommendedStream);
      }
    } catch (error) {
      console.error('Error generating guidance:', error);
      setGuidanceResult({ text: 'An error occurred while generating your guidance. Please try again.', recommendedStream: 'Unknown', recommendedCareer: 'Unknown' });
    } finally {
      setGuidanceLoading(false);
    }
  }, []);
  
  const handleSimulateDay = useCallback(async () => {
    if (!guidanceResult?.recommendedCareer || guidanceResult.recommendedCareer === 'Unknown') {
        return;
    }
    
    setGuidanceOpen(false);
    setIsDayInLifeModalOpen(true);
    setIsDayInLifeLoading(true);
    setDayInLifeData(null);
    setDayInLifeError(null);
    
    try {
        const result = await generateDayInLifeSimulation(guidanceResult.recommendedCareer);
        setDayInLifeData(result);
    } catch (error) {
        console.error('Error generating day in life simulation:', error);
        setDayInLifeError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
        setIsDayInLifeLoading(false);
    }
  }, [guidanceResult]);

  const renderContent = () => {
    switch (activeTab) {
      case DashboardTab.StreamGuidance:
        return <StreamGuidanceTab onTakeSurvey={() => setSurveyOpen(true)} guidanceResult={guidanceResult} />;
      case DashboardTab.Competition:
        return <CompetitionsTab guidanceResult={guidanceResult} onTakeSurvey={() => setSurveyOpen(true)} />;
      case DashboardTab.CollegeInsights:
        return <CollegeInsights recommendedStream={recommendedStream} />;
      case DashboardTab.Entrepreneurship:
        return <EntrepreneurshipTab />;
      case DashboardTab.AcademicNavigator:
        return <AcademicNavigatorTab 
            guidanceResult={guidanceResult} 
            roadmapData={roadmapData}
            setRoadmapData={setRoadmapData}
            isLoading={isRoadmapLoading}
            setIsLoading={setRoadmapLoading}
            onTakeSurvey={() => setSurveyOpen(true)}
        />;
      case DashboardTab.FutureTrends:
        return <FutureTrendsTab 
            guidanceResult={guidanceResult} 
            onTakeSurvey={() => setSurveyOpen(true)} 
        />;
      case DashboardTab.Artists:
        return <ArtistsTab 
            guidanceResult={guidanceResult}
            artistRoadmapData={artistRoadmapData}
            setArtistRoadmapData={setArtistRoadmapData}
            isLoading={isArtistRoadmapLoading}
            setIsLoading={setIsArtistRoadmapLoading}
            onTakeSurvey={() => setSurveyOpen(true)}
        />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b lg:justify-end">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-600 lg:hidden">
              <MenuIcon className="h-6 w-6" />
           </button>
           <UserProfile user={user} onSignOut={handleSignOut} />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
      <SurveyModal 
        isOpen={isSurveyOpen} 
        onClose={() => setSurveyOpen(false)} 
        onSubmit={handleSurveySubmit} 
      />
      <GuidanceModal 
        isOpen={isGuidanceOpen} 
        onClose={() => setGuidanceOpen(false)} 
        result={guidanceResult}
        isLoading={isGuidanceLoading}
        onSimulate={handleSimulateDay}
      />
       <DayInLifeModal 
        isOpen={isDayInLifeModalOpen}
        onClose={() => setIsDayInLifeModalOpen(false)}
        simulation={dayInLifeData}
        isLoading={isDayInLifeLoading}
        error={dayInLifeError}
    />
    </div>
  );
};

export default DashboardPage;