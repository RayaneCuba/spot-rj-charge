
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCheck, MailQuestion } from "lucide-react";

export function NotificationForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      setName("");
      setAgreeToTerms(false);
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Você receberá atualizações sobre novas regiões de cobertura.",
      });
    }, 1000);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto border-electric-green/20 overflow-hidden">
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-electric-green to-electric-green/50"></div>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="bg-electric-green/10 p-2 rounded-full">
            <Bell className="h-5 w-5 text-electric-green" />
          </div>
          <CardTitle className="text-2xl font-montserrat">Receba atualizações</CardTitle>
        </div>
        <CardDescription>
          Seja notificado quando o ElectroSpot expandir para novas regiões.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-input/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-input/60"
            />
          </div>
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              className="mt-1"
            />
            <Label 
              htmlFor="terms" 
              className="text-sm text-muted-foreground leading-relaxed"
            >
              Concordo em receber atualizações do ElectroSpot por e-mail e aceito os termos de privacidade.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-electric-green hover:bg-electric-green/90 text-white font-montserrat"
            disabled={!agreeToTerms || loading}
          >
            {loading ? (
              <>Processando...</>
            ) : (
              <>
                <MailQuestion className="mr-2 h-4 w-4" />
                Quero ser notificado
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
