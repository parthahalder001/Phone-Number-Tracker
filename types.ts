
export interface LookupResult {
  phoneNumber: string;
  name: string;
  adminName: string;
  carrier: string;
  location: string;
  city: string;
  type: string;
  summary: string;
  sources: Array<{ title: string; uri: string }>;
  confidence: 'High' | 'Medium' | 'Low';
  socialPresence: {
    whatsapp: { available: boolean; link: string; note: string };
    telegram: { available: boolean; link: string; note: string };
  };
}

export interface SearchState {
  loading: boolean;
  error: string | null;
  result: LookupResult | null;
}
