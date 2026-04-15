import SafetyTipsClient from "./SafetyTipsClient";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function SafetyTipsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SafetyTipsClient lang={lang} />;
}
