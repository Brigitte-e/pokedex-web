"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/firebase-errors";
import { useAuthStore } from "@/store/auth";
import { useTranslation } from "@/hooks/useTranslation";

const LoginForm = () => {
  const { locale, t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(`/${locale}/pokemon`);
    }
  }, [authLoading, user, locale, router]);

  const v = {
    emailRequired: t("auth.validation.emailRequired"),
    passwordRequired: t("auth.validation.passwordRequired"),
    passwordMinLength: t("auth.validation.passwordMinLength"),
    passwordUppercase: t("auth.validation.passwordUppercase"),
    passwordNumber: t("auth.validation.passwordNumber"),
    confirmPasswordRequired: t("auth.validation.confirmPasswordRequired"),
    passwordsMustMatch: t("auth.validation.passwordsMustMatch"),
  };

  const signInSchema = z.object({
    email: z.string().email(v.emailRequired),
    password: z.string().min(1, v.passwordRequired),
  });

  const signUpSchema = z
    .object({
      email: z.string().email(v.emailRequired),
      password: z
        .string()
        .min(6, v.passwordMinLength)
        .regex(/[A-Z]/, v.passwordUppercase)
        .regex(/[0-9]/, v.passwordNumber),
      confirmPassword: z.string().min(1, v.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsMustMatch,
      path: ["confirmPassword"],
    });

  const forgotSchema = z.object({
    email: z.string().email(v.emailRequired),
  });

  type SignInValues = z.infer<typeof signInSchema>;
  type SignUpValues = z.infer<typeof signUpSchema>;
  type ForgotValues = z.infer<typeof forgotSchema>;

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const forgotForm = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const isSubmitting =
    mode === "signin"
      ? signInForm.formState.isSubmitting
      : mode === "signup"
        ? signUpForm.formState.isSubmitting
        : forgotForm.formState.isSubmitting;

  function switchMode(next: "signin" | "signup" | "forgot") {
    setFirebaseError(null);
    setResetSent(false);
    signInForm.reset();
    signUpForm.reset();
    forgotForm.reset();
    setShowPassword(false);
    setShowConfirm(false);
    setMode(next);
  }

  async function onSignIn(values: SignInValues) {
    setFirebaseError(null);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), values.email, values.password);
    } catch (err) {
      setFirebaseError(getAuthErrorMessage(err, t));
    }
  }

  async function onSignUp(values: SignUpValues) {
    setFirebaseError(null);
    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), values.email, values.password);
    } catch (err) {
      setFirebaseError(getAuthErrorMessage(err, t));
    }
  }

  async function handleGoogle() {
    setFirebaseError(null);
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
    } catch (err) {
      const msg = getAuthErrorMessage(err, t);
      if (msg) setFirebaseError(msg);
    }
  }

  async function onForgotPassword(values: ForgotValues) {
    setFirebaseError(null);
    setResetSent(false);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), values.email, {
        url: `${window.location.origin}/${locale}/login`,
      });
      setResetSent(true);
    } catch (err) {
      setFirebaseError(getAuthErrorMessage(err, t));
    }
  }

  const title =
    mode === "signin"
      ? t("auth.signInTitle")
      : mode === "signup"
        ? t("auth.signUpTitle")
        : t("auth.forgotPasswordTitle");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PokéDex</h1>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          {mode === "forgot" && (
            <p className="mt-2 text-sm text-muted-foreground">{t("auth.forgotPasswordDescription")}</p>
          )}
        </div>

        {firebaseError && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {firebaseError}
          </p>
        )}

        {resetSent && (
          <p role="status" className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
            {t("auth.resetLinkSent")}
          </p>
        )}

        {mode === "signin" ? (
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4" noValidate>
            <Field label={t("auth.email")} error={signInForm.formState.errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...signInForm.register("email")}
                className={inputCn(!!signInForm.formState.errors.email)}
              />
            </Field>

            <Field label={t("auth.password")} error={signInForm.formState.errors.password?.message}>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                hasError={!!signInForm.formState.errors.password}
                showLabel={t("auth.showPassword")}
                hideLabel={t("auth.hidePassword")}
                {...signInForm.register("password")}
              />
            </Field>

            <div className="text-right">
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => switchMode("forgot")}
              >
                {t("auth.forgotPassword")}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? t("auth.pleaseWait") : t("auth.signIn")}
            </button>
          </form>
        ) : mode === "signup" ? (
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4" noValidate>
            <Field label={t("auth.email")} error={signUpForm.formState.errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...signUpForm.register("email")}
                className={inputCn(!!signUpForm.formState.errors.email)}
              />
            </Field>

            <Field label={t("auth.password")} error={signUpForm.formState.errors.password?.message}>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                hasError={!!signUpForm.formState.errors.password}
                showLabel={t("auth.showPassword")}
                hideLabel={t("auth.hidePassword")}
                {...signUpForm.register("password")}
              />
            </Field>

            <Field label={t("auth.confirmPassword")} error={signUpForm.formState.errors.confirmPassword?.message}>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                hasError={!!signUpForm.formState.errors.confirmPassword}
                showLabel={t("auth.showPassword")}
                hideLabel={t("auth.hidePassword")}
                {...signUpForm.register("confirmPassword")}
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? t("auth.pleaseWait") : t("auth.signUp")}
            </button>
          </form>
        ) : (
          <form onSubmit={forgotForm.handleSubmit(onForgotPassword)} className="space-y-4" noValidate>
            <Field label={t("auth.email")} error={forgotForm.formState.errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...forgotForm.register("email")}
                className={inputCn(!!forgotForm.formState.errors.email)}
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting || resetSent}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? t("auth.pleaseWait") : t("auth.sendResetLink")}
            </button>
          </form>
        )}

        {mode !== "forgot" && (
          <>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-3 text-sm font-medium leading-5 text-[#1F1F1F] transition-colors hover:bg-[#f8f9fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#747775] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif' }}
        >
          <GoogleIcon />
          {t("auth.continueWithGoogle")}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? `${t("auth.noAccount")} ` : `${t("auth.alreadyHaveAccount")} `}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? t("auth.signUp") : t("auth.signIn")}
          </button>
        </p>
          </>
        )}

        {mode === "forgot" && (
          <p className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => switchMode("signin")}
            >
              {t("auth.backToSignIn")}
            </button>
          </p>
        )}
      </div>
    </main>
  );
};

export { LoginForm };

// ── helpers ──────────────────────────────────────────────────────────────────

function inputCn(hasError: boolean) {
  return `w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${
    hasError ? "border-destructive focus:ring-destructive/40" : "border-input"
  }`;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Field = ({ label, error, children }: FieldProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  show: boolean;
  onToggle: () => void;
  hasError: boolean;
  showLabel: string;
  hideLabel: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ show, onToggle, hasError, showLabel, hideLabel, ...props }, ref) => (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={show ? "text" : "password"}
        className={`${inputCn(hasError)} pr-10`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? hideLabel : showLabel}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  ),
);
PasswordInput.displayName = "PasswordInput";

const GoogleIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
};
