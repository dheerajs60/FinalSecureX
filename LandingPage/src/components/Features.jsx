import React from 'react';
import FeatureCard from './FeatureCard';
import { Brain, Shield, Upload, BarChart3 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 1,
      title: 'AI-Powered Document Summarization',
      description: 'Advanced neural networks analyze and distill complex documents into actionable insights. Our AI understands context, extracts key information, and provides intelligent summaries in seconds.',
      icon: Brain,
      visual: 'ai-document',
      alignment: 'left'
    },
    {
      id: 2,
      title: 'Blockchain-Based Document Verification',
      description: 'Immutable proof of authenticity through distributed ledger technology. Every document is cryptographically secured and verified through our decentralized network.',
      icon: Shield,
      visual: 'blockchain',
      alignment: 'right'
    },
    {
      id: 3,
      title: 'Upload & Store with Proof-of-Integrity',
      description: 'Military-grade encryption meets blockchain integrity. Your documents are protected with quantum-resistant security and permanent proof of their untampered state.',
      icon: Upload,
      visual: 'secure-upload',
      alignment: 'left'
    },
    {
      id: 4,
      title: 'Intelligent Dashboard',
      description: 'Real-time analytics and insights at your fingertips. Monitor document status, track verification progress, and access AI-generated summaries through our intuitive interface.',
      icon: BarChart3,
      visual: 'dashboard',
      alignment: 'right'
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the next generation of document management with cutting-edge AI and blockchain technology
          </p>
        </div>
        
        <div className="space-y-32">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
