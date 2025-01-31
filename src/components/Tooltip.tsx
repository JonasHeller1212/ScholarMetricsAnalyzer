import React, { useState, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

interface TooltipProps {
  content: {
    description: string;
    pros: string;
    cons: string;
    link?: string;
  };
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'bottom' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<number>();

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 300); // 300ms delay before hiding
  };

  return (
    <div className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {isVisible && (
        <div 
          className={`absolute z-50 w-72 p-4 ${
            position === 'top' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          } -translate-x-1/2 left-1/2 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100/50`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <p className="text-sm text-gray-700 mb-3">{content.description}</p>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Pros:</p>
                <p className="text-xs text-gray-600">{content.pros}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-red-600 mb-1">Cons:</p>
                <p className="text-xs text-gray-600">{content.cons}</p>
              </div>
              
              {content.link && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <a
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Learn more</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
            
            {/* Add arrow pointing in the right direction */}
            <div className={`absolute ${
              position === 'top' 
                ? '-bottom-2 border-t border-r' 
                : '-top-2 border-b border-r'
            } left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 transform rotate-45 border-gray-100/50`}></div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}