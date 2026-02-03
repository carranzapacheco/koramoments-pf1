'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let role = "";
      if (user.uid === "SsWyDONxP6UKmA0UAZ16oZKER602") role = "admin";
      else if (user.uid === "TcLIgkYKZBfLIYdZLlJAzuqJqBk1") role = "cliente";

      if (!role) {
        setError("Usuario no autorizado");
        return;
      }

      localStorage.setItem("userRole", role);
      router.push("/dashboard");

    } catch (err: any) {
      if (err.code === "auth/user-not-found") setError("Usuario no encontrado");
      else if (err.code === "auth/wrong-password") setError("Contraseña incorrecta");
      else setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1EC] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">

        {/* Logo / Marca */}
        <h1 className="text-2xl font-semibold text-center text-[#2E2E2E] mb-2">
          Kora Moments
        </h1>
        <p className="text-sm text-center text-[#2E2E2E]/70 mb-6">
          Acceso privado
        </p>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-[#C48B9F]
                       transition"
          />
        </div>

        {/* Password con ojito dorado */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-[#C48B9F]
                       transition pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff size={20} color="#C48B9F" />
            ) : (
              <Eye size={20} color="#9CA3AF" />
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-center text-red-500 mb-3 animate-shake">
            {error}
          </p>
        )}

        {/* Botón */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#C48B9F] text-white py-2 rounded-lg font-medium
                     hover:bg-[#C2A46D] transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-95"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
