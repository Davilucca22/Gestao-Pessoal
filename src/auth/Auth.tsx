import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowRight, AtSign, LockKeyhole, UserRound } from "lucide-react";
import { login, register } from "../lib/api";
import type { UserProfile } from "../lib/api";
import "./auth.css";

export function AuthScreen({
  onAuthenticated,
}: {
  onAuthenticated: (user: UserProfile) => Promise<void>;
}) {
  const location = useLocation();
  const isRegister = location.pathname === "/cadastro";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isRegister && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = isRegister
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);
      await onAuthenticated(user);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível concluir a autenticação.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link className="auth-brand" to="/login" aria-label="MyControl início">
          <span className="auth-brand-mark">◒</span>
          MyControl<span className="auth-brand-dot">.</span>
        </Link>
        <p className="eyebrow">{isRegister ? "Comece por aqui" : "Bem-vindo de volta"}</p>
        <h1>{isRegister ? "Crie seu espaço." : "Acesse sua conta."}</h1>
        <p className="auth-description">
          {isRegister
            ? "Organize sua rotina e leve seus dados salvos neste dispositivo."
            : "Entre para continuar de onde você parou."}
        </p>

        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <label>
              Nome
              <span className="auth-input-wrap">
                <UserRound size={17} />
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </span>
            </label>
          )}
          <label>
            Email
            <span className="auth-input-wrap">
              <AtSign size={17} />
              <input
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                required
              />
            </span>
          </label>
          <label>
            Senha
            <span className="auth-input-wrap">
              <LockKeyhole size={17} />
              <input
                autoComplete={isRegister ? "new-password" : "current-password"}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                minLength={8}
                required
              />
            </span>
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button primary auth-submit" disabled={submitting}>
            {submitting
              ? "Aguarde..."
              : isRegister
                ? "Criar conta"
                : "Entrar"}
            {!submitting && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
          <Link to={isRegister ? "/login" : "/cadastro"}>
            {isRegister ? "Entrar" : "Criar cadastro"}
          </Link>
        </p>
        <p className="auth-privacy">
          Seus dados são associados à sua conta e sincronizados com segurança.
        </p>
      </section>
    </main>
  );
}

export function AuthLoading({ error, retry }: { error?: string; retry?: () => void }) {
  return (
    <main className="auth-screen">
      <section className="auth-card auth-loading">
        <Link className="auth-brand" to="/login">
          <span className="auth-brand-mark">◒</span>
          MyControl<span className="auth-brand-dot">.</span>
        </Link>
        {error ? (
          <>
            <h1>Não foi possível conectar.</h1>
            <p className="auth-description">{error}</p>
            {retry && (
              <button className="button primary auth-submit" onClick={retry}>
                Tentar novamente
              </button>
            )}
          </>
        ) : (
          <p className="auth-description">Carregando seus dados...</p>
        )}
      </section>
    </main>
  );
}
