import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface StripePayNowViewProps {
    data: any;
    onBack: () => void;
}

export const StripePayNowView: React.FC<StripePayNowViewProps> = ({ data, onBack }) => {
    const [copied, setCopied] = useState(false);
    
    // PayNow QR Code data
    const paynowData = data?.next_action?.paynow_display_qr_code?.data || "MOCK_PAYNOW_SGD_DATA_2024";

    return (
        <div className="animate-fade-in text-center py-2">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors">
                    <i className="fa-solid fa-arrow-left mr-1"></i> Back
                </button>
                <div className="bg-[#635bff]/10 text-[#635bff] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-[#635bff]/20">
                    PayNow SG
                </div>
            </div>

            <div className="bg-white p-4 rounded-[32px] inline-block shadow-2xl mb-8 border-4 border-[#635bff1a]">
                <QRCodeSVG value={paynowData} size={220} />
            </div>

            <div className="space-y-6">
                <div className="px-6">
                    <h3 className="text-white font-black text-lg mb-1">Scan to Pay</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Open your banking app, select PayNow, and scan this QR to complete your SGD payment.
                    </p>
                </div>

                <div className="bg-[#1a1e26] p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-3 animate-pulse">
                    <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-sm"></i>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waiting for bank confirm</span>
                </div>
            </div>
            
            <div className="mt-8 opacity-20 grayscale flex justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/PayNow_logo.png/1200px-PayNow_logo.png" className="h-4" alt="PayNow" />
            </div>
        </div>
    );
};