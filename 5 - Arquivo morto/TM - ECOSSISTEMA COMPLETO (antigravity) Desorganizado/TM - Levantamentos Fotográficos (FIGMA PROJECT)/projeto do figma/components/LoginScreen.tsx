import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { tmsColors } from "./ThemeProvider";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: tmsColors.gradientLogin,
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block px-6 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: "rgba(17, 34, 64, 0.5)",
              border: "2px solid #64ffda",
              boxShadow: "0 0 20px rgba(100, 255, 218, 0.2)",
            }}
          >
            <h1
              className="text-3xl font-heading"
              style={{
                color: "#64ffda",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              TMS
            </h1>
          </div>
          <h2
            className="text-2xl mb-2 font-heading"
            style={{ color: "#e6f1ff", fontWeight: 600 }}
          >
            Levantamentos Fotográficos
          </h2>
          <p className="font-body" style={{ color: "#8892b0" }}>
            Um Sistema MAFFENG
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div
            className="p-8 rounded-xl"
            style={{
              backgroundColor: "rgba(17, 34, 64, 0.5)",
              border: "1px solid rgba(100, 255, 218, 0.1)",
            }}
          >
            {/* Email Field */}
            <div className="mb-6">
              <Label
                htmlFor="email"
                className="mb-2 block"
                style={{ color: "#e6f1ff" }}
              >
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={20}
                  style={{ color: "#8892b0" }}
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@tms.com"
                  className="pl-12 h-14 border-2 rounded-lg"
                  style={{
                    backgroundColor: "#0a192f",
                    borderColor: "#1a365d",
                    color: "#e6f1ff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#64ffda";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(100, 255, 218, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#1a365d";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <Label
                htmlFor="password"
                className="mb-2 block"
                style={{ color: "#e6f1ff" }}
              >
                Senha
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={20}
                  style={{ color: "#8892b0" }}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 border-2 rounded-lg"
                  style={{
                    backgroundColor: "#0a192f",
                    borderColor: "#1a365d",
                    color: "#e6f1ff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#64ffda";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(100, 255, 218, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#1a365d";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#8892b0" }}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <a
                href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20minha%20senha%20do%20TMS%20Levantamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: "#64ffda" }}
              >
                Esqueceu a senha? Fale com o DEV
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-lg text-lg transition-all duration-200"
              style={{
                backgroundColor: "#64ffda",
                color: "#0a192f",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(100, 255, 218, 0.5)";
                e.currentTarget.style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >
              Entrar
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: "#8892b0" }}>
            TMS – Soluções Tecnológicas © 2025. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}