import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <Shield className="w-16 h-16 text-cyan-400 mr-4" />
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            SecureX
          </h1>
          <Sparkles className="w-16 h-16 text-purple-400 ml-4" />
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          The Future of Document Intelligence
        </p>
        
        <div className="text-lg md:text-xl text-gray-400 mb-12">
          <span className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold">
            Web3 + AI
          </span>
          {' '}Powered Platform for Secure Document Management
        </div>
        
        <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <span className="relative">Explore Features</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
