import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import QuestionCard from './QuestionCard';
import { QUESTIONS } from '../../questions';
import bottleDefault from '../../assets/bottle.png';
import bottleText1 from '../../assets/bottle_text1.png';
import bottleText2 from '../../assets/bottle_text2.png';

const BOTTLES = [
    { id: 'default', src: bottleDefault, name: '🎯' },
    { id: 'text1', src: bottleText1, name: '📝' },
    { id: 'text2', src: bottleText2, name: '🎨' },
];

// Vibrant colors for player sections
const PLAYER_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#F38181', // Pink
    '#AA96DA', // Purple
    '#FCBAD3', // Light Pink
    '#A8E6CF', // Light Green
    '#FFD3B6', // Peach
    '#FFAAA5', // Salmon
];

// Fisher-Yates shuffle algorithm for randomizing arrays
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const GameBoard = ({ gameData, onExit }) => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
    const [showChoice, setShowChoice] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentBottleIndex, setCurrentBottleIndex] = useState(0);
    const [selectionHistory, setSelectionHistory] = useState([]); // Track last 2 selections

    // Question pool management - shuffled arrays and current indices
    const [shuffledTruths, setShuffledTruths] = useState([]);
    const [shuffledDares, setShuffledDares] = useState([]);
    const [truthIndex, setTruthIndex] = useState(0);
    const [dareIndex, setDareIndex] = useState(0);

    // Initialize shuffled question pools on component mount
    useEffect(() => {
        const initializeQuestions = () => {
            let truthPool = [];
            let darePool = [];

            // Add default questions if mixWithDefault is enabled
            if (gameData.mixWithDefault) {
                const category = gameData.category || 'Teen';
                truthPool = [...QUESTIONS[category].truth];
                darePool = [...QUESTIONS[category].dare];
            }

            // Add custom questions
            truthPool = [...truthPool, ...gameData.customQuestions.truths];
            darePool = [...darePool, ...gameData.customQuestions.dares];

            // Ensure we have at least one question in each pool
            if (truthPool.length === 0) {
                truthPool = ["No truth questions available! Add some custom ones."];
            }
            if (darePool.length === 0) {
                darePool = ["No dare questions available! Add some custom ones."];
            }

            // Shuffle both pools
            setShuffledTruths(shuffleArray(truthPool));
            setShuffledDares(shuffleArray(darePool));
            setTruthIndex(0);
            setDareIndex(0);
        };

        initializeQuestions();
    }, [gameData]);


    // Calculate which player the bottle points to based on rotation
    const getPlayerFromRotation = (degrees) => {
        const normalizedDegrees = degrees % 360;
        const playerCount = gameData.players.length;
        const degreesPerPlayer = 360 / playerCount;

        // Bottle cap points up at 0 degrees (12 o'clock)
        // SVG slices are drawn starting from -90 degrees (which is also 12 o'clock in SVG)
        // Slice 0: from -90 to 0 degrees (top-right quadrant)
        // Slice 1: from 0 to 90 degrees (bottom-right quadrant)
        // When bottle is at 0°, it points into slice 0
        // When bottle is at 90°, it points into slice 1
        // Direct calculation works because both systems align at the top

        let playerIndex = Math.floor(normalizedDegrees / degreesPerPlayer);

        // Ensure we wrap around correctly
        playerIndex = playerIndex % playerCount;

        return playerIndex;
    };

    const spinBottle = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setSelectedPlayer(null);
        setSelectedPlayerIndex(null);
        setShowChoice(false);
        setCurrentQuestion(null);

        // 5-10 full rotations (1800-3600 deg) + random offset
        const spins = 1800 + Math.random() * 1800;
        let newRotation = rotation + spins;
        setRotation(newRotation);
        // Duration matches CSS transition (5s)
        setTimeout(() => {
            setIsSpinning(false);
            let playerIndex = getPlayerFromRotation(newRotation);

            // Fairness check: prevent same player more than twice consecutively
            // Only apply if we have at least 3 players and there's selection history
            const playerCount = gameData.players.length;
            if (playerCount >= 3 && selectionHistory.length >= 2) {
                // Check if the last 2 selections were the same player
                const lastTwo = selectionHistory.slice(-2);
                if (lastTwo[0] === lastTwo[1] && lastTwo[1] === playerIndex) {
                    // Same player selected 3 times in a row - reselect a different player
                    const degreesPerPlayer = 360 / playerCount;

                    // Find a different player
                    let attempts = 0;
                    let alternativeIndex;
                    do {
                        // Add random offset to select a different player
                        const randomOffset = (Math.floor(Math.random() * (playerCount - 1)) + 1) * degreesPerPlayer;
                        const adjustedRotation = newRotation + randomOffset;
                        alternativeIndex = getPlayerFromRotation(adjustedRotation);
                        attempts++;
                    } while (alternativeIndex === playerIndex && attempts < 10);

                    // Update to the alternative player
                    if (alternativeIndex !== playerIndex) {
                        playerIndex = alternativeIndex;
                        // Adjust rotation to match the new player
                        const degreesPerPlayer = 360 / playerCount;
                        const targetDegree = playerIndex * degreesPerPlayer + (degreesPerPlayer / 2);
                        const currentNormalized = newRotation % 360;
                        const diff = targetDegree - currentNormalized;
                        newRotation = newRotation + diff;
                        setRotation(newRotation);
                    }
                }
            }

            // Update selection history (keep only last 2)
            setSelectionHistory(prev => [...prev.slice(-1), playerIndex]);

            setSelectedPlayerIndex(playerIndex);
            setSelectedPlayer(gameData.players[playerIndex]);
            setShowChoice(true);
        }, 5000);
    };

    const nextBottle = () => {
        setCurrentBottleIndex((prev) => (prev + 1) % BOTTLES.length);
    };

    const handleChoice = (type) => {
        setShowChoice(false);

        let selectedType = type;
        if (type === 'RANDOM') {
            selectedType = Math.random() > 0.5 ? 'TRUTH' : 'DARE';
        }

        let question;
        if (selectedType === 'TRUTH') {
            // Get next truth question from shuffled pool
            if (truthIndex >= shuffledTruths.length) {
                // Reshuffle if we've exhausted all questions
                const newShuffled = shuffleArray(shuffledTruths);
                setShuffledTruths(newShuffled);
                setTruthIndex(0);
                question = newShuffled[0];
            } else {
                question = shuffledTruths[truthIndex];
            }
            setTruthIndex(prev => prev + 1);
        } else {
            // Get next dare question from shuffled pool
            if (dareIndex >= shuffledDares.length) {
                // Reshuffle if we've exhausted all questions
                const newShuffled = shuffleArray(shuffledDares);
                setShuffledDares(newShuffled);
                setDareIndex(0);
                question = newShuffled[0];
            } else {
                question = shuffledDares[dareIndex];
            }
            setDareIndex(prev => prev + 1);
        }

        setCurrentQuestion({ type: selectedType, text: question });
    };

    const handleDone = () => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setCurrentQuestion(null);
        setSelectedPlayer(null);
        setSelectedPlayerIndex(null);
    };

    const handleForfeit = () => {
        setCurrentQuestion(null);
        setSelectedPlayer(null);
        setSelectedPlayerIndex(null);
    };

    // Generate pie slices for each player
    const renderPlayerSlices = () => {
        const playerCount = gameData.players.length;
        const degreesPerPlayer = 360 / playerCount;

        return gameData.players.map((player, index) => {
            const startAngle = index * degreesPerPlayer - 90; // -90 to start from top
            const endAngle = (index + 1) * degreesPerPlayer - 90;

            // Create SVG path for pie slice
            const radius = 50; // percentage
            const centerX = 50;
            const centerY = 50;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const largeArc = degreesPerPlayer > 180 ? 1 : 0;

            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
            const isSelected = selectedPlayerIndex === index;

            return (
                <g key={index}>
                    <path
                        d={pathData}
                        fill={color}
                        opacity={isSelected ? 1 : 0.7}
                        stroke="white"
                        strokeWidth="0.5"
                        style={{
                            transition: 'opacity 0.3s, filter 0.3s',
                            filter: isSelected ? 'brightness(1.2)' : 'brightness(1)'
                        }}
                    />
                    {/* Player name on slice */}
                    <text
                        x={centerX + (radius * 0.65) * Math.cos((startRad + endRad) / 2)}
                        y={centerY + (radius * 0.65) * Math.sin((startRad + endRad) / 2)}
                        fill="white"
                        fontSize="4"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                            pointerEvents: 'none',
                            textTransform: 'uppercase',
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                        }}
                    >
                        {player}
                    </text>
                </g>
            );
        });
    };

    return (
        <div className="fade-in" style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            overflow: 'hidden'
        }}>
            {/* Minimal Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', zIndex: 10 }}>
                <button onClick={onExit} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                    ← Exit
                </button>
                <h2 style={{ fontSize: '1.3rem', color: 'white', fontWeight: '600', letterSpacing: '0.5px' }}>Truth or Dare</h2>
                <div style={{ width: '80px' }}></div>
            </div>

            {/* Game Board with Colored Sections */}
            <div style={{
                position: 'relative',
                width: 'min(85vw, 360px)',
                height: 'min(85vw, 360px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px 0'
            }}>
                {/* SVG Circle with Colored Pie Slices */}
                <svg
                    viewBox="0 0 100 100"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: 'rotate(0deg)',
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                    }}
                >
                    {renderPlayerSlices()}
                </svg>

                {/* Center Circle */}
                <div style={{
                    position: 'absolute',
                    width: '25%',
                    height: '25%',
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    zIndex: 3
                }}></div>

                {/* Bottle */}
                <img
                    src={BOTTLES[currentBottleIndex].src}
                    alt="Bottle"
                    style={{
                        width: '50%',
                        height: 'auto',
                        transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        transform: `rotate(${rotation}deg)`,
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))',
                        opacity: 1, // Fully transparent background
                        zIndex: 5,
                        position: 'relative'
                    }}
                />
            </div>

            {/* Minimal Controls */}
            <div style={{ height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '15px', zIndex: 10 }}>
                {!isSpinning && !selectedPlayer && (
                    <>
                        <button
                            className="btn-primary"
                            onClick={spinBottle}
                            style={{
                                borderRadius: '50%',
                                padding: '0',
                                height: '70px',
                                width: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                color: '#667eea',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                fontSize: '0.9rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            SPIN
                        </button>

                        {/* Bottle Selector */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {BOTTLES.map((bottle, idx) => (
                                <button
                                    key={bottle.id}
                                    onClick={() => setCurrentBottleIndex(idx)}
                                    style={{
                                        background: currentBottleIndex === idx ? 'white' : 'rgba(255,255,255,0.2)',
                                        color: currentBottleIndex === idx ? '#667eea' : 'white',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {bottle.name}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {isSpinning && (
                    <p style={{ fontSize: '1.3rem', fontWeight: '600', color: 'white', letterSpacing: '3px', animation: 'pulse 1s infinite' }}>
                        SPINNING...
                    </p>
                )}
            </div>

            {/* Choice Modal - Minimal Design */}
            {showChoice && (
                <div className="fade-in" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100, padding: '20px', backdropFilter: 'blur(15px)'
                }}>
                    <button
                        onClick={() => {
                            setShowChoice(false);
                            setSelectedPlayer(null);
                            setSelectedPlayerIndex(null);
                        }}
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', color: 'white', padding: '10px', fontSize: '1.5rem', border: 'none', cursor: 'pointer' }}
                    >
                        ✕
                    </button>

                    <div style={{
                        background: PLAYER_COLORS[selectedPlayerIndex % PLAYER_COLORS.length],
                        borderRadius: '20px',
                        padding: '25px 40px',
                        marginBottom: '2rem',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                    }}>
                        <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0, textAlign: 'center', textTransform: 'uppercase' }}>
                            {selectedPlayer}
                        </p>
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '2.5rem', letterSpacing: '1px' }}>
                        Choose wisely...
                    </p>

                    <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            onClick={() => handleChoice('TRUTH')}
                            style={{
                                background: 'white', color: '#667eea', padding: '18px', borderRadius: '15px',
                                fontSize: '1.3rem', fontWeight: '700', border: 'none', cursor: 'pointer',
                                boxShadow: '0 5px 15px rgba(255,255,255,0.2)', transition: 'transform 0.2s'
                            }}
                        >
                            💬 TRUTH
                        </button>

                        <button
                            onClick={() => handleChoice('DARE')}
                            style={{
                                background: '#667eea', color: 'white', padding: '18px', borderRadius: '15px',
                                fontSize: '1.3rem', fontWeight: '700', border: 'none', cursor: 'pointer',
                                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)', transition: 'transform 0.2s'
                            }}
                        >
                            🔥 DARE
                        </button>

                        <button
                            onClick={() => handleChoice('RANDOM')}
                            style={{
                                background: 'transparent', color: 'white', padding: '12px',
                                fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', cursor: 'pointer'
                            }}
                        >
                            🎲 SURPRISE ME
                        </button>
                    </div>
                </div>
            )}

            {currentQuestion && (
                <QuestionCard
                    type={currentQuestion.type}
                    question={currentQuestion.text}
                    onDone={handleDone}
                    onForfeit={handleForfeit}
                />
            )}

            {/* Copyright Footer */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                width: '100%',
                textAlign: 'center',
                padding: '8px',
                zIndex: 1
            }}>
                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                    margin: 0,
                    letterSpacing: '0.5px'
                }}>
                    Created by <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>rdrishabh312</span>
                </p>
            </div>
        </div>
    );
};

export default GameBoard;
