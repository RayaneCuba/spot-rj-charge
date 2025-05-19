
import { UserCog, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function AccountSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock de dados do usuário
  const user = {
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    memberSince: "Janeiro 2023",
    avatar: "" // URL para avatar se existir
  };

  const handleLogout = () => {
    // Simular logout
    localStorage.removeItem("userAuth");
    
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
      duration: 3000
    });
    
    navigate("/");
  };

  const handleSettings = () => {
    toast({
      title: "Em breve",
      description: "Configurações de conta serão implementadas em breve.",
      duration: 3000
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <UserCog className="h-5 w-5 mr-2 text-purple-500" />
          Conta e Preferências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <HoverCard>
              <HoverCardTrigger>
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-64">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Membro desde {user.memberSince}</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <div className="flex-1">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSettings}
              className="w-full flex items-center"
            >
              <UserCog className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="w-full flex items-center text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
