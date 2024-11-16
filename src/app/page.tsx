import { CommentsList } from "./components/CommentsList";

export default async function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <CommentsList />
      </main>
    </div>
  );
}
