// FIX: Implemented the AIIdeaGenerator component for the entrepreneurship tab.
import React, { useState } from 'react';
import { generateBusinessIdea, generateBusinessPlan } from '../services/gemini';
import { StartupIdea, BusinessPlan } from '../types';
import { SparklesIcon, SpinnerIcon, TargetIcon, KeyIcon, DollarSignIcon, BriefcaseIcon } from './Icons';
import BusinessPlanModal from './BusinessPlanModal';

const IdeaResultCard: React.FC<{ idea: StartupIdea, onCreatePlan: () => void, isPlanLoading: boolean }> = ({ idea, onCreatePlan, isPlanLoading }) => {
    const investmentColors = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };

    return (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-in fade-in-0 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your AI Business Blueprint:</h3>
            <div className="bg-purple-50/50 rounded-lg border border-purple-200 p-6 space-y-6">
                
                <div>
                    <h4 className="text-xl font-bold text-purple-800">{idea.businessName}</h4>
                    <p className="text-base text-gray-600 italic mt-1">"{idea.pitch}"</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0"><TargetIcon className="h-6 w-6 text-purple-600" /></div>
                        <div>
                            <h5 className="font-semibold text-gray-800">Target Audience</h5>
                            <p className="text-gray-600">{idea.targetAudience}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="flex-shrink-0"><KeyIcon className="h-6 w-6 text-purple-600" /></div>
                        <div>
                            <h5 className="font-semibold text-gray-800">Key Features</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1">
                                {idea.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="flex-shrink-0"><DollarSignIcon className="h-6 w-6 text-purple-600" /></div>
                        <div>
                            <h5 className="font-semibold text-gray-800">Monetization & Investment</h5>
                             <p className="text-gray-600">{idea.monetizationStrategy}</p>
                             <span className={`mt-2 inline-block text-xs font-medium px-2.5 py-1 rounded-full ${investmentColors[idea.investmentLevel]}`}>
                                {idea.investmentLevel} Investment
                            </span>
                        </div>
                    </div>
                </div>
                 <div className="pt-6 border-t border-purple-200/50">
                    <button
                        onClick={onCreatePlan}
                        disabled={isPlanLoading}
                        className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                    >
                        {isPlanLoading ? (
                            <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Drafting Plan...</span>
                            </>
                        ) : (
                            <>
                                <BriefcaseIcon className="h-5 w-5" />
                                <span>Create Business Plan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AIIdeaGenerator: React.FC = () => {
    const [degree, setDegree] = useState('B.Tech');
    const [interest, setInterest] = useState('');
    const [idea, setIdea] = useState<StartupIdea | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // State for Business Plan
    const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const [planError, setPlanError] = useState('');
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);


    const handleIdeaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!interest) {
            setError('Please enter an interest.');
            return;
        }
        setError('');
        setIsLoading(true);
        setIdea(null);
        setBusinessPlan(null); // Clear old plan
        try {
            const result = await generateBusinessIdea(degree, interest);
            setIdea(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate an idea. Please try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlan = async () => {
        if (!idea) return;
        
        setIsPlanLoading(true);
        setPlanError('');
        setBusinessPlan(null);

        try {
            const result = await generateBusinessPlan(idea);
            setBusinessPlan(result);
            setIsPlanModalOpen(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate business plan. Please try again.';
            setPlanError(errorMessage);
        } finally {
            setIsPlanLoading(false);
        }
    };
    
    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-200/50">
                <div className="flex items-center gap-3 mb-3">
                    <SparklesIcon className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">AI Business Idea Generator</h2>
                </div>
                <p className="text-base text-gray-600 mb-6">
                    Combine your academic field with a personal interest to spark a unique business idea.
                </p>
                <form onSubmit={handleIdeaSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">Your Field</label>
                            <select
                                id="degree"
                                value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option>B.Tech</option>
                                <option>B.Com</option>
                                <option>B.A.</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">Your Interest</label>
                            <input
                                type="text"
                                id="interest"
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                placeholder="e.g., Sustainable fashion, Gaming, Fitness"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                    >
                        {isLoading ? (
                            <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Brainstorming...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Generate Idea</span>
                            </>
                        )}
                    </button>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                
                {idea && <IdeaResultCard idea={idea} onCreatePlan={handleCreatePlan} isPlanLoading={isPlanLoading} />}
                {planError && !isPlanLoading && <p className="mt-4 text-center text-sm text-red-600">{planError}</p>}
            </div>

            <BusinessPlanModal 
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                plan={businessPlan}
                isLoading={isPlanLoading}
                error={planError}
            />
        </>
    );
};

export default AIIdeaGenerator;
