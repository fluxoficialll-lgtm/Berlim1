
import React from 'react';

interface StripeKonbiniViewProps {
    data: any;
    onBack: () => void;
}

export const StripeKonbiniView: React.FC<StripeKonbiniViewProps> = ({ data, onBack }) => {
    return (
        <div className="animate-fade-in text-center py-2">
            <button onClick={onBack} className="flex items-center text-gray-600 text-[10px] font-black uppercase mb-6">
                <i className="fa-solid fa-arrow-left mr-2"></i> Konbini Pay
            </button>

            <div className="bg-white rounded-[32px] p-8 mb-6 shadow-2xl">
                <div className="flex justify-center gap-4 mb-8 opacity-60 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/1200px-7-eleven_logo.svg.png" className="h-6" alt="7-11" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Lawson_logo.svg/1200px-Lawson_logo.svg.png" className="h-6" alt="Lawson" />
                </div>

                <div className="space-y-4">
                    <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Confirmation Number</span>
                        <div className="text-2xl font-black text-black tracking-widest">
                            {data?.next_action?.konbini_display_details?.confirmation_number || "000-0000"}
                        </div>
                    </div>
                    
                    <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Payment Code</span>
                        <div className="text-2xl font-black text-black tracking-widest">
                            {data?.next_action?.konbini_display_details?.payment_code || "1234567890"}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-clock text-gray-400 text-xs"></i>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Expires in 12 hours</span>
                </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed px-4">
                Please visit any major convenience store in Japan and provide these codes at the terminal.
            </p>
        </div>
    );
};
