'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import type { BlockType } from '@/lib/ai';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockType: BlockType;
  onGenerate: (content: Record<string, any>) => void;
  defaultContext?: {
    name: string;
    description: string;
  };
}

export function AIGenerateModal({
  isOpen,
  onClose,
  blockType,
  onGenerate,
  defaultContext,
}: AIGenerateModalProps) {
  const { loading, error, generateBlock } = useAI();
  const [productName, setProductName] = useState(defaultContext?.name || '');
  const [productDescription, setProductDescription] = useState(defaultContext?.description || '');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedContent, setGeneratedContent] = useState<Record<string, any> | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const result = await generateBlock(blockType, {
      name: productName,
      description: productDescription,
      targetAudience: targetAudience || undefined,
    });
    
    if (result) {
      setGeneratedContent(result.content);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      onGenerate(generatedContent);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setGeneratedContent(null);
  };

  const blockLabels: Record<BlockType, string> = {
    hero: 'Hero Section',
    features: 'Features Section',
    testimonials: 'Testimonials',
    pricing: 'Pricing Section',
    faq: 'FAQ Section',
    cta: 'Call to Action',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            🤖 Generate {blockLabels[blockType]}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {!generatedContent ? (
            <>
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Trading Masterclass"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product in 2-3 sentences..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Beginner traders looking to go full-time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !productName || !productDescription}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🤖 Generating...' : '🤖 Generate Content'}
              </button>
            </>
          ) : (
            <>
              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Content Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                  {Object.entries(generatedContent).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-700">{key}:</span>{' '}
                      <span className="text-gray-600">
                        {typeof value === 'string'
                          ? value
                          : JSON.stringify(value, null, 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setGeneratedContent(null)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  🔄 Regenerate
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  ✅ Apply Content
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
