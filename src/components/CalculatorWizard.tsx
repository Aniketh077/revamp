import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, DollarSign, Calendar, PieChart, BarChart3, Download, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ROIDashboard } from './ROIDashboard';
import { ROICharts } from './ROICharts';
import { downloadROIReport } from '../lib/api';

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

type Step = 'basics' | 'reactions' | 'economics' | 'results';

export default function CalculatorWizard() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [currentStep, setCurrentStep] = useState<Step>('basics');

  const [currency, setCurrency] = useState<Currency>('INR');
  const [numSteps, setNumSteps] = useState(1);
  const [reactions, setReactions] = useState<ReactionType[]>(['', '', '', '']);
  const [volumeTonsPerMonth, setVolumeTonsPerMonth] = useState(10);
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

  // Download modal states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadName, setDownloadName] = useState('');
  const [downloadEmail, setDownloadEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

    const vol = volumeTonsPerMonth > 0 ? volumeTonsPerMonth : 1;
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

  const formatMoneyShort = (amountINR: number) => {
    if (!amountINR || amountINR === 0) return '0';
    const rate = FX_RATES[currency];
    const converted = amountINR * rate;
    return converted.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleReactionChange = (index: number, value: ReactionType) => {
    const newReactions = [...reactions];
    newReactions[index] = value;
    setReactions(newReactions);
  };

  const steps: { id: Step; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'basics', label: 'Basic Info', icon: DollarSign },
    { id: 'reactions', label: 'Process Details', icon: BarChart3 },
    { id: 'economics', label: 'Economics', icon: TrendingUp },
    { id: 'results', label: 'Results & ROI', icon: PieChart }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const canProceed = () => {
    if (currentStep === 'basics') return volumeTonsPerMonth > 0 && numSteps > 0;
    if (currentStep === 'reactions') return reactions.slice(0, numSteps).every(r => r !== '');
    if (currentStep === 'economics') return ksmCostINR > 0;
    return true;
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleDownload = async () => {
    if (!downloadName || !downloadEmail) {
      return;
    }

    setSendingEmail(true);
    try {
      await downloadROIReport({
        name: downloadName,
        email: downloadEmail,
        reportData: {
          currency,
          currencySymbol: CURRENCY_SYMBOLS[currency],
          volumeTonsPerMonth,
          annualQtyTons,
          numSteps,
          reactions,
          ksmCostINR,
          flowneticsKsmINR,
          savingsRmPerKgINR,
          faasPerKgINR,
          savingsRmPerAnnumINR,
          flowneticsFeesPerYearINR,
          savingsAfterFaasINR,
          partA_INR,
          partBC_INR,
          refundableINR,
          interestRefundableINR,
          totalCostClientINR,
          roiMonths,
          faasPercent,
        },
      });
      setEmailSent(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <section id="calculator" className="py-32 px-6 bg-gradient-to-b from-brand-black via-gray-900 to-brand-black overflow-hidden relative">
      <div ref={ref} className="max-w-7xl mx-auto relative z-10 reveal-on-scroll">
        <div className="text-center mb-12">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-4 block">FaaS ROI Calculator</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-white">
            Calculate Your Investment Return.
          </h2>
          <p className="text-gray-300 text-lg">Step-by-step analysis with comprehensive visualizations.</p>
        </div>

        <div className="mb-8 flex justify-between items-center max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 transition-all ${
                    isActive
                      ? 'text-brand-orange'
                      : isCompleted
                      ? 'text-brand-green hover:text-brand-orange'
                      : 'text-gray-400 hover:text-brand-orange'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-purple text-white shadow-lg shadow-brand-purple/50'
                      : isCompleted
                      ? 'bg-brand-green text-white'
                      : 'bg-gray-800 text-gray-400 border-2 border-gray-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium hidden md:block text-white">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all rounded-full ${
                    isCompleted ? 'bg-gradient-to-r from-brand-green to-brand-purple' : 'bg-gray-800'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12 mb-8 min-h-[500px]">
            {currentStep === 'basics' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Basic Information</h3>
                  <p className="text-gray-300">Let's start with your production requirements.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-widest mb-3 text-gray-300">
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all appearance-none cursor-pointer hover:border-brand-purple/50"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e07742' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="INR" className="bg-gray-800">INR (₹)</option>
                        <option value="USD" className="bg-gray-800">USD ($)</option>
                        <option value="EUR" className="bg-gray-800">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-widest mb-3 text-gray-300">
                      Number of Process Steps
                    </label>
                    <div className="relative">
                      <select
                        value={numSteps}
                        onChange={(e) => setNumSteps(parseInt(e.target.value))}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all appearance-none cursor-pointer hover:border-brand-purple/50"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e07742' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem'
                        }}
                      >
                        {[1, 2, 3, 4].map(n => <option key={n} value={n} className="bg-gray-800">{n} Step{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                      Monthly Production Volume
                    </label>
                    <span className="text-2xl font-bold text-brand-orange">
                      {volumeTonsPerMonth} <span className="text-base text-gray-400">tons</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={volumeTonsPerMonth}
                    onChange={(e) => setVolumeTonsPerMonth(parseFloat(e.target.value))}
                    className="w-full accent-brand-orange h-3 rounded-lg appearance-none bg-gradient-to-r from-gray-700 to-brand-orange/30"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>1 ton</span>
                    <span>50 tons</span>
                    <span>100 tons</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl p-6 border-l-4 border-brand-orange shadow-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand-orange mt-1" />
                    <div>
                      <div className="font-semibold text-white mb-1">Annual Production</div>
                      <div className="text-2xl font-bold text-brand-orange">
                        {volumeTonsPerMonth * 12} tons/year
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Based on {volumeTonsPerMonth} tons per month
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'reactions' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Process Configuration</h3>
                  <p className="text-gray-300">Select the reaction type for each step of your process.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`transition-all ${step > numSteps ? 'opacity-30' : ''}`}
                    >
                      <label className="block text-sm font-semibold uppercase tracking-widest mb-3 text-gray-300">
                        Step {step} Reaction Type
                      </label>
                      <div className="relative">
                        <select
                          value={reactions[step - 1]}
                          onChange={(e) => handleReactionChange(step - 1, e.target.value as ReactionType)}
                          disabled={step > numSteps}
                          className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer hover:border-brand-purple/50"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e07742' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            paddingRight: '2.5rem'
                          }}
                        >
                          <option value="" className="bg-gray-800">Select reaction type...</option>
                          <option value="L-L" className="bg-gray-800">Liquid-Liquid (L-L)</option>
                          <option value="L-L+C" className="bg-gray-800">Liquid-Liquid + Catalyst (L-L+C)</option>
                          <option value="L-G" className="bg-gray-800">Liquid-Gas (L-G)</option>
                          <option value="G-G" className="bg-gray-800">Gas-Gas (G-G)</option>
                        </select>
                      </div>
                      {reactions[step - 1] && REACTION_COSTS_INR[reactions[step - 1]] && (
                        <div className="mt-2 text-sm text-gray-400">
                          Equipment cost: <span className="text-brand-orange font-semibold">{formatMoney(REACTION_COSTS_INR[reactions[step - 1]])}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {reactions.some(r => r !== '') && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border-l-4 border-brand-orange shadow-lg">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-brand-orange mt-1" />
                      <div>
                        <div className="font-semibold text-white mb-1">Total Equipment Cost</div>
                        <div className="text-2xl font-bold text-brand-orange">
                          {formatMoney(reactions.reduce((sum, r) => sum + (REACTION_COSTS_INR[r] || 0), 0))}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Volume-based discount: {numSteps === 2 ? '7%' : numSteps === 3 ? '11%' : numSteps === 4 ? '15%' : '0%'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'economics' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Economic Parameters</h3>
                  <p className="text-gray-300">Configure your cost structure and fee parameters.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-widest mb-3 text-gray-300">
                    Current Batch KSM Cost per Kg
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                      {CURRENCY_SYMBOLS[currency]}
                    </span>
                    <input
                      type="number"
                      value={ksmCostINR || ''}
                      onChange={(e) => setKsmCostINR(parseFloat(e.target.value) || 0)}
                      placeholder="Enter your current cost"
                      className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-10 pr-4 py-4 text-white text-lg placeholder-gray-500 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                    />
                  </div>
                </div>

                {ksmCostINR > 0 && (
                  <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl p-6 border-l-4 border-brand-green shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-2">
                          Flownetics KSM Cost
                        </div>
                        <div className="text-3xl font-bold text-brand-green">
                          {formatMoney(flowneticsKsmINR)}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">30% reduction</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-2">
                          Savings Per Kg
                        </div>
                        <div className="text-3xl font-bold text-brand-green">
                          {formatMoney(savingsRmPerKgINR)}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">Per kilogram savings</div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                      FaaS Fee Percentage
                    </label>
                    <span className="text-2xl font-bold text-brand-orange">{faasPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="60"
                    step="1"
                    value={faasPercent}
                    onChange={(e) => setFaasPercent(parseInt(e.target.value))}
                    className="w-full accent-brand-orange h-3 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>40%</span>
                    <span>50%</span>
                    <span>60%</span>
                  </div>
                </div>

                {faasPerKgINR > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">
                        FaaS Fee Per Kg
                      </div>
                      <div className="text-xl font-bold text-brand-orange">
                        {formatMoney(faasPerKgINR)}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">
                        Annual Flownetics Fees
                      </div>
                      <div className="text-xl font-bold text-brand-orange">
                        {formatMoney(flowneticsFeesPerYearINR)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'results' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Your ROI Analysis</h3>
                  <p className="text-gray-300">Comprehensive breakdown of your investment return.</p>
                </div>

                <ROIDashboard
                  roiMonths={roiMonths}
                  savingsAfterFaasINR={savingsAfterFaasINR}
                  totalCostClientINR={totalCostClientINR}
                  formatMoney={formatMoney}
                />

                <ROICharts
                  currency={currency}
                  currencySymbol={CURRENCY_SYMBOLS[currency]}
                  ksmCostINR={ksmCostINR}
                  flowneticsKsmINR={flowneticsKsmINR}
                  partA_INR={partA_INR}
                  partBC_INR={partBC_INR}
                  interestRefundableINR={interestRefundableINR}
                  savingsRmPerAnnumINR={savingsRmPerAnnumINR}
                  flowneticsFeesPerYearINR={flowneticsFeesPerYearINR}
                  savingsAfterFaasINR={savingsAfterFaasINR}
                  roiMonths={roiMonths}
                  formatMoneyShort={formatMoneyShort}
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="flex-1 bg-gradient-purple text-white px-6 py-4 rounded-2xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/30"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-brand-orange"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all bg-gradient-purple text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-purple/30"
              >
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentStep('basics');
                  const element = document.querySelector('#calculator');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all bg-gradient-purple text-white hover:opacity-90 shadow-lg shadow-brand-purple/30"
              >
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            {emailSent ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Email Sent!</h3>
                <p className="text-gray-300 mb-6">
                  We've sent the report to your email. You will receive it shortly.
                </p>
                <button
                  onClick={() => {
                    setShowDownloadModal(false);
                    setEmailSent(false);
                    setDownloadName('');
                    setDownloadEmail('');
                  }}
                  className="bg-gradient-purple text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">Download ROI Report</h3>
                <p className="text-gray-300 mb-6">
                  Enter your details to receive the report via email.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDownload();
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={downloadName}
                    onChange={(e) => setDownloadName(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDownloadModal(false);
                        setDownloadName('');
                        setDownloadEmail('');
                      }}
                      className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingEmail}
                      className="flex-1 bg-gradient-purple text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {sendingEmail ? 'Sending...' : 'Send Report'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
