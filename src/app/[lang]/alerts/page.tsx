import AlertsClient from "./AlertsClient";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function AlertsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <AlertsClient lang={lang} />;
}
