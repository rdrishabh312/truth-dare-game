import React, { useState } from 'react';

const CustomQuestions = ({ onStartGame }) => {
    const [truths, setTruths] = useState([]);
    const [dares, setDares] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [activeTab, setActiveTab] = useState('truth'); // 'truth' or 'dare'
    const [mixWithDefault, setMixWithDefault] = useState(true);

    const addQuestion = () => {
        if (!currentInput.trim()) return;

        if (activeTab === 'truth') {
            setTruths([...truths, currentInput.trim()]);
        } else {
            setDares([...dares, currentInput.trim()]);
        }
        setCurrentInput('');
    };

    const removeQuestion = (type, index) => {
        if (type === 'truth') {
            setTruths(truths.filter((_, i) => i !== index));
        } else {
            setDares(dares.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="fade-in" style={{ width: '100%' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Custom Questions</h2>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px' }}>
                    <button
                        style={{
                            flex: 1, padding: '10px', borderRadius: '8px',
                            background: activeTab === 'truth' ? 'var(--color-primary)' : 'transparent',
                            color: 'white', fontWeight: 'bold'
                        }}
                        onClick={() => setActiveTab('truth')}
                    >
                        Truths ({truths.length})
                    </button>
                    <button
                        style={{
                            flex: 1, padding: '10px', borderRadius: '8px',
                            background: activeTab === 'dare' ? 'var(--color-secondary)' : 'transparent',
                            color: 'white', fontWeight: 'bold'
                        }}
                        onClick={() => setActiveTab('dare')}
                    >
                        Dares ({dares.length})
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder={`Add a ${activeTab}...`}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                    />
                    <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '0 20px', fontSize: '1.5rem' }}
                        onClick={addQuestion}
                    >
                        +
                    </button>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {(activeTab === 'truth' ? truths : dares).map((q, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px'
                        }}>
                            <span style={{ fontSize: '0.9rem' }}>{q}</span>
                            <button
                                onClick={() => removeQuestion(activeTab, i)}
                                style={{ background: 'none', color: '#ef4444' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    {(activeTab === 'truth' ? truths : dares).length === 0 && (
                        <p style={{ opacity: 0.5, textAlign: 'center', fontSize: '0.9rem' }}>No custom {activeTab}s added yet.</p>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="checkbox"
                    checked={mixWithDefault}
                    onChange={(e) => setMixWithDefault(e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                />
                <label>Mix with auto-generated questions</label>
            </div>

            <button
                className="btn-primary"
                onClick={() => onStartGame({ truths, dares, mixWithDefault })}
            >
                Start Game
            </button>
        </div>
    );
};

export default CustomQuestions;
