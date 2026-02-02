
import React from 'react';

interface FolderNamesEditorProps {
    count: number;
    names: string[];
    onNamesChange: (newNames: string[]) => void;
}

export const FolderNamesEditor: React.FC<FolderNamesEditorProps> = ({ count, names, onNamesChange }) => {
    if (count <= 0) return null;

    const handleNameChange = (index: number, val: string) => {
        const newNames = [...names];
        // Garantir que o array tenha o tamanho correto
        while (newNames.length < count) {
            newNames.push(`Coleção 0${newNames.length + 1}`);
        }
        newNames[index] = val;
        onNamesChange(newNames);
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] ml-1">Personalizar Nomes das Pastas</h4>
            <div className="grid gap-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                        <div className="text-[10px] font-black text-[#00c2ff] bg-[#00c2ff1a] w-8 h-8 rounded-lg flex items-center justify-center">
                            {String(i + 1).padStart(2, '0')}
                        </div>
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none text-sm text-white font-bold outline-none placeholder-gray-600"
                            placeholder={`Nome da Pasta ${i + 1}`}
                            value={names[i] || `Coleção 0${i + 1}`}
                            onChange={(e) => handleNameChange(i, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
