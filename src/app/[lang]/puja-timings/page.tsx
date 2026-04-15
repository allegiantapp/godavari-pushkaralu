import PujaTimingsClient from "./PujaTimingsClient";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function PujaTimingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <PujaTimingsClient lang={lang} />;
}
