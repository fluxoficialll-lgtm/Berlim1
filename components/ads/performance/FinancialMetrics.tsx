
import React from 'react';
import { MetricCard } from './MetricCard';

interface FinancialMetricsProps {
    data: any;
}

export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ data }) => {
    const formatCurrency = (val: number) => {
        return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            <MetricCard 
                label="Valor Investido" 
                value={formatCurrency(data.totalBudget || 0)} 
                icon="fa-solid fa-wallet"
                description="Orçamento total alocado para esta campanha."
            />
            <MetricCard 
                label="Valor Usado" 
                value={formatCurrency(data.spent || 0)} 
                icon="fa-solid fa-chart-pie"
                trend={{ 
                    val: `${((data.spent / data.totalBudget) * 100).toFixed(1)}%`, 
                    isUp: true 
                }}
                description="Total consumido do orçamento até o momento."
            />
            <MetricCard 
                label="ROAS" 
                value={`${data.roas.toFixed(1)}x`} 
                icon="fa-solid fa-chart-line"
                description="Retorno sobre investimento direto."
            />
            <MetricCard 
                label="ROI" 
                value={`${data.roi.toFixed(0)}%`} 
                icon="fa-solid fa-sack-dollar"
                description="Lucro líquido sobre o gasto."
            />
            <MetricCard 
                label="Ticket Médio" 
                value={`R$ ${data.avgTicket.toFixed(2)}`} 
                icon="fa-solid fa-receipt"
            />
            <MetricCard 
                label="LTV Est." 
                value={`R$ ${data.ltv.toFixed(2)}`} 
                icon="fa-solid fa-infinity"
                description="Valor estimado do cliente a longo prazo."
            />
        </div>
    );
};
