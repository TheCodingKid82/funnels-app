'use client';

interface AIButtonProps {
  onClick: () => void;
  label?: string;
  size?: 'sm' | 'md';
}

/**
 * Sparkle button for AI-powered actions
 */
export function AIButton({ onClick, label = 'AI Improve', size = 'sm' }: AIButtonProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md font-medium hover:from-purple-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1`}
    >
      <span>✨</span>
      <span>{label}</span>
    </button>
  );
}
