import type { CategoryDTO } from "@/lib/api/categories";
import type { PaymentState } from "@/types/payment";

export type SelectedCategory = CategoryDTO & {
  customDescription?: string;
};

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
  selected: SelectedCategory[];
  onBack: () => void;
  onComplete: (categories: SelectedCategory[]) => void;
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
    categories: SelectedCategory[];
    payment: PaymentState;
  };
  onBack: () => void;
  onFinish: () => void;
};
