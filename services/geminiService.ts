import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const polishText = async (text: string, context: string = "professional resume"): Promise<string> => {
  if (!text || text.trim().length === 0) return "";

  try {
    const prompt = `你是一位专业的简历顾问。请润色以下中文简历内容，使其更加专业、有力且简洁。这段内容属于"${context}"部分。
    
    待润色内容: "${text}"
    
    请仅返回润色后的文本，不要包含引号或额外的解释。保持中文语境。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是一位精通中文简历优化的职业规划专家，擅长使用STAR法则优化工作经历和项目描述。",
        temperature: 0.7,
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to original text if API fails
    return text;
  }
};

export const generateSummary = async (role: string, experience: string): Promise<string> => {
  try {
    const prompt = `为一位职位是"${role}"的候选人写一段职业总结（3-4句话）。他的主要经历亮点如下：${experience}。请使用中文。`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "";
  }
};