import React from 'react';

const InviteCard: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-accent text-white space-y-3">
      <h3 className="text-lg font-bold">Invite friends</h3>
      <p className="text-sm opacity-90">The journey is easier together.</p>
      <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        Refer a friend to earn $10
      </button>
    </div>
  );
};

export default InviteCard;