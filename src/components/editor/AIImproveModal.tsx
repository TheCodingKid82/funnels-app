'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import type { Tone } from '@/lib/ai';

interface AIImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  onSelect: (text: string) => void;
  productContext?: {
    name: string;
    description: string;
  };
}

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: 'punchier', label: 'Punchier', emoji: '💥' },
  { value: 'urgent', label: 'Add Urgency', emoji: '⏰' },
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'friendly', label: 'Friendly', emoji: '🤗' },
];

export function AIImproveModal({
  isOpen,
  onClose,
  originalText,
  onSelect,
  productContext,
}: AIImproveModalProps) {
  const { loading, error, improveCopy } = useAI();
  const [selectedTone, setSelectedTone] = useState<Tone>('punchier');
  const [variations, setVariations] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const result = await improveCopy(originalText, selectedTone, productContext);
    if (result) {
      setVariations(result.variations);
      setHasGenerated(true);
    }
  };

  const handleSelect = (text: string) => {
    onSelect(text);
    onClose();
    setVariations([]);
    setHasGenerated(false);
  };

  const handleClose = () => {
    onClose();
    setVariations([]);
    setHasGenerated(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            ✨ AI Improve Copy
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Original text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Text
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
              "{originalText}"
            </div>
          </div>

          {/* Tone selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTone === tone.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tone.emoji} {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {!hasGenerated && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '✨ Generating...' : '✨ Generate Variations'}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Variations */}
          {variations.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Pick a Variation
              </label>
              {variations.map((variation, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(variation)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border-2 border-transparent rounded-lg transition-colors"
                >
                  <span className="text-gray-900">{variation}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setVariations([]);
                  setHasGenerated(false);
                }}
                className="w-full py-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                🔄 Try Different Tone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
