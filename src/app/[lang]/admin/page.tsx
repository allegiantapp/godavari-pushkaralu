import AdminClient from "./AdminClient";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <AdminClient lang={lang} />;
}
