/**
 * Gradient Utilities for UniversalButton
 * 
 * Handles the unified gradient system that consolidates all section-specific
 * gradient implementations into a single, flexible system.
 */

import { GlobalVariantKey } from '../../../types/shared';
import { GradientColor, GradientConfig, SectionContext } from '../types';

/**
 * Predefined gradient configurations for Journey section
 */
const JOURNEY_GRADIENTS: Record<GradientColor, GradientConfig> = {
  lime: {
    background: 'linear-gradient(to right, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
    hoverBackground: 'linear-gradient(to right, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
    textColor: 'var(--color-gray-900, #111827)'
  },
  cyan: {
    background: 'linear-gradient(to right, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
    hoverBackground: 'linear-gradient(to right, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
    textColor: 'var(--color-white, #ffffff)'
  },
  violet: {
    background: 'linear-gradient(to right, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
    hoverBackground: 'linear-gradient(to right, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
    textColor: 'var(--color-white, #ffffff)'
  },
  amber: {
    background: 'linear-gradient(to right, var(--color-amber-400, #fbbf24), var(--color-orange-500, #f97316))',
    hoverBackground: 'linear-gradient(to right, var(--color-amber-500, #f59e0b), var(--color-orange-600, #ea580c))',
    textColor: 'var(--color-gray-900, #111827)'
  }
};

/**
 * Default section gradients based on current implementations
 */
const SECTION_DEFAULT_GRADIENTS: Record<SectionContext, Record<GlobalVariantKey, GradientConfig>> = {
  hero: {
    default: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    gym: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    sports: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    wellness: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    modern: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    classic: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    minimalist: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    boutique: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    registration: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    },
    mobile: {
      background: 'linear-gradient(to right, #a3e635, #34d399)',
      hoverBackground: 'linear-gradient(to right, #84cc16, #10b981)',
      textColor: '#111827'
    }
  },
  features: {
    default: {
      background: 'linear-gradient(90deg, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
      hoverBackground: 'linear-gradient(90deg, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    gym: {
      background: 'linear-gradient(90deg, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
      hoverBackground: 'linear-gradient(90deg, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
      textColor: 'var(--color-white, #ffffff)'
    },
    sports: {
      background: 'linear-gradient(90deg, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(90deg, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    wellness: {
      background: 'linear-gradient(90deg, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(90deg, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(90deg, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(90deg, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: {
      background: 'linear-gradient(90deg, var(--color-amber-400, #fbbf24), var(--color-amber-500, #f59e0b))',
      hoverBackground: 'linear-gradient(90deg, var(--color-amber-500, #f59e0b), var(--color-amber-600, #d97706))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    minimalist: {
      background: 'linear-gradient(90deg, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(90deg, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(90deg, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(90deg, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(90deg, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(90deg, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(90deg, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(90deg, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  },
  training: {
    default: {
      background: 'linear-gradient(135deg, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
      hoverBackground: 'linear-gradient(135deg, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    gym: {
      background: 'linear-gradient(135deg, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
      hoverBackground: 'linear-gradient(135deg, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
      textColor: 'var(--color-white, #ffffff)'
    },
    sports: {
      background: 'linear-gradient(135deg, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(135deg, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    wellness: {
      background: 'linear-gradient(135deg, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(135deg, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(135deg, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(135deg, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: {
      background: 'linear-gradient(135deg, var(--color-amber-400, #fbbf24), var(--color-amber-500, #f59e0b))',
      hoverBackground: 'linear-gradient(135deg, var(--color-amber-500, #f59e0b), var(--color-amber-600, #d97706))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    minimalist: {
      background: 'linear-gradient(135deg, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(135deg, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(135deg, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(135deg, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(135deg, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(135deg, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(135deg, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(135deg, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  },
  journey: {
    default: JOURNEY_GRADIENTS.lime,
    gym: JOURNEY_GRADIENTS.violet,
    sports: JOURNEY_GRADIENTS.cyan,
    wellness: {
      background: 'linear-gradient(to right, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(to right, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(to right, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(to right, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: JOURNEY_GRADIENTS.amber,
    minimalist: {
      background: 'linear-gradient(to right, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(to right, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(to right, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(to right, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(to right, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(to right, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(to right, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(to right, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  },
  'personal-training': {
    default: {
      background: 'linear-gradient(45deg, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
      hoverBackground: 'linear-gradient(45deg, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    gym: {
      background: 'linear-gradient(45deg, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
      hoverBackground: 'linear-gradient(45deg, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
      textColor: 'var(--color-white, #ffffff)'
    },
    sports: {
      background: 'linear-gradient(45deg, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(45deg, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    wellness: {
      background: 'linear-gradient(45deg, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(45deg, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(45deg, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(45deg, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: {
      background: 'linear-gradient(45deg, var(--color-amber-400, #fbbf24), var(--color-amber-500, #f59e0b))',
      hoverBackground: 'linear-gradient(45deg, var(--color-amber-500, #f59e0b), var(--color-amber-600, #d97706))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    minimalist: {
      background: 'linear-gradient(45deg, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(45deg, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(45deg, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(45deg, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(45deg, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(45deg, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(45deg, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(45deg, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  },
  'training-features': {
    default: {
      background: 'linear-gradient(120deg, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
      hoverBackground: 'linear-gradient(120deg, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    gym: {
      background: 'linear-gradient(120deg, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
      hoverBackground: 'linear-gradient(120deg, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
      textColor: 'var(--color-white, #ffffff)'
    },
    sports: {
      background: 'linear-gradient(120deg, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(120deg, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    wellness: {
      background: 'linear-gradient(120deg, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(120deg, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(120deg, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(120deg, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: {
      background: 'linear-gradient(120deg, var(--color-amber-400, #fbbf24), var(--color-amber-500, #f59e0b))',
      hoverBackground: 'linear-gradient(120deg, var(--color-amber-500, #f59e0b), var(--color-amber-600, #d97706))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    minimalist: {
      background: 'linear-gradient(120deg, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(120deg, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(120deg, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(120deg, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(120deg, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(120deg, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(120deg, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(120deg, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  },
  pricing: {
    default: {
      background: 'linear-gradient(180deg, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
      hoverBackground: 'linear-gradient(180deg, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    gym: {
      background: 'linear-gradient(180deg, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
      hoverBackground: 'linear-gradient(180deg, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
      textColor: 'var(--color-white, #ffffff)'
    },
    sports: {
      background: 'linear-gradient(180deg, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(180deg, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    wellness: {
      background: 'linear-gradient(180deg, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(180deg, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(180deg, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(180deg, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: {
      background: 'linear-gradient(180deg, var(--color-amber-400, #fbbf24), var(--color-amber-500, #f59e0b))',
      hoverBackground: 'linear-gradient(180deg, var(--color-amber-500, #f59e0b), var(--color-amber-600, #d97706))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    minimalist: {
      background: 'linear-gradient(180deg, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(180deg, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(180deg, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(180deg, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(180deg, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(180deg, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(180deg, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(180deg, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  },
  testimonials: {
    default: {
      background: 'linear-gradient(225deg, var(--color-lime-300, #a3e635), var(--color-emerald-400, #34d399))',
      hoverBackground: 'linear-gradient(225deg, var(--color-lime-400, #84cc16), var(--color-emerald-500, #10b981))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    gym: {
      background: 'linear-gradient(225deg, var(--color-violet-400, #a78bfa), var(--color-purple-500, #8b5cf6))',
      hoverBackground: 'linear-gradient(225deg, var(--color-violet-500, #8b5cf6), var(--color-purple-600, #7c3aed))',
      textColor: 'var(--color-white, #ffffff)'
    },
    sports: {
      background: 'linear-gradient(225deg, var(--color-cyan-400, #22d3ee), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(225deg, var(--color-cyan-500, #06b6d4), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    wellness: {
      background: 'linear-gradient(225deg, var(--color-teal-400, #2dd4bf), var(--color-teal-500, #14b8a6))',
      hoverBackground: 'linear-gradient(225deg, var(--color-teal-500, #14b8a6), var(--color-teal-600, #0d9488))',
      textColor: 'var(--color-white, #ffffff)'
    },
    modern: {
      background: 'linear-gradient(225deg, var(--color-slate-400, #94a3b8), var(--color-slate-500, #64748b))',
      hoverBackground: 'linear-gradient(225deg, var(--color-slate-500, #64748b), var(--color-slate-600, #475569))',
      textColor: 'var(--color-white, #ffffff)'
    },
    classic: {
      background: 'linear-gradient(225deg, var(--color-amber-400, #fbbf24), var(--color-amber-500, #f59e0b))',
      hoverBackground: 'linear-gradient(225deg, var(--color-amber-500, #f59e0b), var(--color-amber-600, #d97706))',
      textColor: 'var(--color-gray-900, #111827)'
    },
    minimalist: {
      background: 'linear-gradient(225deg, var(--color-gray-400, #9ca3af), var(--color-gray-500, #6b7280))',
      hoverBackground: 'linear-gradient(225deg, var(--color-gray-500, #6b7280), var(--color-gray-600, #4b5563))',
      textColor: 'var(--color-white, #ffffff)'
    },
    boutique: {
      background: 'linear-gradient(225deg, var(--color-pink-400, #f472b6), var(--color-rose-500, #f43f5e))',
      hoverBackground: 'linear-gradient(225deg, var(--color-pink-500, #ec4899), var(--color-rose-600, #e11d48))',
      textColor: 'var(--color-white, #ffffff)'
    },
    registration: {
      background: 'linear-gradient(225deg, var(--color-blue-400, #60a5fa), var(--color-blue-500, #3b82f6))',
      hoverBackground: 'linear-gradient(225deg, var(--color-blue-500, #3b82f6), var(--color-blue-600, #2563eb))',
      textColor: 'var(--color-white, #ffffff)'
    },
    mobile: {
      background: 'linear-gradient(225deg, var(--color-indigo-400, #818cf8), var(--color-indigo-500, #6366f1))',
      hoverBackground: 'linear-gradient(225deg, var(--color-indigo-500, #6366f1), var(--color-indigo-600, #4f46e5))',
      textColor: 'var(--color-white, #ffffff)'
    }
  }
};

/**
 * Get gradient configuration for a specific color
 */
export const getGradientForColor = (
  gradientColor: string,
  theme: GlobalVariantKey = 'default'
): GradientConfig => {
  // Check if it's a predefined Journey gradient color
  if (gradientColor in JOURNEY_GRADIENTS) {
    return JOURNEY_GRADIENTS[gradientColor as GradientColor];
  }
  
  // For custom colors, create a simple gradient
  return {
    background: `linear-gradient(to right, ${gradientColor}, ${gradientColor})`,
    hoverBackground: `linear-gradient(to right, ${gradientColor}, ${gradientColor})`,
    textColor: 'var(--color-white, #ffffff)'
  };
};

/**
 * Get default gradient for a section and theme
 */
export const getSectionDefaultGradient = (
  sectionContext: SectionContext,
  theme: GlobalVariantKey = 'default'
): GradientConfig => {
  return SECTION_DEFAULT_GRADIENTS[sectionContext]?.[theme] || 
         SECTION_DEFAULT_GRADIENTS[sectionContext]?.default ||
         JOURNEY_GRADIENTS.lime;
};

/**
 * Get gradient styles with priority system
 * Priority: gradientColors > gradientClass > gradientColor > section default
 */
export const getGradientStyles = (
  sectionContext: SectionContext,
  gradientColor?: string,
  gradientClass?: string,
  gradientColors?: string,
  theme: GlobalVariantKey = 'default'
): React.CSSProperties => {
  // Highest priority: custom gradient string
  if (gradientColors) {
    return { 
      background: gradientColors,
      color: 'var(--color-white, #ffffff)' // Default text color for custom gradients
    };
  }
  
  // Second priority: gradient class (handled via CSS, return empty styles)
  if (gradientClass) {
    return {};
  }
  
  // Third priority: predefined gradient color
  if (gradientColor) {
    const config = getGradientForColor(gradientColor, theme);
    return {
      background: config.background,
      color: config.textColor
    };
  }
  
  // Default: section default gradient
  const config = getSectionDefaultGradient(sectionContext, theme);
  return {
    background: config.background,
    color: config.textColor
  };
};

/**
 * Get hover gradient styles
 */
export const getHoverGradientStyles = (
  sectionContext: SectionContext,
  gradientColor?: string,
  gradientClass?: string,
  gradientColors?: string,
  theme: GlobalVariantKey = 'default'
): React.CSSProperties => {
  // For custom gradient strings, darken slightly
  if (gradientColors) {
    return { 
      background: gradientColors,
      filter: 'brightness(0.9)'
    };
  }
  
  // For gradient classes, let CSS handle it
  if (gradientClass) {
    return {};
  }
  
  // For predefined colors
  if (gradientColor) {
    const config = getGradientForColor(gradientColor, theme);
    return {
      background: config.hoverBackground || config.background
    };
  }
  
  // Default section hover
  const config = getSectionDefaultGradient(sectionContext, theme);
  return {
    background: config.hoverBackground || config.background
  };
};

/**
 * Check if a gradient should be applied for the given variant
 */
export const shouldApplyGradient = (
  variant: string,
  sectionContext: SectionContext
): boolean => {
  // Only apply gradients to primary variants by default
  if (variant !== 'primary') {
    return false;
  }
  
  // All sections support gradients on primary variant
  return true;
};

/**
 * Validate gradient color
 */
export const isValidGradientColor = (color: string): boolean => {
  // Check if it's a predefined color
  if (color in JOURNEY_GRADIENTS) {
    return true;
  }
  
  // Check if it's a valid CSS color (basic validation)
  const isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  const isRgb = /^rgb\(/.test(color);
  const isHsl = /^hsl\(/.test(color);
  const isNamed = /^[a-zA-Z]+$/.test(color);
  
  return isHex || isRgb || isHsl || isNamed;
}; 