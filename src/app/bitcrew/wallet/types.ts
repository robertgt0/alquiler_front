export interface IBilletera {
  _id: string;
  saldo: number;
  moneda: string;
  estado: string;
}

export interface ITransaccionBackend {
  _id: string;
  tipo: "credito" | "debito";
  monto: number;
  descripcion: string;
  fecha: string;
}

export interface IFrontendTransaction {
  id: string;
  type: "credito" | "debito";
  date: string;
  amount: number;
  descripcion: string;
  currency: string;
}

export interface BalanceCardProps {
  saldo: number | undefined;
  moneda: string;
  showSaldo: boolean;
  onToggleShowSaldo: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export interface TransactionListProps {
  transactions: IFrontendTransaction[];
}

export interface TransactionItemProps {
  transaction: IFrontendTransaction;
}

export interface TransactionItemProps {
  transaction: IFrontendTransaction;
}