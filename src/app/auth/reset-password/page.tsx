"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Senha alterada com sucesso! Redirecionando para o login..."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #1a002e 0%, #32004d 50%, #000000 100%)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 shadow-2xl"
        style={{
          background: "rgba(20,10,40,0.95)",
          border: "1px solid #d4af37",
        }}
      >
        <div className="text-center mb-8">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo-clube-do-taro.png"
              alt="Clube do Tarô"
              className="w-32 h-32 object-contain"
            />
          </div>

          <h1
            className="text-3xl font-bold"
            style={{ color: "#d4af37" }}
          >
            Clube do Tarô
          </h1>

          <p
            className="mt-2"
            style={{ color: "#ffffff" }}
          >
            Defina sua nova senha para acessar o portal.
          </p>

        </div>

        <div className="mb-5">
          <label
            className="block mb-2"
            style={{ color: "#ffffff" }}
          >
            Nova Senha
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl p-3 pr-12"
              style={{
                background: "#ffffff",
                border: "1px solid #d4af37",
                color: "#000000",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={20} color="#555" />
              ) : (
                <Eye size={20} color="#555" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block mb-2"
            style={{ color: "#ffffff" }}
          >
            Confirmar Senha
          </label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Repita sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl p-3"
            style={{
              background: "#ffffff",
              border: "1px solid #d4af37",
              color: "#000000",
            }}
          />
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full p-3 rounded-xl font-bold"
          style={{
            background: "#d4af37",
            color: "#000000",
          }}
        >
          {loading ? "Salvando..." : "Alterar Senha"}
        </button>

        {message && (
          <div
            className="mt-4 text-center"
            style={{ color: "#ffffff" }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}