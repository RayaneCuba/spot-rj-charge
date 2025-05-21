
import { Loader2 } from "lucide-react";

export function AuthFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verificando autenticação...</p>
      </div>
    </div>
  );
}
