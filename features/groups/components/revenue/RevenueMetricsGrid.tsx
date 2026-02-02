
import React from 'react';

interface MetricItem {
    label: string;
    value: string;
}

interface RevenueMetricsGridProps {
    metrics: MetricItem[];
}

export const RevenueMetricsGrid: React.FC<RevenueMetricsGridProps> = ({ metrics }) => (
    <div className="grid grid-cols-3 gap-3 mb-10">
        {metrics.map((item, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-1 transition-all hover:bg-white/[0.05]">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                <span className="text-[12px] font-bold text-white/90">{item.value}</span>
            </div>
        ))}
    </div>
);
