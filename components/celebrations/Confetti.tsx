
import React, { useContext, useMemo } from 'react';
import { CelebrationContext } from '../../contexts/CelebrationContext';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
  const { isCelebrating } = useContext(CelebrationContext);

  const confettiPieces = useMemo(() => {
    if (!isCelebrating) return [];
    
    const colors = ['#00A99D', '#FBBF24', '#F87171', '#A78BFA', '#38BDF8'];
    const pieces = Array.from({ length: 100 }).map((_, i) => {
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards`,
        opacity: 0,
      };
      return <ConfettiPiece key={i} style={style} />;
    });
    return pieces;
  }, [isCelebrating]);

  if (!isCelebrating) return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {confettiPieces}
      </div>
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Confetti;
