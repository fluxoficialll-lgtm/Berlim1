interface Transaction {
  amount: number;
  timestamp: number;
  status: string;
}

export const RevenueCalculator = {
  calculateStats: (transactions: Transaction[]) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const paid = transactions.filter(t => t.status === 'paid');

    return {
      total: paid.reduce((acc, t) => acc + t.amount, 0),
      today: paid.filter(t => t.timestamp > now - oneDay).reduce((acc, t) => acc + t.amount, 0),
      count: paid.length,
      avgTicket: paid.length > 0 ? paid.reduce((acc, t) => acc + t.amount, 0) / paid.length : 0
    };
  }
};