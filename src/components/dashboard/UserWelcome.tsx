
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export function UserWelcome() {
  const { user } = useAuth();
  
  // Extrair o nome de usuário do email para exibição
  const userName = user?.email ? user.email.split('@')[0] : 'Usuário';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo, {userName}!</h1>
            <p className="text-muted-foreground">
              É bom ver você novamente. Confira seu painel personalizado abaixo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
