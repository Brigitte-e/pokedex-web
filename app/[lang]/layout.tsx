import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Nav } from "@/components/Nav";
import { getDictionary } from "@/lib/i18n";
import { LOCALES } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!(LOCALES as readonly string[]).includes(lang)) return { title: "PokéDex" };
  const dict = await getDictionary(lang as Locale);
  return { title: dict.metadata.title, description: dict.metadata.description };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!(LOCALES as readonly string[]).includes(lang)) notFound();

  const locale = lang as Locale;

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <QueryProvider>
            <Nav />
            <div className="flex-1">{children}</div>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
