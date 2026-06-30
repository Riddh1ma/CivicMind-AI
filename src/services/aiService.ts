import { type Report } from './reportService';

// Helper to upload files to Cloudinary using unsigned upload
export const uploadImageToStorage = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET) are missing.');
  }

  console.log('Uploading image to Cloudinary...');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText || response.statusText}`);
  }

  const data = await response.json();
  if (data.secure_url) {
    console.log('Cloudinary upload successful secure URL:', data.secure_url);
    return data.secure_url;
  } else {
    throw new Error('Cloudinary upload response is missing secure_url field.');
  }
};

// Helper to convert a File object to base64 string for Gemini inlineData
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface GeminiAnalysisResult {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'pending';
  aiSummary: string;
  department: string;
  confidence: number;
}

export const analyzeImageWithGemini = async (file: File): Promise<GeminiAnalysisResult> => {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    console.warn('Gemini API key missing. Falling back to local simulation.');
    return simulateGeminiAnalysis(file.name);
  }

  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'image/jpeg';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this image of a municipal/civic issue. You must return a JSON object with EXACTLY the following keys:\n" +
                        "{\n" +
                        "  \"category\": string (must be one of: 'Road Damage', 'Water Leakage', 'Streetlight', 'Garbage', 'Traffic', 'Drainage', 'Graffiti', 'Other'),\n" +
                        "  \"severity\": string (must be one of: 'low', 'medium', 'high', 'critical'),\n" +
                        "  \"aiSummary\": string (a short 1-sentence description of what is seen in the image),\n" +
                        "  \"department\": string (suggested municipal department to handle it, e.g. 'Public Works', 'Water & Sanitation', 'Electrical Dept', 'Traffic Police', 'Waste Management'),\n" +
                        "  \"confidence\": number (float between 0 and 1)\n" +
                        "}\n" +
                        "Return only this JSON object. Do not format with markdown blocks."
                },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const resData = await response.json();
    const textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      throw new Error('No content returned from Gemini Vision model');
    }

    const parsed = JSON.parse(textResult.trim());
    return {
      category: parsed.category || 'Other',
      severity: parsed.severity || 'medium',
      aiSummary: parsed.aiSummary || 'Civic issue detected via uploaded evidence.',
      department: parsed.department || 'Public Works',
      confidence: parsed.confidence || 0.85,
    };
  } catch (error) {
    console.error('Gemini Vision analysis failed, falling back:', error);
    return simulateGeminiAnalysis(file.name);
  }
};

const simulateGeminiAnalysis = async (fileName: string): Promise<GeminiAnalysisResult> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('pothole') || lowerName.includes('road') || lowerName.includes('asphalt')) {
    return {
      category: 'Road Damage',
      severity: 'high',
      aiSummary: 'Major asphalt degradation and pothole cracks detected, posing traffic risk.',
      department: 'Public Works',
      confidence: 0.94,
    };
  } else if (lowerName.includes('water') || lowerName.includes('leak') || lowerName.includes('pipe')) {
    return {
      category: 'Water Leakage',
      severity: 'critical',
      aiSummary: 'Ruptured main conduit pipeline causing active potable water flooding.',
      department: 'Water & Sanitation',
      confidence: 0.97,
    };
  } else if (lowerName.includes('light') || lowerName.includes('lamp') || lowerName.includes('dark')) {
    return {
      category: 'Streetlight',
      severity: 'medium',
      aiSummary: 'Inactive street lighting fixture causing poor visibility on urban lane.',
      department: 'Electrical Dept',
      confidence: 0.92,
    };
  } else if (lowerName.includes('trash') || lowerName.includes('garbage') || lowerName.includes('waste')) {
    return {
      category: 'Garbage',
      severity: 'medium',
      aiSummary: 'Overflowing public waste receptacle causing sanitary hazards.',
      department: 'Waste Management',
      confidence: 0.96,
    };
  } else {
    return {
      category: 'Other',
      severity: 'low',
      aiSummary: 'Reported community incident requires human dispatcher inspection.',
      department: 'Public Works',
      confidence: 0.88,
    };
  }
};

export interface AiCopilotResult {
  summary: string;
  priorityScore: number;
  estimatedResolutionTime: string;
  suggestedDepartment: string;
  suggestedCrew: string;
  duplicateProbability: number;
  mergeRecommendation: string;
  recommendedAction: string;
  citizenImpact: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export const analyzeCopilotWithGemini = async (report: Report, similarCount: number): Promise<AiCopilotResult> => {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!geminiApiKey) {
    return simulateCopilotAnalysis(report, similarCount);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI Municipal Triage Assistant. Analyze this civic incident report and return a JSON object with recommendations.
                  
                  Report Details:
                  - Category: ${report.category}
                  - Description: ${report.description}
                  - AI Intake Summary: ${report.aiSummary}
                  - Severity: ${report.severity}
                  - Suggested Department: ${report.department}
                  - Nearby Similar Reports Count: ${similarCount}
                  - Verification Count: ${report.verificationCount}
                  
                  Return EXACTLY this JSON format (no markdown blocks, just raw JSON):
                  {
                    "summary": "A professional 1-2 sentence incident summary",
                    "priorityScore": number (0 to 100 based on severity and factors),
                    "estimatedResolutionTime": "2 hours" | "1 day" | "3 days",
                    "suggestedDepartment": "Public Works" | "Waste Management" | "Water Department" | "Electrical" | "Traffic Police",
                    "suggestedCrew": "Suggested response team name, e.g. Road Maintenance Team 3 or Sanitary Unit 1",
                    "duplicateProbability": number (0 to 100 duplicate risk),
                    "mergeRecommendation": "If duplicate risk > 50: 'Merge with similar incident'; else: 'Do not merge'",
                    "recommendedAction": "Dispatch immediately" | "Merge with existing complaint" | "Request verification" | "Schedule maintenance",
                    "citizenImpact": "High" | "Medium" | "Low",
                    "reasoning": "A short 1-sentence reasoning details explaining the priority and action recommendations"
                  }`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const resData = await response.json();
    const textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      throw new Error('No content returned from Gemini Vision model');
    }

    return JSON.parse(textResult.trim()) as AiCopilotResult;
  } catch (error) {
    console.error('Gemini Copilot analysis failed, falling back:', error);
    return simulateCopilotAnalysis(report, similarCount);
  }
};

const simulateCopilotAnalysis = (report: Report, similarCount: number): AiCopilotResult => {
  const duplicateProbability = similarCount > 0 ? 85 : 5;
  const mergeRecommendation = duplicateProbability > 50 ? 'Merge with similar incident' : 'Do not merge';
  
  let suggestedDepartment = report.department || 'Public Works';
  let suggestedCrew = 'Road Maintenance Team 3';
  let estimatedResolutionTime = '1 day';
  let citizenImpact: 'High' | 'Medium' | 'Low' = 'Medium';
  let priorityScore = 50;

  // Department and crew mapping
  const categoryLower = report.category.toLowerCase();
  if (categoryLower.includes('road') || categoryLower.includes('pothole') || categoryLower.includes('asphalt')) {
    suggestedDepartment = 'Public Works';
    suggestedCrew = 'Asphalt Repair Unit 2';
    estimatedResolutionTime = report.severity === 'critical' ? '2 hours' : '1 day';
  } else if (categoryLower.includes('garbage') || categoryLower.includes('waste') || categoryLower.includes('trash')) {
    suggestedDepartment = 'Waste Management';
    suggestedCrew = 'Sanitation Crew 1';
    estimatedResolutionTime = '1 day';
  } else if (categoryLower.includes('water') || categoryLower.includes('leak') || categoryLower.includes('pipe')) {
    suggestedDepartment = 'Water Department';
    suggestedCrew = 'Conduit Team 4';
    estimatedResolutionTime = report.severity === 'critical' ? '2 hours' : '1 day';
  } else if (categoryLower.includes('light') || categoryLower.includes('lamp') || categoryLower.includes('dark')) {
    suggestedDepartment = 'Electrical';
    suggestedCrew = 'Grid Patrol Team 1';
    estimatedResolutionTime = '3 days';
  } else if (categoryLower.includes('traffic') || categoryLower.includes('police')) {
    suggestedDepartment = 'Traffic Police';
    suggestedCrew = 'Transit Officer 5';
    estimatedResolutionTime = '2 hours';
  }

  // Calculate priority score
  if (report.severity === 'critical') {
    priorityScore = 94;
    citizenImpact = 'High';
  } else if (report.severity === 'high') {
    priorityScore = 78;
    citizenImpact = 'High';
  } else if (report.severity === 'medium') {
    priorityScore = 58;
    citizenImpact = 'Medium';
  } else {
    priorityScore = 32;
    citizenImpact = 'Low';
  }

  // Waiting factor
  if (report.createdAt) {
    const elapsedHrs = (Date.now() / 1000 - report.createdAt.seconds) / 3600;
    priorityScore = Math.min(100, priorityScore + Math.floor(elapsedHrs * 2));
  }

  let recommendedAction = 'Dispatch immediately';
  if (duplicateProbability > 50) {
    recommendedAction = 'Merge with existing complaint';
  } else if (report.severity === 'low') {
    recommendedAction = 'Schedule maintenance';
  } else if (report.verificationCount === 0 && report.severity !== 'critical') {
    recommendedAction = 'Request verification';
  }

  const summary = `Municipal ${report.category.toLowerCase()} report identified at ${report.address || 'specified coordinates'}. Priority rating is driven by the ${report.severity} severity score.`;
  const reasoning = `Recommended action "${recommendedAction}" is generated based on the ${report.severity} severity classification and local duplicate indicators.`;

  return {
    summary,
    priorityScore,
    estimatedResolutionTime,
    suggestedDepartment,
    suggestedCrew,
    duplicateProbability,
    mergeRecommendation,
    recommendedAction,
    citizenImpact,
    reasoning
  };
};
