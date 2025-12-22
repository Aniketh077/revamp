import { useState, useEffect } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import DownloadModal, { UserData } from './DownloadModal';

type Currency = 'INR' | 'USD' | 'EUR';
type ReactionType = '' | 'L-L' | 'L-L+C' | 'L-G' | 'G-G';

const FX_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011
};

const REACTION_COSTS_INR: Record<string, number> = {
  'L-L': 400000,
  'L-L+C': 550000,
  'L-G': 750000,
  'G-G': 900000
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€'
};

export default function Calculator() {
  const ref = useScrollReveal<HTMLDivElement>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [numSteps, setNumSteps] = useState(1);
  const [reactions, setReactions] = useState<ReactionType[]>(['', '', '', '']);
  const [volumeTonsPerMonth, setVolumeTonsPerMonth] = useState(0);
  const [ksmCostINR, setKsmCostINR] = useState(0);
  const [faasPercent, setFaasPercent] = useState(50);

  const [annualQtyTons, setAnnualQtyTons] = useState(0);
  const [flowneticsKsmINR, setFlowneticsKsmINR] = useState(0);
  const [savingsRmPerKgINR, setSavingsRmPerKgINR] = useState(0);
  const [faasPerKgINR, setFaasPerKgINR] = useState(0);
  const [savingsRmPerAnnumINR, setSavingsRmPerAnnumINR] = useState(0);
  const [flowneticsFeesPerYearINR, setFlowneticsFeesPerYearINR] = useState(0);
  const [savingsAfterFaasINR, setSavingsAfterFaasINR] = useState(0);
  const [partA_INR, setPartA_INR] = useState(0);
  const [partBC_INR, setPartBC_INR] = useState(0);
  const [refundableINR, setRefundableINR] = useState(0);
  const [interestRefundableINR, setInterestRefundableINR] = useState(0);
  const [totalCostClientINR, setTotalCostClientINR] = useState(0);
  const [roiMonths, setRoiMonths] = useState(0);

  useEffect(() => {
    const annualQty = volumeTonsPerMonth > 0 ? volumeTonsPerMonth * 12 : 0;
    setAnnualQtyTons(annualQty);

    if (ksmCostINR > 0) {
      const flownetics = ksmCostINR * 0.7;
      const diffPerKg = ksmCostINR - flownetics;
      const faasPerKg = diffPerKg * (faasPercent / 100);

      setFlowneticsKsmINR(flownetics);
      setSavingsRmPerKgINR(diffPerKg);
      setFaasPerKgINR(faasPerKg);

      if (annualQty > 0) {
        const savingsPerAnnum = diffPerKg * annualQty * 1000;
        const flowneticsFeesYear = faasPerKg * annualQty * 1000;
        setSavingsRmPerAnnumINR(savingsPerAnnum);
        setFlowneticsFeesPerYearINR(flowneticsFeesYear);
        setSavingsAfterFaasINR(savingsPerAnnum - flowneticsFeesYear);
      }
    }

    let totalReactionCost = 0;
    reactions.forEach((r) => {
      if (r && REACTION_COSTS_INR[r]) {
        totalReactionCost += REACTION_COSTS_INR[r];
      }
    });

    let discountRate = 0;
    if (numSteps === 2) discountRate = 0.07;
    else if (numSteps === 3) discountRate = 0.11;
    else if (numSteps === 4) discountRate = 0.15;

    const partA = totalReactionCost * (1 - discountRate);
    const partBC = partA * 2;

    let vol = volumeTonsPerMonth > 0 ? volumeTonsPerMonth : 1;
    let multiplier = 2;
    if (vol <= 10) multiplier = 2;
    else if (vol <= 20) multiplier = 2.5;
    else if (vol <= 30) multiplier = 3;
    else if (vol <= 40) multiplier = 4;
    else multiplier = 5;

    const refundable = partBC * multiplier;
    const factor = Math.pow(1.12, 3);
    const interest = refundable * (factor - 1);
    const totalCost = partA + partBC + interest;

    setPartA_INR(partA);
    setPartBC_INR(partBC);
    setRefundableINR(refundable);
    setInterestRefundableINR(interest);
    setTotalCostClientINR(totalCost);

    if (savingsAfterFaasINR > 0 && totalCost > 0) {
      setRoiMonths((totalCost / savingsAfterFaasINR) * 12);
    } else {
      setRoiMonths(0);
    }
  }, [currency, numSteps, reactions, volumeTonsPerMonth, ksmCostINR, faasPercent, savingsAfterFaasINR]);

  const formatMoney = (amountINR: number) => {
    if (!amountINR || amountINR === 0) return '';
    const rate = FX_RATES[currency];
    const converted = amountINR * rate;
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${symbol} ${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const handleReactionChange = (index: number, value: ReactionType) => {
    const newReactions = [...reactions];
    newReactions[index] = value;
    setReactions(newReactions);
  };

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handleDownload = async (userData: UserData) => {
    // This function is not used - CalculatorWizard handles downloads
    // Keeping for backward compatibility if needed
    console.warn('Calculator.tsx handleDownload called - use CalculatorWizard instead');
  };

  return (
    <section id="calculator" className="py-16 px-6 bg-gradient-to-b from-brand-black to-gray-900 overflow-hidden relative">
      <div ref={ref} className="max-w-5xl mx-auto relative z-10 reveal-on-scroll">
        <div className="text-center mb-6">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-3 block">FaaS Economics</span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-3 text-white">
            Calculate Your ROI.
          </h2>
          <p className="text-gray-300 text-base">Comprehensive savings analysis for Factory-as-a-Service deployment.</p>
        </div>

        {(roiMonths > 0 || savingsAfterFaasINR > 0) && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-brand-green via-green-600 to-green-700 rounded-xl p-4 text-white relative overflow-hidden shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-widest mb-1 text-white/90">ROI Period</div>
                <div className="text-3xl font-black mb-1">{roiMonths > 0 ? roiMonths.toFixed(1) : '--'}</div>
                <div className="text-xs font-medium text-white/90">Months to Break Even</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-purple via-purple-600 to-purple-700 rounded-xl p-4 text-white relative overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-widest mb-1 text-white/90">Annual Savings</div>
                <div className="text-2xl font-black mb-1 truncate">{formatMoney(savingsAfterFaasINR)}</div>
                <div className="text-xs font-medium text-white/90">After FaaS Fees</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-orange via-orange-600 to-orange-700 rounded-xl p-4 text-white relative overflow-hidden shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02] group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-widest mb-1 text-white/90">Total Investment</div>
                <div className="text-2xl font-black mb-1 truncate">{formatMoney(totalCostClientINR)}</div>
                <div className="text-xs font-medium text-white/90">Client Cost</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-1.5 rounded-2xl border border-gray-700 shadow-2xl">
          <div className="bg-black/40 backdrop-blur rounded-xl p-3 md:p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green"></div>
                <h3 className="text-lg font-semibold text-white">FaaS Calculator</h3>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs font-medium text-white focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none hover:bg-gray-700 transition-colors"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-brand-purple pl-3">
                <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5 text-gray-400">Number of Steps</label>
                <select
                  value={numSteps}
                  onChange={(e) => setNumSteps(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none hover:bg-gray-700 transition-colors"
                >
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5 text-gray-400">Volumes (Tons / Month)</label>
                <input
                  type="number"
                  value={volumeTonsPerMonth || ''}
                  onChange={(e) => setVolumeTonsPerMonth(parseFloat(e.target.value) || 0)}
                  placeholder="Enter tons (1-100)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none hover:bg-gray-700 transition-colors"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Volume Slider</label>
                <span className="text-xs font-bold text-brand-orange">{volumeTonsPerMonth.toFixed(0)} Tons/Month</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={volumeTonsPerMonth}
                onChange={(e) => setVolumeTonsPerMonth(parseFloat(e.target.value))}
                className="w-full accent-brand-orange"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-purple mb-3">Reaction Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step}>
                    <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-gray-400">
                      Reaction {step}
                    </label>
                    <select
                      value={reactions[step - 1]}
                      onChange={(e) => handleReactionChange(step - 1, e.target.value as ReactionType)}
                      disabled={step > numSteps}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-gray-700 transition-colors"
                    >
                      <option value="">-- Select --</option>
                      <option value="L-L">L-L</option>
                      <option value="L-L+C">L-L+C</option>
                      <option value="L-G">L-G</option>
                      <option value="G-G">G-G</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-orange mb-3">KSM Economics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-gray-400">Current Batch KSM Cost</label>
                  <input
                    type="number"
                    value={ksmCostINR || ''}
                    onChange={(e) => setKsmCostINR(parseFloat(e.target.value) || 0)}
                    placeholder="Enter cost"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none hover:bg-gray-700 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-gray-400">Annual Quantity (Tons)</label>
                  <input
                    type="text"
                    value={annualQtyTons > 0 ? annualQtyTons.toFixed(0) : ''}
                    readOnly
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-400"
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">FaaS Fee %</label>
                  <span className="text-xs font-bold text-brand-orange">{faasPercent}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="60"
                  step="1"
                  value={faasPercent}
                  onChange={(e) => setFaasPercent(parseInt(e.target.value))}
                  className="w-full accent-brand-orange"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">Results & Savings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ResultField label="Flownetics KSM Cost" value={formatMoney(flowneticsKsmINR)} />
                <ResultField label="Savings from RM Per Kg" value={formatMoney(savingsRmPerKgINR)} />
                <ResultField label="FaaS Fees Per Kg" value={formatMoney(faasPerKgINR)} />
                <ResultField label="Savings from RM Per Annum" value={formatMoney(savingsRmPerAnnumINR)} highlight />
                <ResultField label="Flownetics Fees Per Year" value={formatMoney(flowneticsFeesPerYearINR)} />
                <ResultField label="Net Savings After FaaS" value={formatMoney(savingsAfterFaasINR)} highlight />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-purple mb-3">Investment & ROI</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ResultField label="Client Investment Part A" value={formatMoney(partA_INR)} />
                <ResultField label="Client Investment Part B + C" value={formatMoney(partBC_INR)} />
                <ResultField label="Refundable Deposit" value={formatMoney(refundableINR)} />
                <ResultField label="Interest on Refundable (3y @ 12%)" value={formatMoney(interestRefundableINR)} />
                <ResultField label="Total Cost for Client" value={formatMoney(totalCostClientINR)} highlight />
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-wide mb-1 text-gray-400">ROI (Months)</label>
                  <div className="bg-brand-green/20 border-2 border-brand-green rounded-lg p-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-brand-green">
                      {roiMonths > 0 ? roiMonths.toFixed(1) : '--'}
                    </span>
                    {roiMonths > 0 && (
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Years</div>
                        <div className="text-base font-semibold text-brand-green">{(roiMonths / 12).toFixed(1)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showSuccess && (
              <div className="mt-6 bg-green-50 border-2 border-brand-green rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                <CheckCircle className="w-6 h-6 text-brand-green flex-shrink-0" />
                <div className="text-sm text-brand-green font-medium">
                  Report sent to your email! Please check your inbox.
                </div>
              </div>
            )}

            <button
              onClick={handleDownloadClick}
              className="mt-6 w-full bg-gradient-to-r from-brand-purple to-brand-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </section>
  );
}

function ResultField({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5 text-gray-300">{label}</label>
      <div className={`relative rounded-lg p-3 transition-all duration-300 ${
        highlight
          ? 'bg-gradient-to-r from-brand-green/20 to-brand-green/10 border-2 border-brand-green shadow-lg shadow-brand-green/20 group-hover:shadow-xl group-hover:shadow-brand-green/30'
          : 'bg-gray-800/50 border border-gray-700 group-hover:border-brand-purple/50 group-hover:shadow-lg'
      }`}>
        {highlight && <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>}
        <div className={`text-base font-bold truncate relative z-10 ${
          highlight ? 'text-brand-green' : 'text-white'
        }`}>
          {value || '—'}
        </div>
      </div>
    </div>
  );
}
