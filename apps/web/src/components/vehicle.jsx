// The two memorable elements of Vehicle 360 (split out of ui.jsx, see docs/progress.md).
// Nothing else on a screen gets decoration.
import { formatPrice } from '../lib/format.js';

const PRICE_SIZES = {
  list: 'text-price',
  detail: 'text-price-large',
};

// A yellow card like the price sign on a showroom windscreen: square corners, a dark edge.
export function PriceTag({ price, size = 'list' }) {
  return (
    <p
      className={`inline-block rounded-none border-2 border-ink bg-plate px-3 py-1 font-heading leading-none font-bold text-ink ${PRICE_SIZES[size]}`}
    >
      {formatPrice(price)}
    </p>
  );
}

// A registration number drawn like a number plate. Staff screens only (Q7: not on public pages).
export function PlateBadge({ registrationNumber }) {
  return (
    <span
      aria-label={`Registration number ${registrationNumber}`}
      className="inline-block rounded-plate border-2 border-ink bg-paper px-2 font-heading text-card font-bold tracking-widest text-ink uppercase"
    >
      {registrationNumber}
    </span>
  );
}
