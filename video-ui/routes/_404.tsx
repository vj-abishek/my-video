import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div class="w-full max-w-md bg-neutral-900/80 border border-neutral-800/60 rounded-3xl p-8 text-center backdrop-blur-sm shadow-2xl">
          <h1 class="text-3xl font-bold text-white">404</h1>
          <p class="mt-2 text-neutral-400">The page you were looking for doesn't exist.</p>
          <a
            href="/"
            class="inline-flex items-center justify-center mt-6 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors"
          >
            Go back home
          </a>
        </div>
      </div>
    </>
  );
}
