import React, { useEffect, useRef } from 'react';
import { Brain, Shield, Upload, BarChart3, Sparkles, FileText, Wifi, Lock, Zap, Github, Code, Server, Cpu, Database, Cloud, Users, User } from 'lucide-react';
import { useState } from 'react';

const SingleSlideFeatures = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 150;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles with exact #262360 color theme
    for (let i = 0; i < particleCount; i++) {
      const baseHue = 245; // Close to #262360 hue
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: `hsl(${baseHue + Math.random() * 20 - 10}, 45%, 40%)` // Around #262360 shade
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(38, 35, 96, ${(1 - distance / 100) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const features = [
    {
      id: 1,
      title: '📄 AI-Powered Document Summarization',
      description: 'Instantly generates human-like summaries and key insights from any uploaded document (PDF, DOCX, etc.) using LLMs.',
      icon: Brain,
      visual: 'ai-document',
      alignment: 'left',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 2,
      title: '🔐 Blockchain-Based Document Verification',
      description: 'Every uploaded document\'s fingerprint (hash) is securely logged on the blockchain to ensure it\'s tamper-proof and verifiable anytime.',
      icon: Shield,
      visual: 'blockchain',
      alignment: 'right',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      id: 3,
      title: '🧾 Upload & Store with Proof-of-Integrity',
      description: 'Users can upload documents (currently stored locally for MVP), with a unique ID and hash generated for integrity verification.',
      icon: Upload,
      visual: 'secure-upload',
      alignment: 'left',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 4,
      title: '📊 Intelligent Dashboard',
      description: 'Clean, modern UI to view, search, and manage uploaded documents along with verification status and summarized content.',
      icon: BarChart3,
      visual: 'dashboard',
      alignment: 'right',
      color: 'from-blue-400 to-purple-500'
    }
  ];

  const techStack = [
    {
      id: 1,
      title: '🖥️ Frontend',
      technologies: ['HTML, CSS, JavaScript', 'React.js', 'MetaMask (wallet login)'],
      icon: Code,
      color: 'from-purple-400 to-violet-500'
    },
    {
      id: 2,
      title: '🔧 Backend',
      technologies: ['Node.js', 'Express.js', 'Ethers.js', 'Axios'],
      icon: Server,
      color: 'from-indigo-400 to-purple-500'
    },
    {
      id: 3,
      title: '🤖 AI / NLP',
      technologies: ['Python', 'OpenAI API (text summarization)'],
      icon: Cpu,
      color: 'from-violet-400 to-fuchsia-500'
    },
    {
      id: 4,
      title: '🔗 Blockchain',
      technologies: ['Solidity', 'Remix IDE', 'Polygon Mumbai Testnet', 'MetaMask (smart contract deployment + auth)'],
      icon: Database,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 5,
      title: '☁️ Storage',
      technologies: ['IPFS', 'Pinata (IPFS integration)'],
      icon: Cloud,
      color: 'from-indigo-400 to-violet-500'
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Panav',
      role: 'AI/NLP & Blockchain Developer',
      initials: 'PN',
      github: '#',
      color: 'from-purple-400 to-violet-500'
    },
    {
      id: 2,
      name: 'Dheeraj',
      role: 'Backend Developer',
      initials: 'DH',
      github: '#',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      id: 3,
      name: 'Dhanush',
      role: 'Frontend Developer',
      initials: 'DN',
      github: '#',
      color: 'from-violet-400 to-fuchsia-500'
    },
    {
      id: 4,
      name: 'Bhargav',
      role: 'AI/NLP & Blockchain Developer',
      initials: 'BH',
      github: '#',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const Visual3D = ({ type, color }) => {
    const visuals = {
      'ai-document': (
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
          <div className="relative w-28 h-32 md:w-36 md:h-40 rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105" style={{
            background: 'linear-gradient(135deg, rgba(38, 35, 96, 0.9) 0%, rgba(30, 27, 80, 0.9) 100%)',
            border: '1px solid rgba(38, 35, 96, 0.3)'
          }}>
            <div className="absolute inset-3 rounded-lg backdrop-blur-sm" style={{
              background: 'linear-gradient(135deg, rgba(38, 35, 96, 0.15) 0%, rgba(50, 45, 120, 0.15) 100%)',
              border: '1px solid rgba(38, 35, 96, 0.4)'
            }}>
              <div className="p-3 space-y-2">
                <div className="w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                <div className="w-3/4 h-1.5 bg-gradient-to-r from-blue-400/60 to-indigo-500/60 rounded-full animate-pulse delay-100"></div>
                <div className="w-full h-1.5 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 rounded-full animate-pulse delay-200"></div>
                <div className="w-5/6 h-1.5 bg-gradient-to-r from-blue-400/30 to-indigo-500/30 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            {/* AI Brain Chip */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg shadow-xl flex items-center justify-center animate-pulse" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.6)'
            }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            {/* AI Processing Indicator */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full px-3 py-1 text-xs font-mono text-white shadow-lg" style={{
              background: 'linear-gradient(135deg, rgba(38, 35, 96, 0.9) 0%, rgba(30, 27, 80, 0.9) 100%)',
              border: '1px solid rgba(38, 35, 96, 0.6)'
            }}>
              AI Processing...
            </div>
          </div>
          {/* Neural Network Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-12 bg-gradient-to-t from-transparent via-purple-400 to-transparent animate-pulse"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${10 + i * 8}%`,
                  animationDelay: `${i * 200}ms`,
                  filter: 'drop-shadow(0 0 4px #7c3aed)'
                }}
              />
            ))}
          </div>
          {/* Floating AI Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                  animationDelay: `${i * 300}ms`,
                  filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.8))'
                }}
              />
            ))}
          </div>
        </div>
      ),
      
      'blockchain': (
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
          <div className="relative w-24 h-28 md:w-28 md:h-32 bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl shadow-2xl border border-indigo-500/20 hover:scale-105 transition-all duration-500">
            <div className="absolute inset-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/30 backdrop-blur-sm">
              <div className="p-3 space-y-2">
                <div className="w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                <div className="w-3/4 h-1.5 bg-gradient-to-r from-indigo-400/60 to-purple-500/60 rounded-full animate-pulse delay-100"></div>
                <div className="w-full h-1.5 bg-gradient-to-r from-indigo-400/40 to-purple-500/40 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
            {/* Blockchain Verified Badge */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full shadow-xl flex items-center justify-center animate-pulse border border-indigo-300/50">
              <Lock className="w-4 h-4 text-white" />
            </div>
            {/* Hash Display */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full px-3 py-1 text-xs font-mono text-white border border-indigo-400/50 shadow-lg">
              HASH: A7B9C2
            </div>
          </div>
          {/* Blockchain Blocks */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg shadow-xl flex items-center justify-center animate-pulse border border-violet-300/50 hover:scale-110 transition-transform duration-300" 
                style={{ animationDelay: `${i * 300}ms` }}
              >
                <div className="w-4 h-4 bg-white/20 rounded border border-white/30"></div>
              </div>
            ))}
          </div>
          {/* Connecting Hash Lines */}
          <div className="absolute left-8 top-1/2 w-20 h-0.5 bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 transform -translate-y-1/2 animate-pulse shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.7))' }}></div>
          {/* Hash Flow Animation */}
          <div className="absolute left-8 top-1/2 w-2 h-2 bg-indigo-400 rounded-full transform -translate-y-1/2 animate-ping shadow-lg" style={{ filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.8))' }}></div>
        </div>
      ),
      
      'secure-upload': (
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
          <div className="relative w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl border border-violet-500/20 hover:scale-105 transition-all duration-500">
            <div className="absolute inset-3 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-12 h-12 text-violet-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 8px #7c3aed)' }} />
            </div>
            {/* Upload Progress Ring */}
            <div className="absolute inset-1 rounded-3xl border-2 border-violet-500/30">
              <div className="absolute inset-0 rounded-3xl border-2 border-violet-400 border-t-transparent animate-spin"></div>
            </div>
            {/* Upload Arrow */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full shadow-xl flex items-center justify-center border border-indigo-300/50">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>
            {/* Unique ID Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full px-3 py-1 text-xs font-mono text-white border border-violet-400/50 shadow-lg">
              ID: #A7B9C2D8
            </div>
          </div>
          {/* Floating Integrity Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse shadow-lg"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  animationDelay: `${i * 400}ms`,
                  filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))'
                }}
              />
            ))}
          </div>
          {/* Security Shield Effect */}
          <div className="absolute inset-0 rounded-3xl border border-violet-400/20 animate-pulse shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' }}></div>
        </div>
      ),
      
      'dashboard': (
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
          <div className="relative w-32 h-28 md:w-36 md:h-32 bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl border border-purple-500/20 hover:scale-105 transition-all duration-500 perspective-1000 rotateX-5">
            <div className="absolute inset-3 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/30 backdrop-blur-sm">
              {/* Dashboard Header */}
              <div className="p-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-200"></div>
                  <div className="ml-auto text-xs text-purple-400">📊 Dashboard</div>
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-purple-400" />
                  <div className="flex-1 h-1.5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-violet-400" />
                  <div className="flex-1 h-1.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse delay-200"></div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 text-indigo-400" />
                  <div className="flex-1 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse delay-300"></div>
                  <div className="w-3 h-3 bg-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Holographic Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-pulse"></div>
          </div>
          {/* Floating UI Elements */}
          <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-xl backdrop-blur-sm border border-purple-500/30 flex items-center justify-center animate-float shadow-xl">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 rounded-lg backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center animate-float delay-1000 shadow-xl">
            <div className="w-4 h-4 bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
          {/* Data Flow Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-gradient-to-t from-transparent via-purple-400 to-transparent animate-pulse"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${20 + i * 10}%`,
                  animationDelay: `${i * 300}ms`,
                  filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.7))'
                }}
              />
            ))}
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

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dynamic Particle Background */}
      <canvas
        ref={particlesRef}
        className="absolute inset-0 z-0"
        style={{ background: 'transparent' }}
      />

      {/* Updated Gradient Background with multiple colors */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(135deg, rgba(38, 35, 96, 0.98) 0%, rgba(50, 40, 120, 0.95) 25%, rgba(30, 60, 90, 0.95) 50%, rgba(40, 80, 100, 0.95) 75%, rgba(30, 27, 80, 0.95) 100%)'
      }}></div>

      {/* Animated Orbs - Updated to match #262360 theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ 
          backgroundColor: 'rgba(38, 35, 96, 0.08)',
          filter: 'drop-shadow(0 0 60px rgba(38, 35, 96, 0.15))'
        }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse delay-1000" style={{ 
          backgroundColor: 'rgba(50, 45, 120, 0.08)',
          filter: 'drop-shadow(0 0 60px rgba(50, 45, 120, 0.15))'
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full blur-3xl animate-pulse delay-500" style={{ 
          backgroundColor: 'rgba(45, 40, 110, 0.08)',
          filter: 'drop-shadow(0 0 40px rgba(45, 40, 110, 0.15))'
        }}></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full blur-2xl animate-pulse delay-2000" style={{ 
          backgroundColor: 'rgba(35, 30, 85, 0.08)',
          filter: 'drop-shadow(0 0 30px rgba(35, 30, 85, 0.15))'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Shield className="w-10 h-10 text-purple-400 mr-3 animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))' }} />
            <div className="absolute inset-0 w-10 h-10 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent animate-pulse">
            SecureX
          </h1>
          <div className="relative ml-3">
            <Sparkles className="w-10 h-10 text-violet-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' }} />
            <div className="absolute inset-0 w-10 h-10 bg-violet-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
        <p className="text-xl md:text-2xl text-gray-300 mb-3 font-semibold">
          Web3 + AI Powered Document Intelligence Platform
        </p>
        <p className="text-sm md:text-base text-gray-400 mb-6">
          Secure • Intelligent • Verifiable • Decentralized
        </p>
        
        {/* Connect Wallet CTA */}
        <button
          onClick={() => window.location.href = 'http://localhost:3000/'}
          className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-white shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 border border-green-400/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            <Wifi className="w-5 h-5" />
            <span>View Dashboard</span>
          </div>
        </button>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 flex-1 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isLeft = feature.alignment === 'left';
            
            return (
              <div 
                key={feature.id} 
                className={`group relative flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center gap-4 md:gap-6 p-6 rounded-2xl transition-all duration-500 hover:scale-105`}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Glowing Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color}/20 rounded-xl backdrop-blur-sm border border-current/30 shadow-lg`}>
                      <Icon className="w-6 h-6 text-current" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
                    </div>
                    <div className={`w-12 h-0.5 bg-gradient-to-r ${feature.color} rounded-full animate-pulse`}></div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <button className={`px-4 py-2 bg-gradient-to-r ${feature.color} rounded-xl font-semibold text-white text-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-current/30`}>
                    Learn More
                  </button>
                </div>
                
                {/* Enhanced Visual */}
                <div className="relative flex-shrink-0">
                  <Visual3D type={feature.visual} color={feature.color} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent mb-6">
              About SecureX
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full mx-auto mb-8"></div>
          </div>

          {/* Project Brief */}
          <div className="mb-20">
            <div 
              className="group relative p-8 rounded-2xl transition-all duration-500 hover:scale-105 max-w-4xl mx-auto text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full shadow-xl">
                    <FileText className="w-8 h-8 text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))' }} />
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Revolutionary Document Intelligence
                </h3>
                
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  SecureX is an AI-powered, blockchain-secured document vault that summarizes, encrypts, and stores your files with complete control and transparency.
                  It's the smarter, decentralized alternative to Google Drive + ChatGPT.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
                Tech Stack
              </h3>
              <p className="text-lg text-gray-400">
                Built with cutting-edge technologies for optimal performance and security
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {techStack.map((tech) => {
                const Icon = tech.icon;
                
                return (
                  <div 
                    key={tech.id} 
                    className="group relative p-6 rounded-2xl transition-all duration-500 hover:scale-105"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative text-center">
                      <div className={`inline-flex p-4 bg-gradient-to-r ${tech.color}/20 rounded-xl backdrop-blur-sm border border-current/30 shadow-lg mb-4`}>
                        <Icon className="w-8 h-8 text-current" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-4">
                        {tech.title}
                      </h4>
                      
                      <div className="space-y-2">
                        {tech.technologies.map((technology, index) => (
                          <div key={index} className="text-sm text-gray-300 bg-gray-800/50 rounded-lg py-2 px-3 border border-gray-700/50">
                            {technology}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent mb-4">
                Meet Our Team
              </h3>
              <p className="text-lg text-gray-400">
                Passionate developers building the future of document management
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="group relative p-6 rounded-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${member.color} rounded-full shadow-xl mb-4 text-white text-2xl font-bold border-2 border-white/20`}>
                      {member.initials}
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-2">
                      👨‍💻 {member.name}
                    </h4>
                    
                    <p className="text-sm text-gray-300 mb-4">
                      {member.role}
                    </p>
                    
                    <a 
                      href={member.github} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 border border-gray-700/50"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 text-center py-6 px-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full text-sm text-purple-400 border border-purple-500/30 backdrop-blur-sm shadow-lg">
            🚀 MVP Ready
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full text-sm text-indigo-400 border border-indigo-500/30 backdrop-blur-sm shadow-lg">
            💾 Local Storage
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full text-sm text-violet-400 border border-violet-500/30 backdrop-blur-sm shadow-lg">
            ⛓️ Blockchain Ready
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-400 font-medium">
          Experience the future of secure document management with Web3 technology
        </p>
      </div>
    </div>
  );
};

export default SingleSlideFeatures;