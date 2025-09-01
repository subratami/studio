import { Header } from '@/components/layout/header';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
