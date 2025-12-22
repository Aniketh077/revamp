import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import Pillars from './components/Pillars';
import AIArchitect from './components/AIArchitect';
import CalculatorWizard from './components/CalculatorWizard';
import Advantage from './components/Advantage';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PillarDetail from './components/PillarDetail';
import BlogDetail from './components/BlogDetail';
import AdminDashboard from './components/AdminDashboard';

function HomePage() {
  return (
    <>
      <Hero />
      <VideoSection />
      <Pillars />
      <AIArchitect />
      <CalculatorWizard />
      <Advantage />
      <About />
      <Blog />
      <Contact />
    </>
  );
}

function App() {
  return (
    <div className="bg-white text-brand-black selection:bg-brand-purple selection:text-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pillar/:pillarId" element={<PillarDetail />} />
        <Route path="/blog/:blogId" element={<BlogDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <div className="w-full relative overflow-hidden">
        <img 
          src="/media/bar.jpg" 
          alt="Flownetics" 
          className="w-full h-3 object-cover"
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
