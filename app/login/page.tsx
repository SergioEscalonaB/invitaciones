"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    const body = await response.json();
    setError(body.error || "No fue posible iniciar sesión.");
    setLoading(false);
  };
  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark">
          <Sparkles size={20} />
        </span>
        <span className="eyebrow">Portal privado</span>
        <h1>Administración</h1>
        <p>
          Ingresa la contraseña para gestionar invitados y enlaces privados.
        </p>
        <label>
          Contraseña
          <div>
            <LockKeyhole size={16} />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
        </label>
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}
        <button className="button primary" disabled={loading}>
          {loading ? "Verificando…" : "Ingresar al panel"}
        </button>
      </form>
    </main>
  );
}
