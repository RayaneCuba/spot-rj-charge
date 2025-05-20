import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, LogOut, Trash2, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

// Esquema de validação do formulário de feedback
const feedbackSchema = z.object({
  message: z.string().min(3, {
    message: "O feedback deve ter pelo menos 3 caracteres.",
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const Profile = () => {
  const { user, signOut, isVisitor } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formulário de feedback
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
    },
  });

  // Obter informações do usuário
  const userEmail = user?.email || "visitante@electrospot.app";
  const userName = isVisitor ? "Visitante" : (userEmail.split('@')[0]);

  // Funções para lidar com ações do usuário
  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      navigate("/");
      toast.success("Sessão encerrada com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao encerrar sessão");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    if (isVisitor) {
      toast("Modo Visitante", {
        description: "Não é possível excluir uma conta de visitante."
      });
      return;
    }

    try {
      setLoading(true);
      // Deletar dados do usuário primeiro
      const { error: deleteDataError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id);

      if (deleteDataError) throw deleteDataError;

      // Deletar usuário
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
        user?.id as string
      );

      if (deleteUserError) throw deleteUserError;

      await signOut();
      navigate("/");
      toast.success("Conta excluída com sucesso");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      toast.error(`Não foi possível excluir a conta: ${error.message}`);
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitFeedback = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      // No modo visitante, apenas fingimos enviar
      if (isVisitor) {
        toast("Feedback recebido", {
          description: "Obrigado por testar o aplicativo!"
        });
        form.reset();
        return;
      }

      // Em um ambiente real, enviaria para o Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([
          { 
            user_id: user?.id,
            message: data.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success("Feedback enviado com sucesso");
      form.reset();
    } catch (error: any) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Não foi possível enviar seu feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 md:container md:mx-auto md:py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Perfil do Usuário</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e preferências
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suas Informações</CardTitle>
              <CardDescription>
                {isVisitor
                  ? "Você está navegando como visitante"
                  : "Seus dados de conta"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Nome de usuário
                  </h3>
                  {loading ? (
                    <Skeleton className="h-6 w-3/4 mt-1" />
                  ) : (
                    <p className="text-lg font-medium">{userName}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    E-mail
                  </h3>
                  {loading ? (
                    <Skeleton className="h-6 w-full mt-1" />
                  ) : (
                    <p className="text-lg font-medium">{userEmail}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Tipo de conta
                  </h3>
                  {loading ? (
                    <Skeleton className="h-6 w-1/2 mt-1" />
                  ) : (
                    <p className="text-lg font-medium">
                      {isVisitor ? "Visitante" : "Usuário registrado"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {confirmDelete && (
                <Alert variant="destructive" className="mb-3">
                  <AlertDescription>
                    Esta ação não pode ser desfeita. Tem certeza?
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Encerrar Sessão
              </Button>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDeleteAccount}
                disabled={loading || isVisitor}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {confirmDelete ? "Confirmar Exclusão" : "Excluir Conta"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Envie seu Feedback</CardTitle>
              <CardDescription>
                Ajude-nos a melhorar o ElectroSpot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form 
                  onSubmit={form.handleSubmit(onSubmitFeedback)} 
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sua mensagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos sua experiência ou sugira melhorias..." 
                            className="resize-none min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                  </Button>
                </form>
              </Form>
              {isVisitor && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>No modo visitante, os feedbacks não são armazenados.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
