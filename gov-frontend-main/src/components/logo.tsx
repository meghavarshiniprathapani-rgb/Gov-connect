import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center font-black text-2xl tracking-tighter text-primary uppercase',
        className
      )}
    >
      GovConnect
    </Link>
  );
}
