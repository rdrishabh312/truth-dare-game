import React, { useState } from 'react';

const CategorySelection = ({ onSelectCategory }) => {
  const [showAdultWarning, setShowAdultWarning] = useState(false);

  const handleSelect = (category) => {
    if (category === 'Adult') {
      setShowAdultWarning(true);
    } else {
      onSelectCategory(category);
    }
  };

  const confirmAdult = () => {
    setShowAdultWarning(false);
    onSelectCategory('Adult');
  };

  return (
    <div className="fade-in" style={{ width: '100%', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Truth or Dare</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Select Mode</h2>
        
        <button 
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}
          onClick={() => handleSelect('Kids')}
        >
          Kids
        </button>
        
        <button 
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
          onClick={() => handleSelect('Teen')}
        >
          Teen
        </button>
        
        <button 
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
          onClick={() => handleSelect('Adult')}
        >
          Adult 18+
        </button>
      </div>

      {showAdultWarning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="card" style={{ maxWidth: '300px', background: '#1e293b' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ 18+ Content</h3>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Adult mode contains content not suitable for minors. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-primary" 
                style={{ background: '#334155', fontSize: '1rem' }}
                onClick={() => setShowAdultWarning(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ background: '#ef4444', fontSize: '1rem' }}
                onClick={confirmAdult}
              >
                I'm 18+
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelection;
