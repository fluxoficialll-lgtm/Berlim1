
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface StripeUpiViewProps {
    data: any;
    onBack: () => void;
}

export const StripeUpiView: React.FC<StripeUpiViewProps> = ({ data, onBack }) => {
    const [copied, setCopied] = useState(false);
    const vpa = data?.next_action?.upi_display_qr_code?.vpa || "fluxplatform@upi";

    const handleCopy = () => {
        navigator.clipboard.writeText(vpa);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in text-center py-2">
            <button onClick={onBack} className="flex items-center text-gray-600 text-[10px] font-black uppercase mb-6">
                <i className="fa-solid fa-arrow-left mr-2"></i> UPI Payment
            </button>

            <div className="bg-white p-3 rounded-2xl inline-block shadow-2xl mb-6">
                <QRCodeSVG value={`upi://pay?pa=${vpa}`} size={180} />
            </div>

            <div className="space-y-4">
                <div className="bg-black/40 border border-white/10 p-4 rounded-xl text-left">
                    <span className="text-[9px] text-gray-500 font-bold uppercase block mb-1">VPA / UPI ID</span>
                    <div className="text-sm font-black text-white">{vpa}</div>
                </div>

                <button 
                    onClick={handleCopy}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg active:scale-95 transition-all"
                >
                    {copied ? 'ID COPIED!' : 'COPY UPI ID'}
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] text-gray-600 font-bold uppercase animate-pulse">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Waiting for app confirmation
                </div>
            </div>
        </div>
    );
};
