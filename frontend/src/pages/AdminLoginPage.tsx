import { FormEvent, useState } from "react";
import { AdminSession, loginAdmin } from "../services/authApi";

interface Props {
  onLogin: (session: AdminSession) => void;
}

export default function AdminLoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await loginAdmin(email, password);
      onLogin(session);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Đăng nhập admin thất bại",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm border border-[#c5a059]/30 bg-[#0b0b0b] p-6 shadow-[0_0_40px_rgba(197,160,89,0.08)]">
        <h1 className="font-fantasy text-3xl text-[#c5a059] uppercase tracking-widest mb-2">
          Đăng nhập Quản trị viên
        </h1>
        <p className="text-[#e0d8cf]/60 text-sm mb-6">
          Đăng nhập bằng tài khoản quản trị viên.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#c5a059]/70 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-[#050505] border border-[#c5a059]/30 rounded p-3 text-[#e0d8cf] outline-none focus:border-[#c5a059] transition-colors font-sans"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#c5a059]/70 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-[#050505] border border-[#c5a059]/30 rounded p-3 text-[#e0d8cf] outline-none focus:border-[#c5a059] transition-colors font-sans"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-b from-[#c5a059] to-[#8a6d3b] hover:from-[#d6b772] hover:to-[#a1824c] disabled:opacity-60 border border-[#f3d081] text-black font-bold py-3 px-4 rounded shadow-[0_0_15px_rgba(138,109,59,0.3)] transition-all font-fantasy tracking-[0.2em] uppercase"
          >
            {isSubmitting ? "Đang đăng nhập" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
