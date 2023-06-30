export interface UpdateRealtorProfileRequest {
  phone: string;
  address: Address;
  company: string;
  licencedAgent: boolean;
  entrepreneur: boolean;
  biography: string;
  profilePicUrl: string;
  firstName: string;
  lastName: string;
}

export interface Address {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MatchedSubstring[];
  secondary_text: string;
}

export interface Term {
  offset: number;
  value: string;
}
