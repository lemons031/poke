import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const App = () => {
  const [cardInfo, setCardInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleCardInfo = (info) => {
    setCardInfo(info);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div>
      <h1>Pokémon Card Identifier</h1>
      <ImageUpload onCardInfo={handleCardInfo} onError={handleError} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cardInfo && <p>Card Info: {cardInfo}</p>}
    </div>
  );
};

export default App;
