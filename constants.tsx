
import { Prize } from './types';

export const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA', 
  '#F1948A', '#85C1E9', '#7FB3D5', '#C39BD3', 
  '#F8C471', '#7DCEA0', '#F0B27A'
];

export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', text: 'Voucher Belanja', color: '#FF6B6B', weight: 1 },
  { id: '2', text: 'Saldo E-Wallet', color: '#4ECDC4', weight: 1 },
  { id: '3', text: 'Powerbank', color: '#45B7D1', weight: 1 },
  { id: '4', text: 'Tumblr Keren', color: '#FFA07A', weight: 1 },
  { id: '5', text: 'Zonk / Coba Lagi', color: '#98D8C8', weight: 1 },
  { id: '6', text: 'Headset Gaming', color: '#F7DC6F', weight: 1 },
  { id: '7', text: 'Kaos Eksklusif', color: '#BB8FCE', weight: 1 },
  { id: '8', text: 'Mistery Box', color: '#82E0AA', weight: 1 },
];
