import { auth, signIn, signOut } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Hypo
          </h1>
          <p className="mt-3 text-lg text-slate-500 font-medium">
            Test the hype. Keep what works.
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-600 mb-10 leading-relaxed">
          Run personal experiments on your habits, routines, and behaviors.
          Track daily adherence, measure outcomes, and find out what actually
          moves the needle.
        </p>

        {/* Auth card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          {session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                )}
                <span className="text-slate-700 font-medium text-sm">
                  {session.user?.email ?? session.user?.name ?? "Signed in"}
                </span>
              </div>

              <a
                href="/dashboard"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-center"
              >
                Go to dashboard →
              </a>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="w-full text-slate-500 hover:text-slate-700 text-sm py-2 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">
                Sign in to start running experiments.
              </p>
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
