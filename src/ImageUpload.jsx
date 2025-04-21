import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onCardInfo, onError }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Please upload an image.');
      return;
    }

    setLoading(true);
    onError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData);
      const cardInfo = response.data.cardInfo;
      onCardInfo(cardInfo);
    } catch (error) {
      onError('Error processing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUpload;
