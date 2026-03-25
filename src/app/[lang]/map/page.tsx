import MapClient from "./MapClient";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <MapClient lang={lang} />;
}
