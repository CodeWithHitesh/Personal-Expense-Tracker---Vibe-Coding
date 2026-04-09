export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Bills' 
  | 'Shopping' 
  | 'Health'
  | 'Salary'
  | 'Gift'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface GameState {
  isInitialized: boolean;
  maxHp: number; // Monthly Budget
  currentHp: number; // Current Balance
  level: number;
  xp: number;
  currency: string;
}
