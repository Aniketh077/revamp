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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-brand-green via-green-600 to-green-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-[1.05] group cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest">ROI Period</div>
          </div>
          <div className="text-4xl font-black mb-1 leading-tight">
            {roiMonths > 0 ? roiMonths.toFixed(1) : '--'}
          </div>
          <div className="text-sm font-medium opacity-90">
            {roiYears > 0 ? `${roiYears.toFixed(1)} years` : 'Months'}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-purple via-purple-600 to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-[1.05] group cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest">Annual Savings</div>
          </div>
          <div className="text-3xl font-black mb-1 truncate leading-tight">
            {formatMoney(savingsAfterFaasINR)}
          </div>
          <div className="text-sm font-medium opacity-90">After FaaS Fees</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-orange via-orange-600 to-orange-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-[1.05] group cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest">Investment</div>
          </div>
          <div className="text-3xl font-black mb-1 truncate leading-tight">
            {formatMoney(totalCostClientINR)}
          </div>
          <div className="text-sm font-medium opacity-90">Client Cost</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-blue via-blue-600 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-[1.05] group cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest">Annual ROI</div>
          </div>
          <div className="text-4xl font-black mb-1 leading-tight">
            {roiPercentage}%
          </div>
          <div className="text-sm font-medium opacity-90">Return Rate</div>
        </div>
      </div>
    </div>
  );
}
