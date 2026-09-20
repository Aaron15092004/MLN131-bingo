import { useRef, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Scale } from "lucide-react";
import { decryptJson } from "../lib/vault.js";
import { btn } from "./ui.jsx";

// Web Crypto only exists on https:// pages and on localhost.
const supported = Boolean(globalThis.crypto?.subtle);

// Shown before anything else. The questions ship encrypted; this is the only way to read them.
export function Unlock({ vault, onUnlock }) {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const [main, sub] = (vault.title ?? "Bingo").split(/:\s*/);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || busy || !supported) return;
    setBusy(true);
    setError("");
    try {
      onUnlock(await decryptJson(vault, password));
    } catch (err) {
      setError(
        err?.name === "OperationError"
          ? "Sai mật khẩu, hãy thử lại."
          : "Không mở được dữ liệu câu hỏi.",
      );
      setBusy(false);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(90rem_36rem_at_50%_-8rem,rgb(246_201_69/0.10),transparent_65%),linear-gradient(var(--color-ink-900),var(--color-ink-950))] px-10 py-16">
      <form
        onSubmit={submit}
        className="flex w-full max-w-3xl animate-rise flex-col gap-6 rounded-3xl border-2 border-ink-500 bg-ink-800 p-12 shadow-[0_1rem_3rem_rgb(0_0_0/0.35)]"
      >
        <div className="flex items-center gap-4">
          <Scale
            aria-hidden="true"
            className="size-14 shrink-0 text-gold-400"
            strokeWidth={2.25}
          />
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold leading-tight">{main}</h1>
            {sub && (
              <p className="text-2xl font-bold leading-tight text-gold-400">
                {sub}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-2xl font-bold text-paper">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              ref={inputRef}
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-invalid={error !== ""}
              aria-describedby="password-error"
              disabled={!supported}
              className="w-full rounded-2xl border-4 border-ink-500 bg-ink-950 py-4 pl-6 pr-20 text-[2.25rem] font-bold tracking-wide text-gold-300 focus:border-gold-400"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-pressed={visible}
              aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              title={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 grid size-14 -translate-y-1/2 place-items-center rounded-xl text-mist hover:bg-ink-700 hover:text-paper"
            >
              {visible ? (
                <EyeOff aria-hidden="true" className="size-8" />
              ) : (
                <Eye aria-hidden="true" className="size-8" />
              )}
            </button>
          </div>
          <p
            id="password-error"
            role="alert"
            className="min-h-9 text-2xl font-bold text-crimson-300"
          >
            {!supported
              ? "Trình duyệt chỉ giải mã được trên trang https:// hoặc localhost."
              : error}
          </p>
        </div>

        <button
          type="submit"
          disabled={!password || busy || !supported}
          className={`${btn.gold} min-h-20 text-[1.75rem]`}
        >
          {busy ? "Đang mở khóa…" : "Mở bảng chơi"}
        </button>
      </form>
    </main>
  );
}
