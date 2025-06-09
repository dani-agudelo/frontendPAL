import { useState } from "react";
import { useAuth } from "security/context/auth.context";
import { Button } from "root/components/ui/button";
import { Input } from "root/components/ui/input";
import { Label } from "root/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Alert, AlertDescription } from "root/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "root/components/ui/separator";
import { FaGoogle, FaGithub } from "react-icons/fa"; 

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/auth/${provider}`; // no sé cómo manejarlo
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mb-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </CardFooter>
      </form>

      <Separator className="my-4" />

      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("google")}
        >
          <FaGoogle className="h-5 w-5" /> Iniciar sesión con Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("github")}
        >
          <FaGithub className="h-5 w-5" /> Iniciar sesión con GitHub
        </Button>
      </CardContent>
    </Card>
  );
}