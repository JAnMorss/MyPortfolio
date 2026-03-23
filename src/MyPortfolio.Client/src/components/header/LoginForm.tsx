import { useState } from "react";
import { loginApiConnector } from "@/api.connector/auth/login.api.connector";
import { loginInputSchema } from "@/schemas/login/login.schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import type { ValidationError } from "@/schemas/ValidationError/validationError.schema";

interface LoginFormProps {
  onLoginSuccess?: (message?: string) => void; 
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const { login: saveAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const parsed = loginInputSchema.safeParse({ email, password });

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map((err) => ({
          propertyName: err.path[0] ? String(err.path[0]) : "Form",
          errorMessage: err.message,
        }))
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginApiConnector.login(parsed.data);
      console.log("API Response:", response);

      if (!response.data.token) {
        setErrors([
          {
            propertyName: "Form",
            errorMessage: "Only admin or owner of this portfolio can login.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      saveAuth(response.data.token);

      if (onLoginSuccess) {
        onLoginSuccess(response.message); 
      }

    } catch (err: any) {
      if (err?.type === "validation") {
        setErrors(err.data.errors);
        setIsLoading(false);
        return;
      }

      setErrors([
        {
          propertyName: "Form",
          errorMessage:
            err?.response?.data?.detail ||
            "Something went wrong. Only admin or owner of this portfolio can login.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <p className="text-center text-sm text-warning">
        ⚠️ Only admin or owner of this portfolio can login.
      </p>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs text-white">
          LOGIN
        </span>
      </div>

      {getFieldErrors("Form").map((e, i) => (
        <p key={i} className="text-sm text-red-600 text-center">
          {e.errorMessage}
        </p>
      ))}

      <div className="space-y-1">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {getFieldErrors("Email").map((e, i) => (
          <p key={i} className="text-sm text-red-600">
            {e.errorMessage}
          </p>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {getFieldErrors("Password").map((e, i) => (
          <p key={i} className="text-sm text-red-600">
            {e.errorMessage}
          </p>
        ))}
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}