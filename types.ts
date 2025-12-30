
export interface Prize {
  id: string;
  text: string;
  color: string;
  weight: number;
}

export interface SpinResult {
  prize: Prize;
  timestamp: number;
}

export enum ThemeType {
  OFFICE = 'Office Party',
  KIDS = 'Kids Birthday',
  GAMING = 'Gaming Rewards',
  COUPLE = 'Date Night',
  CUSTOM = 'Custom'
}
