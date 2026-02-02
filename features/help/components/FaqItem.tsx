
import React from 'react';

interface FaqItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className="faq-item">
            <div 
                className={`faq-question ${isOpen ? 'active' : ''}`} 
                onClick={onToggle}
            >
                {question}
                <i className="fa-solid fa-chevron-down"></i>
            </div>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                {answer}
            </div>
        </div>
    );
};
