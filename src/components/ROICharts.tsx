import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ROIChartsProps {
  currency: string;
  currencySymbol: string;
  ksmCostINR: number;
  flowneticsKsmINR: number;
  partA_INR: number;
  partBC_INR: number;
  interestRefundableINR: number;
  savingsRmPerAnnumINR: number;
  flowneticsFeesPerYearINR: number;
  savingsAfterFaasINR: number;
  roiMonths: number;
  formatMoneyShort: (amount: number) => string;
}

// Custom tooltip styles for better visibility
const tooltipStyle = {
  backgroundColor: '#374151',
  border: '1px solid #e07742',
  borderRadius: '8px',
  padding: '10px',
  color: '#ffffff',
  fontSize: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
};

const tooltipLabelStyle = {
  color: '#e07742',
  fontWeight: 'bold',
  marginBottom: '4px'
};

const tooltipItemStyle = {
  color: '#ffffff',
  padding: '2px 0'
};

// Custom label renderer for pie charts with visible styling
const renderCustomLabel = ({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const COLORS = {
  traditional: '#e07742',
  flownetics: '#1406b3',
  savings: '#057210',
  fees: '#702594',
  investment: '#e07742'
};

export function ROICharts({
  currencySymbol,
  ksmCostINR,
  flowneticsKsmINR,
  partA_INR,
  partBC_INR,
  interestRefundableINR,
  savingsRmPerAnnumINR,
  flowneticsFeesPerYearINR,
  savingsAfterFaasINR,
  roiMonths,
  formatMoneyShort
}: ROIChartsProps) {

  const costComparisonData = [
    {
      name: 'Traditional',
      cost: parseFloat(formatMoneyShort(ksmCostINR))
    },
    {
      name: 'Flownetics',
      cost: parseFloat(formatMoneyShort(flowneticsKsmINR))
    }
  ];

  const investmentBreakdownData = [
    { name: 'Part A (Equipment)', value: parseFloat(formatMoneyShort(partA_INR)), color: COLORS.traditional },
    { name: 'Part B+C (Setup)', value: parseFloat(formatMoneyShort(partBC_INR)), color: COLORS.flownetics },
    { name: 'Interest (3y)', value: parseFloat(formatMoneyShort(interestRefundableINR)), color: COLORS.fees }
  ];

  const savingsBreakdownData = [
    { name: 'Total Savings', value: parseFloat(formatMoneyShort(savingsRmPerAnnumINR)), color: COLORS.savings },
    { name: 'FaaS Fees', value: parseFloat(formatMoneyShort(flowneticsFeesPerYearINR)), color: COLORS.fees }
  ];

  const roiTimelineData = [];
  if (roiMonths > 0 && savingsAfterFaasINR > 0) {
    const monthsToShow = Math.ceil(roiMonths) + 12;
    const monthlySavings = savingsAfterFaasINR / 12;
    let cumulativeSavings = 0;

    for (let month = 0; month <= monthsToShow; month += 3) {
      cumulativeSavings = monthlySavings * month;
      roiTimelineData.push({
        month: month,
        savings: parseFloat(formatMoneyShort(cumulativeSavings)),
        breakeven: parseFloat(formatMoneyShort(partA_INR + partBC_INR + interestRefundableINR))
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
        <h4 className="text-sm font-semibold text-white mb-4">Cost Comparison (Per Kg)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              formatter={(value) => [`${currencySymbol} ${value}`, 'Cost']}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgba(224, 119, 66, 0.1)' }}
            />
            <Bar dataKey="cost" fill={COLORS.flownetics} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h4 className="text-sm font-semibold text-white mb-4">Investment Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={investmentBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {investmentBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${currencySymbol} ${value}`, name]}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h4 className="text-sm font-semibold text-white mb-4">Annual Savings Split</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={savingsBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {savingsBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${currencySymbol} ${value}`, name]}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {roiTimelineData.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h4 className="text-sm font-semibold text-white mb-4">ROI Timeline - Cumulative Savings</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={roiTimelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                label={{ value: 'Months', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#9ca3af' }}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                formatter={(value, name) => [`${currencySymbol} ${value}`, name]}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line
                type="monotone"
                dataKey="savings"
                stroke={COLORS.savings}
                strokeWidth={2}
                name="Cumulative Savings"
                dot={{ fill: COLORS.savings, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="breakeven"
                stroke={COLORS.investment}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Breakeven Point"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 text-center text-xs text-gray-400">
            Breakeven achieved at month <span className="font-bold text-brand-green">{roiMonths.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
