import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CustomPieChart = ({ data = [], colors = ["#8D51FF", "#00B8DB", "#7BCE00", "#FF6B6B", "#FFD93D"] }) => {
  const chartData = data.map((item, index) => ({
    name: item.status || item.name || 'Unknown',
    value: item.count || item.value || 0,
    color: colors[index % colors.length]
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Count: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Percentage: <span className="font-semibold">{percent}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke="none"
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          formatter={(value, entry) => (
            <span className="text-gray-700 dark:text-gray-300 text-sm">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;

