import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AIArchitect() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  const analyzeReaction = async () => {
    if (!input.trim()) {
      return;
    }

    setLoading(true);
    setShowResult(false);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    if (!apiKey) {
      setResult('<p class="text-red-500 text-sm">API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.</p>');
      setShowResult(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `As a Senior Flow Chemist at Flownetics, analyze the feasibility of converting this batch reaction to continuous flow: "${input}".
                Format the response as HTML (no markdown, no html/body tags) using these exact tags:
                <h3>Feasibility Score: [X]/10</h3>
                <p><strong>Reactor Recommendation:</strong> [Brief Type]</p>
                <p><strong>Engineering Insight:</strong> [1-2 sentences on why flow is better or challenges]</p>
                Keep it concise, technical, and optimistic.`
              }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      const cleanHtml = aiText.replace(/```html/g, '').replace(/```/g, '');

      setResult(cleanHtml);
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setResult('<p class="text-red-500 text-sm">Analysis failed. Please try again later.</p>');
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeReaction();
    }
  };

  return (
    <section id="ai-architect" className="py-32 px-6 bg-gradient-to-b from-brand-light to-white relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-3xl"></div>
      
      <div ref={ref} className="max-w-4xl mx-auto relative z-10 reveal-on-scroll">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange blur-lg opacity-30"></div>
              <h2 className="relative text-4xl md:text-5xl font-semibold tracking-tighter bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
                AI Process Architect.
              </h2>
            </div>
          </div>
          <p className="text-brand-gray text-lg">Validate your molecule for flow chemistry in seconds.</p>
        </div>

        <div className="bg-gradient-to-br from-white to-brand-light p-2 rounded-3xl border-2 border-brand-purple/20 shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 md:p-10">
            <label className="block text-xs font-semibold uppercase tracking-widest mb-3 text-brand-gray">Reaction / Process Name</label>
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g. Exothermic Nitration of Toluene"
                className="flex-1 bg-brand-light border-2 border-gray-200 rounded-xl p-4 text-brand-black placeholder-gray-400 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none transition-all hover:border-brand-purple/50"
              />
              <button
                onClick={analyzeReaction}
                disabled={loading}
                className="bg-gradient-purple text-white px-8 py-4 rounded-2xl font-medium hover:opacity-90 transition-all shadow-lg shadow-brand-purple/30 flex items-center justify-center gap-2 min-w-[180px] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Analyze Feasibility ✨</span>
                )}
              </button>
            </div>
            <p className="text-xs text-brand-gray mt-3">Try inputting complex synthesis steps like "Grignard Reaction" or "Hydrogenation".</p>
          </div>

          {showResult && (
            <div className="mt-2 bg-white rounded-2xl p-6 md:p-10 border-t border-gray-100 animate-fade-in border-l-4 border-brand-orange shadow-lg">
              <div className="ai-content" dangerouslySetInnerHTML={{ __html: result }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
