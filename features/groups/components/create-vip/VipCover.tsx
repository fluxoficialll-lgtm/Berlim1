
import React from 'react';

interface VipCoverProps {
  coverImage: string | undefined;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VipCover: React.FC<VipCoverProps> = ({ coverImage, onCoverChange }) => {
  return (
    <div className="cover-upload-container">
      <label htmlFor="coverImageInput" className="cover-preview">
        {coverImage ? <img src={coverImage} alt="Cover" /> : <i className="fa-solid fa-crown cover-icon"></i>}
      </label>
      <label htmlFor="coverImageInput" className="cover-label">Capa Principal</label>
      <input type="file" id="coverImageInput" accept="image/*" style={{display: 'none'}} onChange={onCoverChange} />
    </div>
  );
};
