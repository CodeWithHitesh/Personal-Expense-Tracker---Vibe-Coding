import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Loader2, Search, Clock, Shield } from "lucide-react";
import { Transaction } from "../types";
import { format } from "date-fns";

interface OracleProps {
  transactions: Transaction[];
  currency: string;
}

interface OracleAnalysis {
  insights: string[];
  predictions: string[];
  tips: string[];
  rpgMessage: string;
}

export function Oracle({ transactions, currency }: OracleProps) {
  const [analysis, setAnalysis] = useState<OracleAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = async () => {
    if (transactions.length === 0) {
      setError("You need to log some encounters first, hero.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const summary = transactions.slice(0, 100).map(t => 
        `[${format(new Date(t.date), 'yyyy-MM-dd EEEE')}] ${t.type === 'expense' ? 'Spent' : 'Earned'} ${currency}${t.amount} on ${t.category} (${t.description})`
      ).join('\n');

      const prompt = `You are the "Oracle of Coin", a wise, analytical RPG NPC who gives financial advice to adventurers.
      Analyze the hero's recent transaction history (up to 100 items):
      ${summary}
      
      Provide a detailed tactical report. Include:
      1. Spending patterns (e.g., weekend spending, category spikes).
      2. Predictive analysis for upcoming recurring expenses.
      3. Actionable saving tips.
      4. A fun RPG-themed summary message.
      
      Keep the tone analytical but maintain the RPG flavor (gold, potions, damage, quests, loot, etc.).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Personalized insights about spending patterns (e.g., weekend dining, category increases)."
              },
              predictions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Predictive analysis for upcoming recurring expenses based on the data."
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Actionable saving tips tailored to the user's habits."
              },
              rpgMessage: {
                type: Type.STRING,
                description: "A short, fun, RPG-themed message from the Oracle summarizing the financial state."
              }
            },
            required: ["insights", "predictions", "tips", "rpgMessage"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("The Oracle's connection to the arcane is disrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-rpg-panel pixel-border p-4 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
        <Sparkles size={120} />
      </div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-pixel text-sm text-purple-400 flex items-center gap-2">
          <Sparkles size={16} /> ORACLE'S TACTICAL REPORT
        </h3>
        <button
          onClick={getAdvice}
          disabled={loading}
          className="bg-purple-600/20 text-purple-400 border border-purple-500/50 px-3 py-1 font-mono text-xs hover:bg-purple-600/40 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "ANALYZE PATTERNS"}
        </button>
      </div>

      <div className="relative z-10 font-mono text-sm min-h-[60px]">
        {error ? (
          <p className="text-rpg-damage flex items-center h-full">{error}</p>
        ) : analysis ? (
          <div className="space-y-6 mt-4">
            <p className="text-purple-300 italic text-sm border-l-2 border-purple-500/50 pl-3 py-1 bg-purple-500/10">"{analysis.rpgMessage}"</p>
            
            <div className="space-y-2">
              <h4 className="text-rpg-gold flex items-center gap-2 font-bold"><Search size={14}/> Scrying Results (Insights)</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                {analysis.insights.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-rpg-mana flex items-center gap-2 font-bold"><Clock size={14}/> Prophecies (Predictions)</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                {analysis.predictions.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-rpg-health flex items-center gap-2 font-bold"><Shield size={14}/> Survival Tactics (Tips)</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                {analysis.tips.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 flex items-center h-full">The Oracle awaits your query to analyze your spending patterns...</p>
        )}
      </div>
    </div>
  );
}
