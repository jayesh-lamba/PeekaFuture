// FIX: Implemented the EntrepreneurshipTab component to display business-related content.
import React, { useState, useEffect } from 'react';
import { getEntrepreneurshipData } from '../services/firebase';
import { EntrepreneurshipData, EntrepreneurshipOpportunity } from '../types';
import SmallBizChart from './SmallBizChart';
import AIIdeaGenerator from './AIIdeaGenerator';
import { WrenchScrewdriverIcon, TrendingUpIcon } from './Icons';

const trendColors: { [key in EntrepreneurshipOpportunity['marketTrend']]: string } = {
    Growing: 'text-green-700 bg-green-100 border-green-200',
    Stable: 'text-blue-700 bg-blue-100 border-blue-200',
    Emerging: 'text-purple-700 bg-purple-100 border-purple-200',
};

const OpportunityCard: React.FC<{ opportunity: EntrepreneurshipOpportunity }> = ({ opportunity }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
        <h4 className="font-semibold text-gray-800 text-lg">{opportunity.sector}</h4>
        
        <div>
            <h5 className="text-xs font-bold uppercase text-gray-500 mb-2">Example Ventures</h5>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {opportunity.examples.map((example, index) => <li key={index}>{example}</li>)}
            </ul>
        </div>
        
        <div>
             <h5 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1.5">
                <WrenchScrewdriverIcon className="w-4 h-4" />
                <span>Key Skills Required</span>
            </h5>
            <div className="flex flex-wrap gap-2">
                {opportunity.keySkills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
        
         <div className="flex items-center justify-between pt-3 border-t border-gray-200/80">
            <div className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4 text-gray-500" />
                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${trendColors[opportunity.marketTrend]}`}>
                    {opportunity.marketTrend}
                </span>
            </div>
            <div className="text-sm font-medium text-gray-600">
                Profit Margin: <span className="font-bold text-green-600">~{opportunity.profitMargin}%</span>
            </div>
        </div>
    </div>
);

const DegreeCard: React.FC<{ data: EntrepreneurshipData }> = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-200/50">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.degree}</h3>
        <p className="text-gray-600 mb-6">{data.description}</p>
        <div className="space-y-4">
            {data.opportunities.map(op => <OpportunityCard key={op.sector} opportunity={op} />)}
        </div>
    </div>
);


const EntrepreneurshipTab: React.FC = () => {
    const [data, setData] = useState<EntrepreneurshipData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getEntrepreneurshipData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch entrepreneurship data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Entrepreneurship Launchpad</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
                Discover strategic insights into business ventures tailored to your academic background. Your degree can be a powerful launchpad for creating your own success.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-8 animate-pulse space-y-4">
                                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-24 bg-slate-200 rounded w-full mt-4"></div>
                            </div>
                        ))
                    ) : (
                        data.map(item => <DegreeCard key={item.id} data={item} />)
                    )}
                </div>
                <div className="space-y-8 lg:sticky lg:top-8">
                    <SmallBizChart />
                    <AIIdeaGenerator />
                </div>
            </div>
        </div>
    );
};

export default EntrepreneurshipTab;