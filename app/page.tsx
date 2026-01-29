import { auth, signIn, signOut } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 30, fontWeight: 800 }}>Hypo</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Test the hype. Keep what works.
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 10,
        }}
      >
        {session ? (
          <>
            <div style={{ fontWeight: 700 }}>
              Signed in as {session.user?.email ?? session.user?.name ?? "user"}
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button style={{ marginTop: 12 }} type="submit">
                Sign out
              </button>
            </form>

            <a
              href="/dashboard"
              style={{ display: "inline-block", marginTop: 12 }}
            >
              Go to dashboard →
            </a>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button type="submit">Sign in with Google</button>
          </form>
        )}
      </div>
    </main>
  );
}
