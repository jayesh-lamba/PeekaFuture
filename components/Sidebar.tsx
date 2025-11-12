// FIX: Implemented the Sidebar component for dashboard navigation.
import React from 'react';
// FIX: Corrected import path for types.
import { DashboardTab } from '../types';
import Logo from './Logo';
// FIX: Corrected import path for Icons.
import { StreamIcon, CompetitionIcon, CollegeIcon, EntrepreneurshipIcon, XIcon, NavigatorIcon, PaintBrushIcon, TrendingUpIcon } from './Icons';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const handleTabClick = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) { // Close sidebar on mobile after selection
        setIsOpen(false);
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white border-r transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Logo className="text-2xl" />
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-600 lg:hidden">
              <XIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<StreamIcon className="h-5 w-5" />}
            label="Stream Guidance"
            isActive={activeTab === DashboardTab.StreamGuidance}
            onClick={() => handleTabClick(DashboardTab.StreamGuidance)}
          />
           <NavItem
            icon={<NavigatorIcon className="h-5 w-5" />}
            label="Academic Navigator"
            isActive={activeTab === DashboardTab.AcademicNavigator}
            onClick={() => handleTabClick(DashboardTab.AcademicNavigator)}
          />
          <NavItem
            icon={<CompetitionIcon className="h-5 w-5" />}
            label="Competitions"
            isActive={activeTab === DashboardTab.Competition}
            onClick={() => handleTabClick(DashboardTab.Competition)}
          />
          <NavItem
            icon={<CollegeIcon className="h-5 w-5" />}
            label="College Insights"
            isActive={activeTab === DashboardTab.CollegeInsights}
            onClick={() => handleTabClick(DashboardTab.CollegeInsights)}
          />
          <NavItem
            icon={<EntrepreneurshipIcon className="h-5 w-5" />}
            label="Entrepreneurship"
            isActive={activeTab === DashboardTab.Entrepreneurship}
            onClick={() => handleTabClick(DashboardTab.Entrepreneurship)}
          />
          <NavItem
            icon={<TrendingUpIcon className="h-5 w-5" />}
            label="Future Trends"
            isActive={activeTab === DashboardTab.FutureTrends}
            onClick={() => handleTabClick(DashboardTab.FutureTrends)}
          />
          <NavItem
            icon={<PaintBrushIcon className="h-5 w-5" />}
            label="Artists"
            isActive={activeTab === DashboardTab.Artists}
            onClick={() => handleTabClick(DashboardTab.Artists)}
          />
        </nav>
        
        <div className="p-4 border-t h-[76px]">
          {/* This space is intentionally left to align with the old footer height, can be adjusted or removed */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;