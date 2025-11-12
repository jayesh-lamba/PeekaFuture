import { GoogleGenAI, Type } from "@google/genai";
import type { 
    SurveyAnswers, 
    GuidanceResult, 
    RecommendedStream, 
    DayInLifeSimulation,
    Competition,
    Roadmap,
    College,
    StartupIdea,
    BusinessPlan,
    GroundingSource,
    TrendAnalysis,
    ArtistRoadmap,
    CollegeSearchFilters,
    ArtGrant,
    SkillGuide
} from '../types';

// FIX: Initialize the GoogleGenAI client according to the coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to parse JSON from AI response, handling markdown code blocks.
const parseJsonResponse = <T>(text: string): T => {
    const cleanText = text.replace(/^```json/, '').replace(/```$/, '').trim();
    try {
        return JSON.parse(cleanText) as T;
    } catch (e) {
        console.error("Failed to parse JSON:", cleanText, e);
        throw new Error("Received an invalid response format from the AI. Please try again.");
    }
};

export const generateGuidance = async (answers: SurveyAnswers): Promise<GuidanceResult> => {
    const model = 'gemini-2.5-pro';
    const prompt = `
        Analyze the following survey answers to recommend an academic stream (Science, Commerce, or Arts / Humanities) and a specific career path for a high school student in India.

        Survey Answers:
        ${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

        Provide a detailed, empathetic, and encouraging analysis in Markdown format. The response should follow this structure exactly:
        1. A persona title for the user (e.g., "# 💡 The Innovative Strategist").
        2. A "Why [Recommended Stream] is Your Best Fit" section.
        3. A "Top Recommended Career: [Career Name]" section with a brief on why it's a good fit.
        4. A "What This Career Involves" section.
        5. At the very end, include the recommended stream and career on separate lines in this exact format:
        RECOMMENDED STREAM: [Science/Commerce/Arts / Humanities]
        RECOMMENDED CAREER: [Specific Career Title]

        Use Markdown for formatting (e.g., ## for headings, ** for bold).
    `;

    const response = await ai.models.generateContent({ model, contents: prompt });
    const text = response.text;
    
    const lines = text.split('\n');
    const streamLine = lines.find(line => line.startsWith('RECOMMENDED STREAM:'));
    const careerLine = lines.find(line => line.startsWith('RECOMMENDED CAREER:'));

    const recommendedStream = streamLine?.split(': ')[1].trim() as RecommendedStream || 'Unknown';
    const recommendedCareer = careerLine?.split(': ')[1].trim() || 'Unknown';
    
    return { text, recommendedStream, recommendedCareer };
};

export const generateFollowUpGuidance = async (question: string, context: GuidanceResult): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
        A user has received career guidance and has a follow-up question.
        
        Previous Guidance Summary:
        - Recommended Stream: ${context.recommendedStream}
        - Recommended Career: ${context.recommendedCareer}
        - Key points: ${context.text.substring(0, 500)}...

        User's Follow-up Question: "${question}"

        Provide a concise, helpful, and direct answer to the user's question in Markdown format. Address their "what if" scenario thoughtfully.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};

export const generateDayInLifeSimulation = async (career: string): Promise<DayInLifeSimulation> => {
    const model = 'gemini-2.5-flash';
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            careerTitle: { type: Type.STRING },
            storyTitle: { type: Type.STRING },
            introduction: { type: Type.STRING },
            segments: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        timeOfDay: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    required: ['timeOfDay', 'title', 'description']
                },
            },
            conclusion: { type: Type.STRING },
        },
        required: ['careerTitle', 'storyTitle', 'introduction', 'segments', 'conclusion']
    };

    const prompt = `Create a "Day in the Life" story for a ${career} in India. The tone should be engaging and inspiring for a high school student. Structure the response as a JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });
    return parseJsonResponse<DayInLifeSimulation>(response.text);
};

export const findCompetitions = async (career: string): Promise<Competition[]> => {
    const model = 'gemini-2.5-flash';
    
    const prompt = `Find 3-5 relevant and current competitions, hackathons, or Olympiads for a high school student in India interested in a career as a ${career}. Use Google Search. 
    Your response MUST be a valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON array.
    Each object in the array must have the following properties: "name" (string), "category" (string), "description" (string), "eligibility" (string), and "link" (string).`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
        },
    });

    return parseJsonResponse<Competition[]>(response.text);
};

export const generateRoadmap = async (stream: RecommendedStream, career: string): Promise<Roadmap> => {
    const model = 'gemini-2.5-flash';
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            grade11: {
                type: Type.OBJECT,
                properties: {
                    coreSubjects: { 
                        type: Type.OBJECT,
                        properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                        required: ['title', 'description', 'items']
                    },
                    skillDevelopment: { 
                        type: Type.OBJECT,
                        properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                        required: ['title', 'description', 'items']
                    },
                },
                required: ['coreSubjects', 'skillDevelopment']
            },
            grade12: {
                type: Type.OBJECT,
                properties: {
                    coreSubjects: { 
                        type: Type.OBJECT,
                        properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                         required: ['title', 'description', 'items']
                    },
                    examFocus: { 
                        type: Type.OBJECT,
                        properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                         required: ['title', 'description', 'items']
                    },
                },
                required: ['coreSubjects', 'examFocus']
            },
            extracurriculars: { 
                type: Type.OBJECT,
                properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                 required: ['title', 'description', 'items']
            },
            resources: { 
                type: Type.OBJECT,
                properties: { 
                    title: {type: Type.STRING}, 
                    description: {type: Type.STRING}, 
                    items: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.OBJECT,
                            properties: { title: {type: Type.STRING}, type: {type: Type.STRING}, link: {type: Type.STRING} },
                            required: ['title', 'type', 'link']
                        } 
                    } 
                },
                required: ['title', 'description', 'items']
            },
        },
        required: ['grade11', 'grade12', 'extracurriculars', 'resources']
    };
    const prompt = `Create a 2-year academic roadmap for a student in India entering Grade 11 in the ${stream} stream, aiming for a career as a ${career}. Provide actionable steps for grades 11 and 12, covering subjects, skills, extracurriculars, and resources. Structure the response as a JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });
    return parseJsonResponse<Roadmap>(response.text);
};


export const performConversationalSearch = async (query: string): Promise<{ filters: CollegeSearchFilters, textResponse: string, collegeNamesToFilter?: string[] }> => {
    const model = 'gemini-2.5-pro';
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            textResponse: { type: Type.STRING },
            filters: {
                type: Type.OBJECT,
                properties: {
                    stream: { type: Type.STRING },
                    cities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ownership: { type: Type.STRING },
                    maxFees: { type: Type.NUMBER },
                    minAvgPackage: { type: Type.NUMBER },
                    minRating: { type: Type.NUMBER },
                    courses: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            },
            collegeNamesToFilter: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "If the user asks to compare specific colleges by name, list them here."
            }
        },
        required: ['textResponse', 'filters']
    };
    
    const prompt = `
        A user is searching for colleges in India. Analyze their query: "${query}".
        1.  Extract search filters based on the query (stream, city, ownership, fees, package, rating, courses).
        2.  If the user asks for a comparison of specific colleges, extract their names into 'collegeNamesToFilter'. If so, the 'filters' object can be empty.
        3.  Generate a friendly, conversational text response that acknowledges their query.
        4.  Return a JSON object matching the schema.
    `;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });
    
    return parseJsonResponse<{ filters: CollegeSearchFilters, textResponse: string, collegeNamesToFilter?: string[] }>(response.text);
};

export const generateCollegeComparison = async (colleges: College[]): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const collegeDetails = colleges.map(c => 
        `- ${c.name}: NIRF #${c.nirfRanking}, Avg Package ₹${c.avg_package/100000} LPA, Fees ~₹${c.fees/100000} Lakhs, Rating ${c.avgRating.toFixed(1)}/5.0`
    ).join('\n');
    
    const prompt = `
        Compare the following colleges for a prospective student. Provide a summary and a recommendation in Markdown format.
        
        Colleges:
        ${collegeDetails}

        The response should have:
        - A "## Key Differences" section.
        - A "## Recommendation" section explaining which college might be better for different types of students.
        - Use **bold** for college names and key points.
    `;
    
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};

export const generateBusinessIdea = async (degree: string, interest: string): Promise<StartupIdea> => {
    const model = 'gemini-2.5-flash';
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            businessName: { type: Type.STRING },
            pitch: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            monetizationStrategy: { type: Type.STRING },
            investmentLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
        },
        required: ['businessName', 'pitch', 'targetAudience', 'keyFeatures', 'monetizationStrategy', 'investmentLevel']
    };

    const prompt = `Generate a unique startup idea for someone in India with a ${degree} degree who is interested in ${interest}. Provide the response as a JSON object matching the schema.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });

    return parseJsonResponse<StartupIdea>(response.text);
};

export const generateBusinessPlan = async (idea: StartupIdea): Promise<BusinessPlan> => {
    const model = 'gemini-2.5-pro';
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            businessName: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            solution: { type: Type.STRING },
            targetMarket: { type: Type.STRING },
            marketingStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
            swotAnalysis: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['strengths', 'weaknesses', 'opportunities', 'threats']
            },
            financialProjections: {
                type: Type.OBJECT,
                properties: {
                    revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keyCostDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    firstYearProfitOutlook: { type: Type.STRING },
                },
                required: ['revenueStreams', 'keyCostDrivers', 'firstYearProfitOutlook']
            },
        },
        required: ['businessName', 'executiveSummary', 'problemStatement', 'solution', 'targetMarket', 'marketingStrategy', 'swotAnalysis', 'financialProjections']
    };
    
    const prompt = `Based on this startup idea, generate a concise one-page business plan.
    Idea:
    - Name: ${idea.businessName}
    - Pitch: ${idea.pitch}
    - Target Audience: ${idea.targetAudience}
    
    Return a JSON object matching the schema.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });

    return parseJsonResponse<BusinessPlan>(response.text);
};

export const generateTrendAnalysis = async (career: string): Promise<TrendAnalysis> => {
    const model = 'gemini-2.5-pro';
    const prompt = `
        Analyze the future trends for a career in "${career}" in India over the next 5-10 years. 
        Use Google Search to get up-to-date information.
        
        The analysis should be detailed and well-structured in Markdown format, including:
        - A main heading for the report.
        - An introduction.
        - A "## 🚀 Key Future Skills" section.
        - A "## 📈 Emerging Career Opportunities" section.
        - A "## 💡 How to Prepare" section.

        Make the tone encouraging and insightful for a student.
    `;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
    });
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = groundingMetadata?.groundingChunks?.filter((c: any) => c.web).map((c: any) => c) || [];

    return { content: response.text, sources };
};

export const generateArtistRoadmap = async (career: string): Promise<ArtistRoadmap> => {
     const model = 'gemini-2.5-flash';
     const responseSchema = {
        type: Type.OBJECT,
        properties: {
            introduction: { type: Type.STRING },
            foundation: { 
                type: Type.OBJECT,
                properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                required: ['title', 'description', 'items']
            },
            specialization: { 
                type: Type.OBJECT,
                properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                required: ['title', 'description', 'items']
            },
            portfolio: { 
                type: Type.OBJECT,
                properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                required: ['title', 'description', 'items']
            },
            networking: { 
                type: Type.OBJECT,
                properties: { title: {type: Type.STRING}, description: {type: Type.STRING}, items: { type: Type.ARRAY, items: {type: Type.STRING} } },
                required: ['title', 'description', 'items']
            },
            resources: { 
                type: Type.OBJECT,
                properties: { 
                    title: {type: Type.STRING}, 
                    description: {type: Type.STRING}, 
                    items: { 
                        type: Type.ARRAY, 
                        items: { 
                            type: Type.OBJECT,
                            properties: { title: {type: Type.STRING}, type: {type: Type.STRING}, link: {type: Type.STRING} },
                            required: ['title', 'type', 'link']
                        } 
                    } 
                },
                required: ['title', 'description', 'items']
            },
        },
        required: ['introduction', 'foundation', 'specialization', 'portfolio', 'networking', 'resources']
    };
    const prompt = `Create a detailed roadmap for an aspiring ${career} in India. Cover foundational skills, specialization, portfolio building, networking, and key resources. The tone should be inspiring and practical. Return a JSON object matching the provided schema.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });
    return parseJsonResponse<ArtistRoadmap>(response.text);
};

export const findArtGrants = async (career: string): Promise<ArtGrant[]> => {
    const model = 'gemini-2.5-flash';

    const prompt = `Find 3-5 current art scholarships, grants, or residency programs in India suitable for a high school or early undergraduate student aspiring to be a ${career}. Use Google Search to find up-to-date opportunities. 
    Your response MUST be a valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON array.
    Each object in the array must have the following properties: "name" (string), "type" (string, one of 'Scholarship', 'Grant', or 'Residency'), "description" (string), "eligibility" (string), "award" (string), and "link" (string).`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    return parseJsonResponse<ArtGrant[]>(response.text);
};

export const generateSkillGuide = async (skill: string): Promise<SkillGuide> => {
    const model = 'gemini-2.5-flash';
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            skillName: { type: Type.STRING },
            introduction: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            freeResources: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['Course', 'Tutorial', 'Book', 'Documentation'] },
                        link: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    required: ['title', 'type', 'link', 'description']
                }
            },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['skillName', 'introduction', 'keyConcepts', 'freeResources', 'nextSteps']
    };

    const prompt = `Create a concise "deep dive" learning guide for a high school student in India who wants to learn "${skill}". The tone should be encouraging and actionable. The guide must include:
    1.  A brief introduction to the skill and its importance.
    2.  A list of 3-5 fundamental key concepts to master.
    3.  A list of 3 high-quality, free online resources (like YouTube tutorials, free courses on platforms like Coursera/edX, or official documentation) with valid links and a short description for each.
    4.  A list of 2-3 practical next steps to apply the skill.
    
    Return a valid JSON object that strictly follows the provided schema.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
    });
    return parseJsonResponse<SkillGuide>(response.text);
};