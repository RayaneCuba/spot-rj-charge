
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FAQSection() {
  const faqs = [
    {
      question: "Quando o serviço será expandido para outros estados?",
      answer: "Estamos trabalhando para expandir nossos serviços para São Paulo e Minas Gerais no próximo trimestre. Outros estados serão incluídos gradualmente, de acordo com a disponibilidade de eletropostos e demanda local."
    },
    {
      question: "Como funciona o sistema de carregamento?",
      answer: "Nosso serviço integra diferentes redes de eletropostos, permitindo que você utilize qualquer ponto de carregamento compatível dentro da nossa área de cobertura. Basta localizar um ponto no mapa, dirigir até lá e seguir as instruções específicas do eletroposto."
    },
    {
      question: "Quais cidades do Rio de Janeiro são cobertas atualmente?",
      answer: "Atualmente, cobrimos as principais cidades do estado do Rio de Janeiro, incluindo Rio de Janeiro (capital), Niterói, Petrópolis, Angra dos Reis, Búzios, Paraty e outras localidades onde existem eletropostos instalados e cadastrados em nossa rede."
    },
    {
      question: "Vocês oferecem suporte técnico em caso de problemas?",
      answer: "Sim, oferecemos suporte técnico 24/7 para usuários dentro da nossa área de cobertura. Em caso de problemas, basta entrar em contato conosco através do aplicativo ou pelo telefone de suporte."
    },
    {
      question: "É necessário fazer cadastro para usar o serviço?",
      answer: "Sim, é necessário criar uma conta para utilizar nosso serviço. O cadastro é simples e pode ser feito diretamente pelo nosso aplicativo ou site. Após o cadastro, você terá acesso a todos os recursos disponíveis em nossa plataforma."
    },
    {
      question: "Como posso sugerir a instalação de um eletroposto na minha região?",
      answer: "Você pode sugerir novos pontos de carregamento através do nosso formulário de sugestões disponível no aplicativo ou site. Analisamos todas as sugestões e trabalhamos em conjunto com parceiros para expandir nossa rede de eletropostos."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Perguntas frequentes</h2>
        <p className="text-muted-foreground">Tire suas dúvidas sobre o ElectroSpot</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
