import React from 'react';
import { FileText, Lock, Upload, BarChart3, Cpu, Shield, Database } from 'lucide-react';

const Visual3D = ({ type }) => {
  const visuals = {
    'ai-document': (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Main Document */}
        <div className="relative w-48 h-60 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
            <div className="p-4 space-y-2">
              <div className="w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              <div className="w-3/4 h-2 bg-gradient-to-r from-cyan-400/60 to-blue-500/60 rounded-full"></div>
              <div className="w-full h-2 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-full"></div>
              <div className="w-2/3 h-2 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full"></div>
            </div>
          </div>
          {/* AI Chip */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Neural Network Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-16 bg-gradient-to-t from-transparent via-cyan-400 to-transparent animate-pulse"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>
      </div>
    ),
    
    'blockchain': (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Main Document */}
        <div className="relative w-40 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl">
          <div className="absolute inset-3 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
            <div className="p-3 space-y-2">
              <div className="w-full h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
              <div className="w-3/4 h-2 bg-gradient-to-r from-green-400/60 to-blue-500/60 rounded-full"></div>
              <div className="w-full h-2 bg-gradient-to-r from-green-400/40 to-blue-500/40 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Blockchain Blocks */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center animate-pulse"
              style={{ animationDelay: `${i * 300}ms` }}
            >
              <div className="w-6 h-6 bg-white/20 rounded border"></div>
            </div>
          ))}
        </div>
        
        {/* Connecting Lines */}
        <div className="absolute left-12 top-1/2 w-32 h-px bg-gradient-to-r from-purple-400 to-green-400 transform -translate-y-1/2">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-green-400 animate-pulse"></div>
        </div>
      </div>
    ),
    
    'secure-upload': (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Digital Vault */}
        <div className="relative w-56 h-56 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl">
          <div className="absolute inset-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center justify-center h-full">
              <Shield className="w-16 h-16 text-cyan-400" />
            </div>
          </div>
          
          {/* Upload Arrow */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Hash ID */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full px-4 py-2 text-xs font-mono text-white">
            #A7B9C2D8E1F0
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 400}ms`
              }}
            />
          ))}
        </div>
      </div>
    ),
    
    'dashboard': (
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Main Dashboard */}
        <div className="relative w-64 h-52 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl transform perspective-1000 rotateX-5">
          <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
            {/* Dashboard Header */}
            <div className="p-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <div className="flex-1 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-purple-400" />
                <div className="flex-1 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
              
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-green-400" />
                <div className="flex-1 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating UI Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-xl backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center animate-float">
          <Shield className="w-8 h-8 text-cyan-400" />
        </div>
        
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-lg backdrop-blur-sm border border-green-500/30 flex items-center justify-center animate-float delay-1000">
          <div className="w-6 h-6 bg-green-400 rounded-full"></div>
        </div>
      </div>
    )
  };

  return (
    <div className="transform hover:scale-105 transition-transform duration-500">
      {visuals[type]}
    </div>
  );
};

export default Visual3D;
