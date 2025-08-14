import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='flex items-center gap-2 p-3 rounded-md bg-white shadow-sm'>
      <div className={`flex items-center justify-center w-8 h-8 ${color} rounded-full text-white`}>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
