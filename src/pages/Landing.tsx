import { Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col justify-between bg-gradient-to-br bg-green-95 via-white to-amber-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Glowing Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 bg-emerald-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          
            <img src="favicon.ico" className="w-41 h-40"/>
        </div>

        {/* Glowing Title */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))',
                  animation: 'glow 2s ease-in-out infinite alternate'
                }}>
            Agripio
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed">
          Smart farming tools + Copyright education for better productivity
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          
          {!user && (
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200"
            >
              Sign In
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 border-t border-emerald-100">
        <p className="text-[11px] text-gray-400">
          © 2026 AgriPio Team &nbsp;|&nbsp; Protected
        </p>
        <p className="text-[10px] text-gray-300 mt-0.5">
          Source code, UI design, educational content &amp; AI persona are original creative works
        </p>
      </footer>

      {/* Custom styles for glow animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes glow {
            from { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5)); }
            to { filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 40px rgba(16, 185, 129, 0.4)); }
          }
        `
      }} />
    </div>
  );
}
