import { Header } from '@/components/layout/header';
import { ThumbnailEditor } from '@/components/thumbnail-editor';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col">
        <ThumbnailEditor />
      </main>
    </div>
  );
}
