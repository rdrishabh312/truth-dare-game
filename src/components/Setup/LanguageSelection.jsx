import React from 'react';

const LanguageSelection = ({ onSelectLanguage }) => {
    return (
        <div className="fade-in" style={{ width: '100%', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Truth or Dare</h1>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Select Language</h2>

                <button
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
                    onClick={() => onSelectLanguage('English')}
                >
                    🌍 English
                </button>

                <button
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
                    onClick={() => onSelectLanguage('Hinglish')}
                >
                    🇮🇳 Hinglish
                </button>
            </div>
        </div>
    );
};

export default LanguageSelection;
