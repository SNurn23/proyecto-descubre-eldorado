import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Descubre Eldorado | Concurso de Identidad Urbana',
  description:
    'Concurso de gamificación urbana organizado por la Municipalidad de Eldorado, Misiones. Recorré 8 puntos, escaneá el QR, completá la palabra E-L-D-O-R-A-D-O y ganá grandes premios.',
  keywords: [
    'Eldorado',
    'Misiones',
    'Descubre Eldorado',
    'Concurso',
    'Gamificación Urbana',
    'Municipalidad de Eldorado',
    'Turismo Misiones',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#262019]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
