export type PaymentMethodKey = "card" | "qr" | "cash";

export type PaymentSelection = PaymentMethodKey[];

export type PaymentAccount = {
  holder: string;        // nombre del titular
  accountNumber: string; // solo números
};

export type PaymentState = {
  methods: PaymentSelection;
  card?: PaymentAccount | null;
  qr?: PaymentAccount | null;
};
