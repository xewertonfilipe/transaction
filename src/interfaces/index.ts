export interface IBalance {
  balanceValue: number;
}

export interface Transaction {
  id: string;
  value: number;
  type: string;
  date: Date;
}

export interface TransactionFormProps {
  transactionType: string;
  transactionValue: string;
}

export interface ITransactionForm {
  onFormSubmit: (transactionType: string, transactionValue: string) => void;
}

export interface DbTransaction {
  id: number;
  value: number;
  type: string;
  createdAt: string;
  date?: string;
}
