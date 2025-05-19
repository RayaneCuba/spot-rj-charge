
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function UserWelcome() {
  // Mock de dados do usuário - será substituído por dados reais posteriormente
  const user = {
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    lastLogin: "2023-05-19T10:30:00"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo, {user.name}!</h1>
            <p className="text-muted-foreground">
              É bom ver você novamente. Confira seu painel personalizado abaixo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
