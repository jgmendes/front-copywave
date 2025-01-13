export interface PaymentConfigInterface {
  plan: string;
  month: boolean;
}

export interface PaymentPayloadInterface {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  description: string;
  payer: PayerInterface;
}

export interface PayerInterface {
  email: string;
  identification: IdentificationInterface;
}

export interface IdentificationInterface {
  type: string;
  number: string;
}
