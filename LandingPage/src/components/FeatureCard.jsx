import React from 'react';
import Visual3D from './Visual3D';

const FeatureCard = ({ feature }) => {
  const { title, description, icon: Icon, visual, alignment } = feature;
  
  const isLeft = alignment === 'left';
  
  return (
    <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
      {/* Text Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm border border-cyan-500/30">
            <Icon className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {title}
        </h3>
        
        <p className="text-lg text-gray-300 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center gap-4 pt-4">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
            Learn More
          </button>
          <button className="px-6 py-3 border border-cyan-500/50 rounded-lg font-semibold text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300">
            View Demo
          </button>
        </div>
      </div>
      
      {/* 3D Visual */}
      <div className="flex-1 flex justify-center">
        <Visual3D type={visual} />
      </div>
    </div>
  );
};

export default FeatureCard;
