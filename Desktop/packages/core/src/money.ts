import { Paisa } from './ids.js';

export function toPaisa(rupees: number): Paisa {
  return Math.round(rupees * 100) as Paisa;
}

export function addPaisa(a: Paisa, b: Paisa): Paisa {
  return (a + b) as Paisa;
}

export function subtractPaisa(a: Paisa, b: Paisa): Paisa {
  return (a - b) as Paisa;
}

export function formatPKR(paisa: Paisa): string {
  return `Rs. ${(paisa / 100).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
}