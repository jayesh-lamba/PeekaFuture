import React from 'react';
import Logo from './Logo';
import { StreamIcon, NavigatorIcon, CollegeIcon, EntrepreneurshipIcon, TrendingUpIcon, PaintBrushIcon, QuoteIcon, WrenchScrewdriverIcon, BriefcaseIcon, RocketLaunchIcon, HeartIcon, ChartPieIcon, TargetIcon, CheckIcon, SparklesIcon, BookOpenIcon, ClipboardDocumentListIcon } from './Icons';

interface WelcomePageProps {
    onGetStarted: () => void;
}

const BentoItem: React.FC<{ icon: React.ReactNode; title: string; description: React.ReactNode; className?: string; }> = ({ icon, title, description, className = '' }) => (
    <div className={`bento-item ${className}`}>
        <div className="mx-auto bg-purple-100 ring-4 ring-purple-200/50 rounded-xl h-12 w-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <div className="mt-2 text-gray-600 leading-relaxed text-sm">{description}</div>
    </div>
);


const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
    
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Logo className="text-3xl" />
                    <button
                        onClick={onGetStarted}
                        className="btn-gradient text-white font-bold py-2 px-6 rounded-lg shadow-md"
                    >
                        Get Started
                    </button>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="relative hero-gradient overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center py-16 lg:py-20">
                        <div className="max-w-3xl">
                             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-typing" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                Your Future, Decoded by AI.
                            </h1>
                            <p className="mt-6 text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto">
                                Stop guessing. Start planning. Peekafuture is your all-in-one AI guide to choosing the right stream, discovering top colleges, and charting your academic journey with confidence.
                            </p>
                            <button
                                onClick={onGetStarted}
                                className="mt-10 btn-gradient text-white font-bold text-base md:text-lg py-3 px-8 md:py-4 md:px-10 rounded-full shadow-xl shadow-purple-500/50"
                            >
                               ✨ Find Your Path Now
                            </button>
                        </div>
                        <div className="w-full mt-16 lg:mt-20">
                            <div className="card-stack">
                                <div className="card-stack-item w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-end">
                                    <PaintBrushIcon className="w-12 h-12 text-pink-500 absolute top-6 left-6" />
                                    <div>
                                        <h3 className="text-2xl font-bold">The Artist</h3>
                                        <p className="text-sm text-gray-600 mt-2">Unleash your creativity. From digital design to fine arts, discover how passion becomes a profession.</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-1 rounded-full">Creativity</span>
                                            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-1 rounded-full">Design</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-stack-item w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-end">
                                    <HeartIcon className="w-12 h-12 text-red-500 absolute top-6 left-6" filled />
                                    <div>
                                        <h3 className="text-2xl font-bold">The Doctor</h3>
                                        <p className="text-sm text-gray-600 mt-2">Make a difference. Dive into life sciences and dedicate your skills to healing and healthcare innovation.</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">Empathy</span>
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">Science</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-stack-item w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-end">
                                    <WrenchScrewdriverIcon className="w-12 h-12 text-blue-500 absolute top-6 left-6" />
                                     <div>
                                        <h3 className="text-2xl font-bold">The Engineer</h3>
                                        <p className="text-sm text-gray-600 mt-2">Build the future. Solve complex problems with logic, from software to sustainable infrastructure.</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">Logic</span>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">Innovation</span>
                                        </div>
                                    </div>
                                </div>
                                 <div className="card-stack-item w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-end">
                                    <TargetIcon className="w-12 h-12 text-indigo-500 absolute top-6 left-6" />
                                    <div>
                                        <h3 className="text-2xl font-bold">The Strategist</h3>
                                        <p className="text-sm text-gray-600 mt-2">Shape decisions. Analyze markets and guide businesses through the complexities of commerce and finance.</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">Analysis</span>
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">Business</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-stack-item w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-end">
                                    <ChartPieIcon className="w-12 h-12 text-teal-500 absolute top-6 left-6" />
                                    <div>
                                        <h3 className="text-2xl font-bold">The Data Scientist</h3>
                                        <p className="text-sm text-gray-600 mt-2">Find insights in data. Use numbers and code to tell stories and predict future trends.</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full">Analytics</span>
                                            <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full">AI/ML</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-stack-item w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-end">
                                     <RocketLaunchIcon className="w-12 h-12 text-green-500 absolute top-6 left-6" />
                                     <div>
                                        <h3 className="text-2xl font-bold">The Entrepreneur</h3>
                                        <p className="text-sm text-gray-600 mt-2">Lead the charge. Turn bold ideas into real-world impact and build your own legacy from the ground up.</p>
                                         <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">Leadership</span>
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">Vision</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Bento Grid Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900">Your Personal AI Toolkit</h2>
                        <p className="mt-4 text-lg text-gray-600">Everything you need for academic and career success, in one place.</p>
                    </div>
                    <div className="bento-grid">
                        <BentoItem 
                            className="bento-item-1 items-center justify-center flex flex-col text-center"
                            icon={<StreamIcon className="h-10 w-10 text-purple-600" />} 
                            title="AI Stream Guidance"
                            description={
                                <>
                                    <p>Unlock your true potential. Our AI decodes your personality and passions to find your perfect fit.</p>
                                    <ul className="mt-4 space-y-2 text-sm text-left">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Personalized AI Survey:</strong> Answer intuitive questions to build your unique profile.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Instant Recommendations:</strong> Get your ideal stream and top career suggestion.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>"Day in the Life" Simulation:</strong> Experience a day in your recommended career.</span></li>
                                    </ul>
                                </>
                            } 
                        />
                        <BentoItem 
                            className="bento-item-2"
                            icon={<NavigatorIcon className="h-8 w-8 text-purple-600" />} 
                            title="Academic Navigator" 
                            description={
                                <>
                                    <p>Your step-by-step guide to academic excellence. Never feel lost again.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Custom 2-Year Roadmap:</strong> Generate a plan for Grades 11 & 12 based on your goal.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Interactive Checklist:</strong> Track your progress on subjects, skills, and activities.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>AI Skill Deep Dives:</strong> Get curated learning guides for any skill you want to master.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-3"
                            icon={<CollegeIcon className="h-8 w-8 text-purple-600" />} 
                            title="College Insights" 
                             description={
                                <>
                                    <p>Navigate the world of colleges with an AI expert by your side.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Conversational Search:</strong> Ask questions like "Best private colleges for commerce".</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Side-by-Side Comparison:</strong> Analyze up to 3 colleges with an AI-powered summary.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Live Competition Finder:</strong> Discover hackathons and competitions relevant to you.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-4"
                            icon={<EntrepreneurshipIcon className="h-8 w-8 text-purple-600" />} 
                            title="Entrepreneurship Hub"
                            description={
                                <>
                                    <p>Transform your ideas into a real business. Your journey from student to CEO starts here.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>AI Idea Generator:</strong> Combine your degree and interests to create a unique startup concept.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>One-Page Business Plan:</strong> Instantly draft a professional plan for your idea.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Market Insights:</strong> Discover ventures tailored to your academic background.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-5"
                            icon={<TrendingUpIcon className="h-8 w-8 text-purple-600" />} 
                            title="Future Trends" 
                             description={
                                <>
                                    <p>See the future before it happens. Get an AI-powered analysis of your career's trajectory.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Personalized Trend Reports:</strong> Understand the 5-10 year outlook for your chosen field.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Future-Proof Skills:</strong> Identify the key skills you need to stay competitive.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Google Search Integration:</strong> Get the latest, most up-to-date industry insights.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-6"
                            icon={<PaintBrushIcon className="h-8 w-8 text-purple-600" />} 
                            title="Artists' Corner" 
                            description={
                                <>
                                    <p>A dedicated space for creative minds. Turn your art into a sustainable career.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Specialized Artist Roadmap:</strong> A custom plan covering portfolio, skills, and networking.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>AI Grant & Scholarship Finder:</strong> Discover funding opportunities for your creative projects.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Career Guidance:</strong> Explore diverse paths from design and film to fine arts.</span></li>
                                    </ul>
                                </>
                            }
                        />
                    </div>
                </div>
            </section>
            
             {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-gray-900">Your 5-Step Journey to a Future You'll Love</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Follow this simple, AI-powered path to turn uncertainty into a clear, actionable plan.</p>
                    </div>
                    <div className="relative">
                        <div className="journey-path-container">
                             <div className="journey-path">
                                <svg width="100%" height="100%" viewBox="0 0 250 1500" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="journey-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop id="journey-gradient-stop-1" offset="0%" />
                                            <stop id="journey-gradient-stop-2" offset="100%" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 125,0 C 125,150 250,150 250,300 S 0,450 0,600 S 250,750 250,900 S 0,1050 0,1200 S 125,1350 125,1500" fill="none" className="journey-path-svg" />
                                </svg>
                            </div>
                            
                            <div className="relative flex justify-center items-center mb-20 lg:mb-24">
                                <div className="w-full lg:w-2/5 animate-fade-in-up">
                                    <div className="journey-card">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-8 ring-purple-100">1</div>
                                            <h3 className="text-xl font-bold text-gray-800">Discover Your Persona</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600">Start with our quick, intuitive AI survey. It's a journey to uncover your unique strengths, passions, and the professional persona that fits you best.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="relative flex justify-center items-center mb-20 lg:mb-24">
                                <div className="w-full lg:w-2/5 ml-auto animate-fade-in-up animation-delay-200">
                                      <div className="journey-card">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-8 ring-purple-100">2</div>
                                            <h3 className="text-xl font-bold text-gray-800">Receive Your AI Blueprint</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600">Instantly receive a personalized blueprint from our AI, detailing your ideal academic stream and a top career recommendation.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative flex justify-center items-center mb-20 lg:mb-24">
                                <div className="w-full lg:w-2/5 mr-auto animate-fade-in-up animation-delay-400">
                                      <div className="journey-card">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-8 ring-purple-100">3</div>
                                            <h3 className="text-xl font-bold text-gray-800">Visualize Your Future</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600">Immerse yourself in a 'Day in the Life' simulation to experience what your recommended career actually feels like, making your future tangible and exciting.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="relative flex justify-center items-center mb-20 lg:mb-24">
                                <div className="w-full lg:w-2/5 ml-auto animate-fade-in-up animation-delay-600">
                                      <div className="journey-card">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-8 ring-purple-100">4</div>
                                            <h3 className="text-xl font-bold text-gray-800">Build Your Master Plan</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600">Generate a custom 2-year Academic Roadmap. Our Navigator gives you a step-by-step checklist for subjects, skills, and extracurriculars to ensure you're always on track.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="relative flex justify-center items-center">
                                <div className="w-full lg:w-2/5 mr-auto animate-fade-in-up animation-delay-800">
                                      <div className="journey-card">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-8 ring-purple-100">5</div>
                                            <h3 className="text-xl font-bold text-gray-800">Launch & Lead</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600">Use our full toolkit to succeed. Find top colleges, discover scholarships, explore future industry trends, and even generate a business plan for your own startup.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900">Don't Just Take Our Word For It</h2>
                        <p className="mt-4 text-lg text-gray-600">Discover how Peekafuture is making a difference for students like you.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-purple-50 rounded-2xl p-8 space-y-6 relative border-t-4 border-purple-500 shadow-lg">
                            <QuoteIcon className="absolute top-6 left-8 h-16 w-16 text-purple-200/70" />
                            <p className="relative text-lg text-gray-700 italic z-10">"The Academic Navigator roadmap was a game-changer. I finally have a clear, step-by-step plan for the next two years. I feel so much more confident about my future!"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-purple-200">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Ananya Sharma" className="h-12 w-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-800">Ruhi Sharma</p>
                                    <p className="text-sm text-gray-500">Aspiring Engineer, Delhi</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-8 space-y-6 relative border-t-4 border-purple-500 shadow-lg">
                            <QuoteIcon className="absolute top-6 left-8 h-16 w-16 text-purple-200/70" />
                            <p className="relative text-lg text-gray-700 italic z-10">"I was completely lost between Commerce and Arts. The AI survey not only recommended Commerce but also showed me exciting careers I never knew existed. Highly recommend!"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-purple-200">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Rohan Mehta" className="h-12 w-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-800">Rohan Mehta</p>
                                    <p className="text-sm text-gray-500">Future Entrepreneur, Mumbai</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer CTA */}
            <section className="hero-gradient py-24">
                 <div className="container mx-auto px-6 text-center">
                     <h2 className="text-4xl font-extrabold text-white">Ready to Decode Your Future?</h2>
                     <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">Join thousands of students who are planning their academic journey with AI-powered confidence.</p>
                      <button
                        onClick={onGetStarted}
                        className="mt-8 bg-white hover:bg-gray-100 text-purple-700 font-bold text-lg py-4 px-10 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                       Create Your Free Account
                    </button>
                 </div>
            </section>
            
            {/* Site Footer */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Column 1: Brand & Socials */}
                        <div className="md:col-span-2">
                            <Logo className="text-2xl" variant="inverted" />
                            <p className="mt-4 text-sm leading-relaxed max-w-xs">
                                Your AI-powered guide to a future built with clarity and confidence.
                            </p>
                            <div className="mt-6 flex space-x-4">
                                <a href="https://www.linkedin.com/in/anany-sharma-955603144/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn Profile">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter Profile">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.339.223-2.04.084.616 1.924 2.443 3.32 4.6 3.355-1.64 1.28-3.71 2.04-5.95 2.04-.38 0-.76-.023-1.13-.066 2.11 1.35 4.61 2.14 7.3 2.14 8.77 0 13.59-7.27 13.59-13.59 0-.21 0-.41-.01-.61.93-.67 1.73-1.51 2.37-2.47z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Quick Links</h3>
                            <ul className="mt-4 space-y-3">
                                <li><a href="#features" className="text-base text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="text-base text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                                <li><a href="#testimonials" className="text-base text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                        <p className="text-sm mb-4 sm:mb-0">
                            &copy; 2025 Peekafuture. All Rights Reserved.
                        </p>
                        <p className="text-sm">
                            Created by <a href="https://www.linkedin.com/in/anany-sharma-955603144/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-purple-400 transition-colors">Anany Sharma</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;