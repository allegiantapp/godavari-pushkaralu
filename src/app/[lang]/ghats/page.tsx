import GhatsClient from "./GhatsClient";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function GhatsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <GhatsClient lang={lang} />;
}
