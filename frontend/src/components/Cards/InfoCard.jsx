import React from 'react';

const InfoCard = ({ label, value, color = "bg-[#1368EC]" }) => {
  return (
    <div className={`${color} rounded-lg p-4 text-white`}>
      <p className="text-xs md:text-sm opacity-90">{label}</p>
      <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default InfoCard;

