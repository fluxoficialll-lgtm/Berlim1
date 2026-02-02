import React from 'react';
import { Comment } from '../../../../types';
import { postService } from '../../../../services/postService';

interface ProductQuestionsProps {
    questions: Comment[];
    newQuestion: string;
    onNewQuestionChange: (val: string) => void;
    onSendQuestion: () => void;
    onDeleteQuestion: (id: string) => void;
    isSeller: boolean;
    currentUserHandle: string;
}

export const ProductQuestions: React.FC<ProductQuestionsProps> = ({
    questions, newQuestion, onNewQuestionChange, onSendQuestion, onDeleteQuestion, isSeller, currentUserHandle
}) => {
    return (
        <div className="qa-section">
            <h3 className="section-header"><i className="fa-regular fa-comments text-[#00c2ff]"></i> Perguntas ({questions.length})</h3>
            
            {!isSeller && (
                <div className="qa-input-box">
                    <input 
                        type="text" 
                        className="qa-input" 
                        placeholder="Escreva sua dúvida..." 
                        value={newQuestion}
                        onChange={(e) => onNewQuestionChange(e.target.value)}
                    />
                    <button className="qa-send-btn" onClick={onSendQuestion}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            )}

            <div className="questions-list">
                {questions.length > 0 ? (
                    questions.map((q, idx) => (
                        <div key={idx} className="question-item">
                            <div className="q-header">
                                {q.avatar ? (
                                    <img src={q.avatar} className="q-avatar" alt="User" />
                                ) : (
                                    <div className="q-avatar flex items-center justify-center bg-gray-700 text-[10px]"><i className="fa-solid fa-user"></i></div>
                                )}
                                <span className="q-user">{q.username}</span>
                                <span className="q-time">{postService.formatRelativeTime(q.timestamp)}</span>
                            </div>
                            <div className="q-text">
                                {q.text}
                                {q.username === currentUserHandle && (
                                    <button 
                                        className="q-delete-btn bg-transparent border-none"
                                        onClick={() => onDeleteQuestion(q.id)}
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm italic py-2">
                        Nenhuma pergunta feita ainda.
                    </div>
                )}
            </div>
        </div>
    );
};