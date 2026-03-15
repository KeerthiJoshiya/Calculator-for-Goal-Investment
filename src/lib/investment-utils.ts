/**
 * Official Financial Calculation Logic for FinCal Innovation Hackathon.
 */

/**
 * Step 1 – Inflate Goal Value
 * FV = Present Cost × (1 + Inflation Rate)^Years
 */
export const calculateFutureGoalCost = (pv: number, inflationRate: number, years: number, adjustForInflation: boolean) => {
  if (!adjustForInflation) return pv;
  return pv * Math.pow(1 + inflationRate, years);
};

/**
 * Step 2 – Calculate Required Monthly SIP
 * Required SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
 * Where r = Annual Return / 12 and n = Years * 12
 */
export const calculateMonthlySIP = (fv: number, annualReturn: number, years: number) => {
  const r = annualReturn / 12;
  const n = years * 12;
  
  if (r === 0) return fv / n;
  
  // Official Hackathon Formula
  const denominator = (Math.pow(1 + r, n) - 1) * (1 + r);
  return (fv * r) / denominator;
};

export const generateGrowthSimulation = (monthlySIP: number, annualReturn: number, years: number) => {
  const r = annualReturn / 12;
  const n = years * 12;
  let currentValue = 0;
  const data = [];

  for (let month = 0; month <= n; month++) {
    if (month % 12 === 0 || month === n) {
      data.push({
        year: month / 12,
        value: Math.round(currentValue),
        invested: Math.round(monthlySIP * month),
      });
    }
    // Growth simulation for Annuity Due (payment at start of month)
    currentValue = (currentValue + monthlySIP) * (1 + r);
  }

  return data;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value).replace('INR', '₹');
};