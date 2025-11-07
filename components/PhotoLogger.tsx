
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { blobToBase64 } from './utils/imageUtils';
import { triggerHapticFeedback } from './utils/haptics';
import { SparkleIcon } from './icons/SparkleIcon';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import type { MealNutritionInfo } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface PhotoLoggerProps {
  onAnalysisComplete: (result: MealNutritionInfo[], imageFile: File, sources: any[]) => void;
}

const PhotoLogger: React.FC<PhotoLoggerProps> = ({ onAnalysisComplete }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setPreviewUrl('');
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
    triggerHapticFeedback();

    try {
      const base64Data = await blobToBase64(imageFile);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const imagePart = {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Data.split(',')[1],
        },
      };

      const textPart = {
        text: "Analyze the meal in this image. Use web search to find the most accurate nutritional information for the identified food items. Identify each food item and estimate its nutritional values (calories, protein, carbs, fats). Return the data as a JSON array of objects. Each object should have 'name', 'calories', 'protein', 'carbs', and 'fats' keys. If you cannot identify items, return an empty array. IMPORTANT: Your entire response must be ONLY the JSON array, with no other text, markdown, or explanations.",
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          tools: [{googleSearch: {}}],
        },
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const responseText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(responseText);

      if (result && result.length > 0) {
        onAnalysisComplete(result, imageFile, sources);
      } else {
        setError('The AI could not identify any food in the image. Please try a clearer photo.');
      }

    } catch (e) {
      console.error(e);
      setError('Failed to analyze image. The AI may be busy, or the image could not be processed. Please try again.');
    } finally {
      setIsLoading(false);
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
      
      {imageFile && !isLoading && !error && (
        <button
          onClick={analyzeImage}
          className="w-full mt-4 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          <SparkleIcon className="w-5 h-5 mr-2" />
          Analyze Meal
        </button>
      )}

      {isLoading && (
        <div className="w-full mt-4 py-3 px-4 flex items-center justify-center">
            <SpinnerIcon className="w-6 h-6 text-accent" />
        </div>
      )}

      {error && (
        <div className="text-center mt-4">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={analyzeImage} className="mt-2 text-accent font-semibold text-sm">
                Try Again
            </button>
        </div>
      )}
    </div>
  );
};

export default PhotoLogger;
