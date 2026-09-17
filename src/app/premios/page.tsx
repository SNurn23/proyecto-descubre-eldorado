import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SeccionPremios from '@/components/SeccionPremios';

export default function PremiosPage() {
  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#197084] hover:text-[#1B9951] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Volver a la página principal
        </Link>
      </div>

      <SeccionPremios />
    </div>
  );
}
