import React, { useState, useEffect } from 'react';

const QuestionCard = ({ type, question, onDone, onForfeit }) => {
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    return (
        <div className="fade-in" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '20px'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '400px', textAlign: 'center',
                border: `2px solid ${type === 'TRUTH' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                boxShadow: `0 0 30px ${type === 'TRUTH' ? 'rgba(236, 72, 153, 0.5)' : 'rgba(139, 92, 246, 0.5)'}`
            }}>
                <h2 style={{
                    color: type === 'TRUTH' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    fontSize: '3rem', marginBottom: '1rem', textTransform: 'uppercase'
                }}>
                    {type}
                </h2>

                <p style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', lineHeight: '1.4' }}>
                    {question}
                </p>

                <div style={{
                    fontSize: '2rem', fontWeight: '800', marginBottom: '2rem',
                    color: timeLeft < 10 ? '#ef4444' : 'white'
                }}>
                    {timeLeft}s
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-primary"
                        style={{ background: '#10b981' }}
                        onClick={onDone}
                    >
                        Done
                    </button>
                    <button
                        className="btn-primary"
                        style={{ background: '#ef4444' }}
                        onClick={onForfeit}
                    >
                        Forfeit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
