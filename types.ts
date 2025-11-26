
export enum PlanSection {
  ACTUAL_PLAN = 'Actual Plan',
  FALLBACK_PLAN = 'FallBack Plan',
  ADD_ONS = 'Add-ons',
  SUBSCRIPTIONS = 'Subscriptions',
  BUY_OR_UPGRADE = 'Buy Or Upgrade'
}

export enum BillingInterval {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
  CUSTOM = 'Custom'
}

export enum PlanGroup {
  STARTER = 'Starter',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise',
  CUSTOM = 'Custom'
}

export interface PlanFeature {
  name: string;
  limit: string;
  used?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: string;
  quantity: number;
  unit: string;
  description: string;
}

export interface SubscriptionHistory {
  id: string;
  plan: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
  type: 'Renewal' | 'Upgrade' | 'Creation' | 'Downgrade';
  invoiceUrl?: string;
}
