
import React from 'react';

interface VipInfoProps {
  groupName: string;
  onGroupNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const VipInfo: React.FC<VipInfoProps> = ({ groupName, onGroupNameChange, description, onDescriptionChange }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="groupName">Nome do Grupo</label>
        <input type="text" id="groupName" value={groupName} onChange={onGroupNameChange} placeholder="Ex: Comunidade Flux Pro" required />
      </div>
      
      <div className="form-group">
        <label htmlFor="groupDescription">Descrição</label>
        <textarea id="groupDescription" value={description} onChange={onDescriptionChange} placeholder="Sobre o que é este grupo?"></textarea>
      </div>
    </>
  );
};
