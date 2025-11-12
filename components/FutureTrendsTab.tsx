import React, { useState } from 'react';
import { generateTrendAnalysis } from '../services/gemini';
import { TrendAnalysis, GuidanceResult } from '../types';
import { SpinnerIcon, LinkIcon, ExclamationTriangleIcon, TrendingUpIcon, WrenchScrewdriverIcon, CheckIcon, BriefcaseIcon, RocketLaunchIcon, SparklesIcon } from './Icons';

const AnalysisResult: React.FC<{ result: TrendAnalysis }> = ({ result }) => {
    const renderContent = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const elements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="space-y-3 pl-2 mt-4">{listItems}</ul>);
                listItems = [];
            }
        };

        const processLineContent = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
            return parts.map((part, i) =>
                part.startsWith('**') ? (
                    <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
                ) : (
                    part
                )
            );
        };
        
        lines.forEach((line, index) => {
            line = line.trim();
            
            if (line.startsWith('* ') || line.startsWith('- ')) {
                const itemContent = line.substring(2);
                listItems.push(
                    <li key={index} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 leading-relaxed">{processLineContent(itemContent)}</span>
                    </li>
                );
                return;
            }
            
            flushList();

            if (line.startsWith('# ')) {
                elements.push(<h1 key={index} className="text-4xl font-extrabold text-gray-900 mb-4">{line.replace('# ', '')}</h1>);
            } else if (line.startsWith('## ')) {
                const headingText = line.replace('## ', '');
                const emoji = headingText.split(' ')[0];
                const title = headingText.split(' ').slice(1).join(' ');

                let icon: React.ReactNode = <span className="text-2xl">{emoji}</span>;

                if (title.includes('Skills')) {
                    icon = <WrenchScrewdriverIcon className="h-6 w-6 text-purple-600" />;
                } else if (title.includes('Career')) {
                    icon = <BriefcaseIcon className="h-6 w-6 text-purple-600" />;
                } else if (title.includes('Prepare')) {
                    icon = <RocketLaunchIcon className="h-6 w-6 text-purple-600" />;
                }
                
                elements.push(
                     <div key={index} className="flex items-center gap-4 mt-8 mb-4 border-b-2 border-purple-100 pb-3">
                        <div className="flex-shrink-0 bg-purple-50 p-2 rounded-lg">{icon}</div>
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    </div>
                );
            } else {
                 elements.push(
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                        {processLineContent(line)}
                    </p>
                );
            }
        });

        flushList();
        return elements;
    };


    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8 animate-fade-in-up">
            <article className="prose prose-lg max-w-none prose-h1:text-gray-900 prose-h2:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900">
                {renderContent(result.content)}
            </article>
            {result.sources.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-gray-500" />
                        <span>AI-Researched Sources</span>
                    </h3>
                    <ul className="space-y-2">
                        {result.sources.map((source, index) => (
                            <li key={index}>
                                <a
                                    href={source.web.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors group"
                                >
                                    <span className="truncate text-sm font-medium text-purple-700 group-hover:underline">{source.web.title}</span>
                                    <span className="truncate text-xs text-gray-500 block mt-1">{source.web.uri}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

interface FutureTrendsTabProps {
    guidanceResult: GuidanceResult | null;
    onTakeSurvey: () => void;
}

const FutureTrendsTab: React.FC<FutureTrendsTabProps> = ({ guidanceResult, onTakeSurvey }) => {
    const [analysisResult, setAnalysisResult] = useState<TrendAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!guidanceResult?.recommendedCareer) return;

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await generateTrendAnalysis(guidanceResult.recommendedCareer);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!guidanceResult) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800">Get Your Personalized Future Trends Report</h2>
                <p className="mt-2 text-gray-600 max-w-lg mx-auto">
                    Take the AI survey first. We'll use your recommended career path to generate a custom analysis of the trends that will shape your future.
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
                 <div className="flex items-center gap-4 mb-2">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                        <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Personalized Future of Work Report</h1>
                        <p className="text-lg text-gray-600">
                            Based on your recommended career as a <span className="font-bold text-purple-600">{guidanceResult.recommendedCareer}</span>, we'll use Google Search to analyze the future trends impacting this field.
                        </p>
                    </div>
                </div>
                
                {!analysisResult && (
                     <button
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="mt-6 w-full md:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                    >
                         {isLoading ? (
                            <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Analyzing Trends...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Generate My Trend Report</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            
            <div className="mt-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center text-gray-600 min-h-[250px] p-8 bg-white rounded-xl shadow-lg">
                        <SpinnerIcon className="animate-spin h-10 w-10 text-purple-600 mb-4" />
                        <p className="font-semibold text-xl">Analyzing trends for "{guidanceResult.recommendedCareer}"...</p>
                        <p className="text-base mt-1">Using Google Search to gather the latest insights for you.</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl flex flex-col items-center text-center gap-3">
                        <ExclamationTriangleIcon className="h-10 w-10" />
                        <div>
                            <h4 className="font-bold text-lg">Analysis Failed</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {analysisResult && <AnalysisResult result={analysisResult} />}
            </div>
        </div>
    );
};

export default FutureTrendsTab;