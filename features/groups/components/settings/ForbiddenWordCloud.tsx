import React, { useState } from 'react';

interface ForbiddenWordCloudProps {
  words: string[];
  onAdd: (word: string) => void;
  onRemove: (word: string) => void;
}

export const ForbiddenWordCloud: React.FC<ForbiddenWordCloudProps> = ({ words, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim().toLowerCase());
      setInput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input 
          className="input-field flex-1" 
          placeholder="Palavra ofensiva..." 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="bg-[#00c2ff] text-black px-4 rounded-xl font-bold">+</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map(w => (
          <span key={w} className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
            {w} <i className="fa-solid fa-xmark cursor-pointer" onClick={() => onRemove(w)}></i>
          </span>
        ))}
      </div>
    </div>
  );
};