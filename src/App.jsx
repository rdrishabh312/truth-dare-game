import React, { useState } from 'react';
import CategorySelection from './components/Setup/CategorySelection';
import PlayerInput from './components/Setup/PlayerInput';
import CustomQuestions from './components/Setup/CustomQuestions';
import GameBoard from './components/Game/GameBoard';

function App() {
  const [gameState, setGameState] = useState('CATEGORY'); // CATEGORY, PLAYERS, CUSTOM, PLAYING
  const [gameData, setGameData] = useState({
    category: '',
    players: [],
    customQuestions: { truths: [], dares: [] },
    mixWithDefault: true
  });

  const handleCategorySelect = (category) => {
    setGameData(prev => ({ ...prev, category }));
    setGameState('PLAYERS');
  };

  const handlePlayersNext = (players) => {
    setGameData(prev => ({ ...prev, players }));
    setGameState('CUSTOM');
  };

  const handleStartGame = ({ truths, dares, mixWithDefault }) => {
    setGameData(prev => ({
      ...prev,
      customQuestions: { truths, dares },
      mixWithDefault
    }));
    setGameState('PLAYING');
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit the game?')) {
      setGameState('CATEGORY');
      setGameData({
        category: '',
        players: [],
        customQuestions: { truths: [], dares: [] },
        mixWithDefault: true
      });
    }
  };

  return (
    <>
      {gameState === 'CATEGORY' && <CategorySelection onSelectCategory={handleCategorySelect} />}
      {gameState === 'PLAYERS' && <PlayerInput onNext={handlePlayersNext} />}
      {gameState === 'CUSTOM' && <CustomQuestions onStartGame={handleStartGame} />}
      {gameState === 'PLAYING' && <GameBoard gameData={gameData} onExit={handleExit} />}
    </>
  );
}

export default App;
