import BottomNav from "@/components/layout/BottomNav";
import FloatingSOS from "@/components/layout/FloatingSOS";
import AlertToast from "@/components/ui/AlertToast";

export function generateStaticParams() {
  return [{ lang: "te" }, { lang: "hi" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="flex flex-col min-h-dvh bg-godavari-50">
      <div className="flex-1 flex flex-col">{children}</div>
      <AlertToast lang={lang} />
      <FloatingSOS lang={lang} />
      <BottomNav lang={lang} />
    </div>
  );
}
