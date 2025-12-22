import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

interface ROIDashboardProps {
  roiMonths: number;
  savingsAfterFaasINR: number;
  totalCostClientINR: number;
  formatMoney: (amount: number) => string;
}

export function ROIDashboard({
  roiMonths,
  savingsAfterFaasINR,
  totalCostClientINR,
  formatMoney
}: ROIDashboardProps) {
  const roiYears = roiMonths / 12;
  const roiPercentage = totalCostClientINR > 0
    ? ((savingsAfterFaasINR / totalCostClientINR) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-brand-green to-green-800 rounded-xl p-3 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3 h-3 opacity-90" />
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-90">ROI Period</div>
          </div>
          <div className="text-2xl font-bold mb-0.5 leading-tight">
            {roiMonths > 0 ? roiMonths.toFixed(1) : '--'}
          </div>
          <div className="text-[10px] opacity-90 truncate">
            {roiYears > 0 ? `${roiYears.toFixed(1)} years` : 'Months'}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-purple to-purple-800 rounded-xl p-3 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3 h-3 opacity-90" />
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-90">Annual Savings</div>
          </div>
          <div className="text-xl font-bold mb-0.5 truncate leading-tight">
            {formatMoney(savingsAfterFaasINR)}
          </div>
          <div className="text-[10px] opacity-90 truncate">After FaaS Fees</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-orange to-orange-800 rounded-xl p-3 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <DollarSign className="w-3 h-3 opacity-90" />
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-90">Total Investment</div>
          </div>
          <div className="text-xl font-bold mb-0.5 truncate leading-tight">
            {formatMoney(totalCostClientINR)}
          </div>
          <div className="text-[10px] opacity-90 truncate">Client Cost</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-blue to-blue-800 rounded-xl p-3 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="w-3 h-3 opacity-90" />
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-90">Annual ROI</div>
          </div>
          <div className="text-2xl font-bold mb-0.5 leading-tight">
            {roiPercentage}%
          </div>
          <div className="text-[10px] opacity-90 truncate">Return Rate</div>
        </div>
      </div>
    </div>
  );
}
