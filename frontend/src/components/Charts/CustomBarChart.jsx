import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomBarChart = ({ data = [], colors = ["#10B981", "#F59E0B", "#EF4444", "#8D51FF", "#00B8DB"] }) => {
  const chartData = data.map((item) => ({
    name: item.priority || item.name || 'Unknown',
    count: item.count || item.value || 0
  }));

  if (chartData.length === 0 || chartData.every(item => item.count === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Tasks: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (name) => {
    const colorMap = {
      'Low': '#10B981',
      'Medium': '#F59E0B',
      'High': '#EF4444',
      'Pending': '#F59E0B',
      'In Progress': '#3B82F6',
      'Completed': '#10B981'
    };
    return colorMap[name] || colors[0];
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Bar 
          dataKey="count" 
          radius={[8, 8, 0, 0]}
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;

