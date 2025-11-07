
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import Sources from './Sources';

interface DinnerPredictorProps {
  calories: number;
  protein: number;
}

const DinnerPredictor: React.FC<DinnerPredictorProps> = ({ calories, protein }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ text: string; sources: any[] } | null>(null);

  const proteinSuggestion = Math.max(0, Math.round(protein / 5) * 5); // Round to nearest 5
  const calorieSuggestion = Math.max(0, Math.round(calories / 50) * 50); // Round to nearest 50
    
  if (calories <= 100) return null;

  const getSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Suggest one or two simple dinner ideas to meet these targets: around ${calorieSuggestion} calories and ${proteinSuggestion}g of protein. Provide web links for recipes if available. Keep the response concise and easy to read.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setSuggestion({ text: response.text, sources });

    } catch(e) {
      console.error(e);
      setError('Sorry, could not fetch suggestions right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-accent/10 dark:bg-accent/20 p-4 rounded-2xl shadow-lg flex flex-col animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="bg-accent/20 p-2 rounded-full mt-1">
          <LightbulbIcon className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-accent">Dinner Idea</h3>
          <p className="text-sm text-text-primary-light dark:text-text-primary-dark mt-1">
            To hit your goals, aim for a dinner with around
            <span className="font-bold"> {proteinSuggestion}g of protein</span> and under
            <span className="font-bold"> {calorieSuggestion} calories</span>.
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        {!suggestion && !isLoading && !error && (
            <button 
                onClick={getSuggestion}
                className="w-full bg-accent/20 text-accent font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-accent/30 transition-colors"
            >
                <SparkleIcon className="w-4 h-4 mr-2" />
                Get Dinner Ideas
            </button>
        )}

        {isLoading && (
            <div className="flex justify-center items-center py-2">
                <SpinnerIcon className="w-6 h-6 text-accent" />
            </div>
        )}

        {error && (
            <div className="text-center py-2">
                <p className="text-red-500 text-sm">{error}</p>
                 <button onClick={getSuggestion} className="mt-1 text-accent font-semibold text-xs">
                    Try Again
                </button>
            </div>
        )}

        {suggestion && (
            <div className="mt-2 pt-3 border-t border-accent/20">
                <p className="text-sm text-text-primary-light dark:text-text-primary-dark whitespace-pre-wrap">{suggestion.text}</p>
                <Sources sources={suggestion.sources} />
            </div>
        )}
      </div>
    </div>
  );
};

export default DinnerPredictor;
