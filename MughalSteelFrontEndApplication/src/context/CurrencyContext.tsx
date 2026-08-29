import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP' | 'SAR' | 'EUR' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstPkr: number; // multiplier to convert PKR -> Currency
  country: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee', flag: '🇵🇰', rateAgainstPkr: 1, country: 'Pakistan' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateAgainstPkr: 0.0036, country: 'United States' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateAgainstPkr: 0.0132, country: 'United Arab Emirates' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateAgainstPkr: 0.0028, country: 'United Kingdom' },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', rateAgainstPkr: 0.0135, country: 'Saudi Arabia' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateAgainstPkr: 0.0033, country: 'European Union' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', rateAgainstPkr: 0.0049, country: 'Canada' },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺', rateAgainstPkr: 0.0055, country: 'Australia' }
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  formatPrice: (amountInPkr: number, showDual?: boolean) => string;
  convertPrice: (amountInPkr: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('mughal_currency');
    return (saved && CURRENCIES[saved as CurrencyCode]) ? (saved as CurrencyCode) : 'PKR';
  });

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem('mughal_currency', curr);
  };

  const currencyConfig = CURRENCIES[currency] || CURRENCIES.PKR;

  const convertPrice = (amountInPkr: number): number => {
    if (currency === 'PKR') return amountInPkr;
    const converted = amountInPkr * currencyConfig.rateAgainstPkr;
    return Math.round(converted);
  };

  const formatPrice = (amountInPkr: number, showDual = false): string => {
    if (currency === 'PKR') {
      return `Rs. ${Math.round(amountInPkr).toLocaleString()}`;
    }
    const converted = convertPrice(amountInPkr);
    const foreignStr = `${currencyConfig.symbol} ${converted.toLocaleString()} ${currencyConfig.code}`;
    if (showDual) {
      return `${foreignStr} (approx Rs. ${Math.round(amountInPkr).toLocaleString()})`;
    }
    return foreignStr;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyConfig, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
