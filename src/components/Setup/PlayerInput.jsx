import React, { useState } from 'react';

const PlayerInput = ({ onNext }) => {
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const addPlayer = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Name cannot be empty');
            return;
        }

        // Check for duplicate names (case insensitive)
        if (players.some(p => p.toLowerCase() === trimmedName.toLowerCase())) {
            setError('This name is already added!');
            return;
        }

        if (players.length < 10) {
            setPlayers([...players, trimmedName]);
            setName('');
            setError('');
        }
    };

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        if (players.length >= 2) {
            onNext(players);
        }
    };

    return (
        <div className="fade-in" style={{ width: '100%' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Players</h2>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Player Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError(''); // Clear error when user types
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                    />
                    <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '0 20px', fontSize: '1.5rem' }}
                        onClick={addPlayer}
                    >
                        +
                    </button>
                </div>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '6px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {players.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center' }}>Add at least 2 players</p>}
                    {players.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px'
                        }}>
                            <span>{p}</span>
                            <button
                                onClick={() => removePlayer(i)}
                                style={{ background: 'none', color: '#ef4444', fontSize: '1.2rem' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="btn-primary"
                onClick={handleNext}
                disabled={players.length < 2}
                style={{ opacity: players.length < 2 ? 0.5 : 1 }}
            >
                Next
            </button>
        </div>
    );
};

export default PlayerInput;
