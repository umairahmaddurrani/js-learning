import { Paisa } from './ids.js';
import { VendorTransaction } from './contract/vendor.js';
import { StockMovement } from './contract/inventory.js';

// Udhaar balance = total purchases - total payments
export function calculateUdhaar(transactions: VendorTransaction[]): Paisa {
  let balance = 0;
  for (const tx of transactions) {
    if (tx.type === 'purchase') {
      balance += tx.amount;
    } else {
      balance -= tx.amount;
    }
  }
  return balance as Paisa;
}

// Stock on-hand = total receipts - total issues
export function calculateStockOnHand(movements: StockMovement[], item: string): number {
  return movements
    .filter((m) => m.item === item)
    .reduce((total, m) => {
      return m.type === 'receipt' ? total + m.quantity : total - m.quantity;
    }, 0);
}