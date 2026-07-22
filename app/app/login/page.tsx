

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split("@")[0],
            },
          },
        });

        if (error) {
          throw error;
        }

        setMessage(
          "Account created. Check your email if confirmation is required.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Operator Cloud
        </p>

        <h1 className="mt-4 text-4xl font-semibold">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>

        <p className="mt-3 text-sm text-white/50">
          Access your missions securely from any device.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/40">
              Email
            </span>

            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-400"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/40">
              Password
            </span>

            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-400"
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Working..."
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {message ? (
          <p className="mt-5 rounded-xl border border-white/10 p-3 text-sm text-white/70">
            {message}
          </p>
        ) : null}

        <button
          className="mt-6 text-sm text-cyan-400"
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage("");
          }}
        >
          {mode === "signin"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
