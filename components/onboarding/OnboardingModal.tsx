
import React, { useState, useContext } from 'react';
import { CelebrationContext } from '../../contexts/CelebrationContext';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { triggerCelebration } = useContext(CelebrationContext);

  const handleComplete = () => {
    triggerCelebration();
    onComplete();
  };
  
  const nextStep = () => setStep(s => s + 1);

  const stepsContent = [
    <Step key={0} title="Welcome to VitaTrack" description="Let's personalize your health journey. It only takes a minute." buttonText="Get Started" onNext={nextStep} />,
    <OptionStep key={1} title="What's your primary goal?" options={['Lose Weight', 'Maintain Weight', 'Build Muscle']} onNext={nextStep} />,
    <OptionStep key={2} title="What's your activity level?" options={['Not Active', 'Lightly Active', 'Active', 'Very Active']} onNext={nextStep} />,
    <OptionStep key={3} title="Any dietary preferences?" options={['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo']} onNext={nextStep} />,
    <Step key={4} title="You're all set!" description="Your personalized plan is ready. Let's start tracking your progress." buttonText="Start My Journey" onNext={handleComplete} />,
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all duration-300 animate-scale-in">
        {stepsContent[step]}
      </div>
    </div>
  );
};

const Step: React.FC<{ title: string; description: string; buttonText: string; onNext: () => void }> = ({ title, description, buttonText, onNext }) => (
  <div className="text-center animate-fade-in">
    <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{title}</h2>
    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">{description}</p>
    <button onClick={onNext} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors">
      {buttonText} <ChevronRightIcon className="w-5 h-5 ml-2" />
    </button>
  </div>
);

const OptionStep: React.FC<{ title: string; options: string[], onNext: () => void }> = ({ title, options, onNext }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 text-center">{title}</h2>
        <div className="space-y-3">
            {options.map(option => (
                <button 
                    key={option} 
                    onClick={onNext}
                    className="w-full text-left p-4 bg-background-light dark:bg-background-dark rounded-lg font-semibold text-text-primary-light dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
);

export default OnboardingModal;
