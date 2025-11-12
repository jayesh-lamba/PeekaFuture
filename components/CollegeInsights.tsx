// FIX: Implemented the CollegeInsights component to display, filter, and compare college data.
import React, { useState, useEffect, useMemo } from 'react';
import { getCollegeData } from '../services/firebase';
import { performConversationalSearch } from '../services/gemini';
import type { College, RecommendedStream, CollegeSearchFilters } from '../types';
import { SparklesIcon, ScaleIcon, StarIcon, SpinnerIcon, XIcon, ExclamationTriangleIcon } from './Icons';
import CollegeCompareModal from './CollegeCompareModal';

const StarRating: React.FC<{
    collegeId: string;
    rating: number;
    count: number;
    onRate: (collegeId: string, newRating: number) => void;
}> = ({ collegeId, rating, count, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="mt-4">
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => onRate(collegeId, star)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        aria-label={`Rate ${star} stars`}
                    >
                        <StarIcon
                            className="h-7 w-7"
                            filled={(hoverRating || Math.round(rating)) >= star}
                        />
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
                {rating.toFixed(1)} stars ({count.toLocaleString()} ratings)
            </p>
        </div>
    );
};


const CollegeCard: React.FC<{ college: College; onSelect: (id: string) => void; isSelected: boolean; selectionDisabled: boolean; onRate: (collegeId: string, rating: number) => void; }> = ({ college, onSelect, isSelected, selectionDisabled, onRate }) => {
    const ownershipColor = college.ownership === 'Government' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'ring-4 ring-purple-400 shadow-2xl scale-105' : 'hover:shadow-lg hover:-translate-y-1'}`}>
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                         <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                         <p className="text-sm text-gray-500">{college.city}, {college.ownership}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ownershipColor}`}>{college.ownership}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-gray-700">NIRF Ranking</p>
                        <p className="text-gray-600 font-bold">#{college.nirfRanking} <span className="font-normal">in India</span></p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Avg. Package</p>
                        <p className="text-green-600 font-bold">₹{college.avg_package / 100000} LPA</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Total Fees</p>
                        <p className="text-gray-600">~₹{college.fees / 100000} Lakhs</p>
                    </div>
                </div>

                <StarRating
                    collegeId={college.id}
                    rating={college.avgRating}
                    count={college.ratingCount}
                    onRate={onRate}
                />

                <div className="mt-6">
                     <button 
                        onClick={() => onSelect(college.id)}
                        disabled={!isSelected && selectionDisabled}
                        className={`w-full font-bold py-2 px-4 rounded-lg transition-colors ${isSelected ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    >
                        {isSelected ? 'Remove from Compare' : (selectionDisabled ? 'Max 3 Selected' : 'Add to Compare')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface CollegeInsightsProps {
    recommendedStream: RecommendedStream;
}

const CollegeInsights: React.FC<CollegeInsightsProps> = ({ recommendedStream }) => {
    const [allColleges, setAllColleges] = useState<College[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);
    
    // New state for conversational search
    const [searchQuery, setSearchQuery] = useState('');
    const [aiFilters, setAiFilters] = useState<CollegeSearchFilters | null>(null);
    const [aiTextResponse, setAiTextResponse] = useState<string | null>(null);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [aiCollegeNames, setAiCollegeNames] = useState<string[]>([]);

    const [activeStream, setActiveStream] = useState<RecommendedStream>(recommendedStream === 'Unknown' ? 'Science' : recommendedStream);
    
     useEffect(() => {
        const fetchColleges = async () => {
            try {
                setIsLoading(true);
                const data = await getCollegeData();
                setAllColleges(data);
            } catch (error) {
                console.error("Failed to fetch college data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        if (recommendedStream !== 'Unknown') {
            setActiveStream(recommendedStream);
            setAiFilters(null); // Clear AI filters if recommended stream changes
            setAiTextResponse(null);
            setAiCollegeNames([]);
        }
    }, [recommendedStream]);

    const handleRateCollege = (collegeId: string, newRating: number) => {
        setAllColleges(prevColleges => 
            prevColleges.map(college => {
                if (college.id === collegeId) {
                    const oldTotal = college.avgRating * college.ratingCount;
                    const newTotal = oldTotal + newRating;
                    const newCount = college.ratingCount + 1;
                    const newAvg = newTotal / newCount;
                    return { ...college, avgRating: newAvg, ratingCount: newCount };
                }
                return college;
            })
        );
    };
    
    const handleSelectCollege = (id: string) => {
        setSelectedColleges(prev => {
            if (prev.includes(id)) {
                return prev.filter(cid => cid !== id);
            }
            if (prev.length < 3) {
                return [...prev, id];
            }
            return prev; // Max 3 selected
        });
    };

    const handleConversationalSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsAiSearching(true);
        setSearchError(null);
        setAiTextResponse(null);
        setAiFilters(null);
        setAiCollegeNames([]);

        try {
            const result = await performConversationalSearch(searchQuery);
            setAiFilters(result.filters);
            setAiTextResponse(result.textResponse);
            setAiCollegeNames(result.collegeNamesToFilter || []);

            // Only change the active stream button if it's a search query, not a comparison.
            if (result.filters.stream && (!result.collegeNamesToFilter || result.collegeNamesToFilter.length === 0)) {
                setActiveStream(result.filters.stream);
            }
        } catch (err) {
            setSearchError(err instanceof Error ? err.message : 'An unexpected error occurred during the search.');
        } finally {
            setIsAiSearching(false);
        }
    };

    const clearAiSearch = () => {
        setSearchQuery('');
        setAiFilters(null);
        setAiTextResponse(null);
        setSearchError(null);
        setAiCollegeNames([]);
        // Reset to recommended stream or default
        setActiveStream(recommendedStream === 'Unknown' ? 'Science' : recommendedStream);
    };

    const handleStreamButtonClick = (stream: RecommendedStream) => {
        clearAiSearch();
        setActiveStream(stream);
    };

    const filteredColleges = useMemo(() => {
        let filtered = [...allColleges];
        
        if (aiCollegeNames.length > 0) {
            const lowerCaseNames = aiCollegeNames.map(name => name.toLowerCase());
            return filtered.filter(c => lowerCaseNames.includes(c.name.toLowerCase()));
        }

        if (aiFilters) {
            if (aiFilters.stream) {
                filtered = filtered.filter(c => c.stream === aiFilters.stream);
            }
            if (aiFilters.cities && aiFilters.cities.length > 0) {
                filtered = filtered.filter(c => aiFilters.cities!.some(city => c.city.toLowerCase().includes(city.toLowerCase())));
            }
            if (aiFilters.ownership) {
                filtered = filtered.filter(c => c.ownership === aiFilters.ownership);
            }
            if (aiFilters.maxFees) {
                filtered = filtered.filter(c => c.fees <= aiFilters.maxFees!);
            }
            if (aiFilters.minAvgPackage) {
                filtered = filtered.filter(c => c.avg_package >= aiFilters.minAvgPackage!);
            }
            if (aiFilters.minRating) {
                filtered = filtered.filter(c => c.avgRating >= aiFilters.minRating!);
            }
            if (aiFilters.courses && aiFilters.courses.length > 0) {
                filtered = filtered.filter(c => aiFilters.courses!.some(course => c.courses.join(' ').toLowerCase().includes(course.toLowerCase())));
            }
        } else {
            filtered = filtered.filter(c => c.stream === activeStream);
        }

        return filtered;
    }, [allColleges, activeStream, aiFilters, aiCollegeNames]);

    const collegesToCompare = allColleges.filter(c => selectedColleges.includes(c.id));
    
    const renderAiTextResponse = (text: string) => {
        return text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
            if (line.startsWith('## ')) return <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h3>;
            if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc text-gray-800">{line.substring(2)}</li>;
            const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
            return (
                <p key={index} className="text-gray-800 leading-relaxed my-2">
                    {parts.map((part, i) =>
                        part.startsWith('**') ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : part
                    )}
                </p>
            );
        });
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                <h1 className="text-3xl font-bold text-gray-900">College Insights</h1>
                <p className="mt-2 text-lg text-gray-600">Explore, rate, and compare top colleges in India.</p>

                {/* Conversational Search UI */}
                <div className="mt-6">
                    <form onSubmit={handleConversationalSearch} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ask anything, e.g., 'Top private engineering colleges in Mumbai...'"
                            className="flex-grow w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                        <button
                            type="submit"
                            disabled={isAiSearching}
                            className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
                        >
                            {isAiSearching ? (
                                <>
                                    <SpinnerIcon className="animate-spin h-5 w-5" />
                                    <span>Searching...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="h-5 w-5" />
                                    <span>Ask AI</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Manual Filters */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {(['Science', 'Commerce', 'Arts / Humanities'] as RecommendedStream[]).map(stream => (
                        <button
                            key={stream}
                            onClick={() => handleStreamButtonClick(stream)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeStream === stream && !aiFilters && aiCollegeNames.length === 0 ? 'bg-purple-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {stream}
                        </button>
                    ))}
                </div>

                {recommendedStream !== 'Unknown' && !aiFilters && aiCollegeNames.length === 0 && (
                    <div className="mt-4 bg-purple-50 border border-purple-200 text-purple-800 p-4 rounded-lg flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6" />
                        <p>Based on your survey, we've pre-selected the <span className="font-bold">{recommendedStream}</span> stream for you.</p>
                    </div>
                )}
            </div>

            {/* AI Response Area */}
            {(aiFilters || aiCollegeNames.length > 0 || isAiSearching) && (
                <div className="bg-purple-50/60 rounded-xl shadow-md p-6 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-purple-800">AI Search Results</h2>
                        <button onClick={clearAiSearch} className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                            <XIcon className="h-4 w-4" /> Clear
                        </button>
                    </div>
                     <p className="text-gray-600 mt-1">Showing colleges based on your query: "{searchQuery}"</p>
                    {aiTextResponse && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                            {renderAiTextResponse(aiTextResponse)}
                        </div>
                    )}
                </div>
            )}
            
            {searchError && (
                 <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    <div>
                        <h4 className="font-bold">Search Failed</h4>
                        <p>{searchError}</p>
                    </div>
                </div>
            )}
            
            {/* College List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                         <div key={i} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                 <>
                    {filteredColleges.length === 0 && !isAiSearching && (
                        <div className="text-center py-10 bg-white rounded-lg shadow-md">
                            <p className="font-semibold text-gray-700">No colleges match your criteria.</p>
                            <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
                        {filteredColleges.map(college => (
                            <CollegeCard 
                                key={college.id} 
                                college={college} 
                                onSelect={handleSelectCollege} 
                                isSelected={selectedColleges.includes(college.id)} 
                                selectionDisabled={selectedColleges.length >= 3 && !selectedColleges.includes(college.id)}
                                onRate={handleRateCollege}
                            />
                        ))}
                    </div>
                </>
            )}

            {selectedColleges.length > 0 && (
                 <div className="sticky bottom-4 z-20 max-w-2xl mx-auto animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center justify-between">
                        <p className="font-semibold text-gray-800">{selectedColleges.length} college{selectedColleges.length > 1 ? 's' : ''} selected (max 3)</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedColleges([])}
                                className="font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 text-sm"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setCompareModalOpen(true)}
                                disabled={selectedColleges.length < 2}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <ScaleIcon className="h-5 w-5" />
                                <span>Compare ({selectedColleges.length})</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <CollegeCompareModal
                isOpen={isCompareModalOpen}
                onClose={() => setCompareModalOpen(false)}
                colleges={collegesToCompare}
            />
        </div>
    );
};

export default CollegeInsights;