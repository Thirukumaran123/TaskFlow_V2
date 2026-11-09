import React from 'react';
import { Check, Moon, Sun, Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeSelector() {
  const {
    theme,
    accent,
    setTheme,
    setAccent,
    resetAccent,
    toggleDarkLight,
    isDarkMode,
    availableThemes,
    accentPresets
  } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Built-in Themes Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Built-in Themes
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Select from 8 carefully curated high-contrast color palettes
            </p>
          </div>

          <button
            onClick={toggleDarkLight}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {isDarkMode ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} />}
            <span>{isDarkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {availableThemes.map(t => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Palette preview orb */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: t.bgPreview,
                    border: '2px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: t.preview
                    }}
                  />
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check size={10} color="#ffffff" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)'
                  }}
                >
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Accent Color Picker */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Custom Accent Color
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Choose a signature highlight color for buttons, badges, and focus rings
            </p>
          </div>

          {accent && (
            <button
              onClick={resetAccent}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
            >
              <RotateCcw size={12} />
              Reset to Theme Default
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
          {accentPresets.map(colorHex => {
            const isSelected = accent === colorHex;
            return (
              <button
                key={colorHex}
                onClick={() => setAccent(colorHex)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: colorHex,
                  border: isSelected ? '3px solid var(--text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease'
                }}
                title={colorHex}
              >
                {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </button>
            );
          })}

          {/* HTML5 Native Color Picker */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}
          >
            <Palette size={15} />
            <span>Custom:</span>
            <input
              type="color"
              value={accent || '#2563eb'}
              onChange={(e) => setAccent(e.target.value)}
              style={{
                width: '24px',
                height: '24px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
