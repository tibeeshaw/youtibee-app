import Home from "./home";

export default function HomePage() {

  return (
    <div className="items-center justify-items-center min-h-screen pb-20 gap-16 sm:px-8 font-[family-name:var(--font-geist-sans)] text-black">

      <main className="w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <Home/>

      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
