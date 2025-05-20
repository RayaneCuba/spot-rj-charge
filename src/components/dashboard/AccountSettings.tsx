
import { UserCog, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function AccountSettings() {
  const navigate = useNavigate();
  const { user, signOut, isVisitor } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Extrair iniciais e nome de usuário do email
  const userEmail = user?.email || "";
  const userName = isVisitor ? "Visitante" : userEmail.split('@')[0];
  const userInitials = userName.substring(0, 2).toUpperCase();
  
  // Formatar data de criação da conta
  const memberSince = user?.created_at 
    ? new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(user.created_at))
    : "Membro recente";

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      navigate("/");
      toast.success("Sessão encerrada com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Não foi possível encerrar a sessão");
    } finally {
      setLoading(false);
    }
  };

  const handleSettings = () => {
    navigate("/profile");
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
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-64">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    {loading ? (
                      <>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-32" />
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-semibold">{userName}</h4>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                        <p className="text-xs text-muted-foreground">
                          {isVisitor ? "Modo Visitante" : `Membro desde ${memberSince}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <div className="flex-1">
              {loading ? (
                <>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </>
              ) : (
                <>
                  <p className="font-medium text-sm">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSettings}
              className="w-full flex items-center"
              disabled={loading}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {loading ? (
                <span className="animate-pulse">Saindo...</span>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
