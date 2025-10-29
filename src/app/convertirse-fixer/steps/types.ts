import type { CategoryDTO } from "@/lib/api/categories";
import type { PaymentState } from "@/types/payment";

export type StepIdentityProps = {
  fixerId: string | null;
  userId: string;
  initialCI: string;
  onComplete: (payload: { fixerId: string; ci: string }) => void;
};

export type StepLocationProps = {
  fixerId: string;
  initialLocation?: { lat: number; lng: number; address?: string } | null;
  onBack: () => void;
  onComplete: (location: { lat: number; lng: number; address?: string }) => void;
};

export type StepCategoriesProps = {
  fixerId: string;
  selected: CategoryDTO[];
  onBack: () => void;
  onComplete: (categories: CategoryDTO[]) => void;
};

export type StepPaymentProps = {
  fixerId: string;
  state: PaymentState;
  onBack: () => void;
  onComplete: (state: PaymentState) => void;
};

export type StepTermsProps = {
  fixerId: string;
  summary: {
    ci: string;
    categories: CategoryDTO[];
    payment: PaymentState;
  };
  onBack: () => void;
  onFinish: () => void;
};
