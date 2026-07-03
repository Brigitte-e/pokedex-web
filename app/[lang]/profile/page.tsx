import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";
import { ProfileClient } from "./ProfileClient";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <ProfileClient lang={lang} labels={dict.profile} />;
}
