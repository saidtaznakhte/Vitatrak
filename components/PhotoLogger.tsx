import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { blobToBase64 } from './utils/imageUtils';
import { useFeedback } from '../contexts/FeedbackContext';
import { triggerHapticFeedback } from './utils/haptics';
import { SparkleIcon } from './icons/SparkleIcon';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import type { MealNutritionInfo } from '../types';

interface PhotoLoggerProps {
  onAddMeal: (newMeals: MealNutritionInfo[]) => void;
}

const PhotoLogger: React.FC<PhotoLoggerProps> = ({ onAddMeal }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MealNutritionInfo[] | null>(null);
  const [error, setError] = useState<string>('');
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess } = useFeedback();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError('');
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setPreviewUrl('');
    setAnalysisResult(null);
    setError('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      const base64Data = await blobToBase64(imageFile);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const imagePart = {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Data.split(',')[1],
        },
      };

      const textPart = {
        text: "Analyze the meal in this image. Identify each food item and estimate its nutritional values (calories, protein, carbs, fats). Return the data as a JSON array of objects. Each object should have 'name', 'calories', 'protein', 'carbs', and 'fats' keys. If you cannot identify items, return an empty array.",
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
              },
              required: ['name', 'calories', 'protein', 'carbs', 'fats'],
            },
          },
        },
      });

      const result = JSON.parse(response.text);
      setAnalysisResult(result);

    } catch (e) {
      console.error(e);
      setError('Failed to analyze image. The AI may be busy, or the image could not be processed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLog = () => {
    if (analysisResult) {
      onAddMeal(analysisResult);
      triggerHapticFeedback([100, 50, 100]);
      showSuccess();
    }
  };
  
  return (
    <div className="p-2">
       <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={galleryInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

      {!previewUrl ? (
        <div className="w-full h-48 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-card-dark/50 space-y-4 p-4">
            <button 
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center w-full max-w-xs p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
                <CameraIcon className="w-6 h-6 text-accent mr-3" />
                <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Take Photo</span>
            </button>
             <button 
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center w-full max-w-xs p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
                <UploadIcon className="w-6 h-6 text-accent mr-3" />
                <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Upload from Library</span>
            </button>
        </div>
      ) : (
        <div className="relative w-full h-48 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
          <img src={previewUrl} alt="Meal preview" className="w-full h-full object-cover rounded-xl" />
           <button 
                onClick={handleReset} 
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                aria-label="Remove photo"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
      )}
      
      {imageFile && !analysisResult && (
        <button
          onClick={analyzeImage}
          disabled={isLoading}
          className="w-full mt-4 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:bg-accent/70 transition-colors"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <SparkleIcon className="w-5 h-5 mr-2" />
              Analyze Meal
            </>
          )}
        </button>
      )}

      {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
      
      {analysisResult && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-3">Analysis Results</h3>
          {analysisResult.length > 0 ? (
            <div className="space-y-3">
              {analysisResult.map((item, index) => (
                <div key={index} className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark capitalize">{item.name}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                    <span>🔥 {item.calories} kcal</span>
                    <span>💪 {item.protein}g P</span>
                    <span>🍞 {item.carbs}g C</span>
                    <span>🥑 {item.fats}g F</span>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleAddToLog}
                className="w-full mt-4 bg-accent/20 text-accent font-bold py-3 px-4 rounded-lg hover:bg-accent/30 transition-colors">
                Add to Log
              </button>
            </div>
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-center">No food items could be identified in the image. Please try a different photo.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoLogger;