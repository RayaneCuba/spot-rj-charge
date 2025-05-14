
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle, MapPin } from "lucide-react";

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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="bg-electric-green/10 p-3 rounded-full">
            <HelpCircle className="h-6 w-6 text-electric-green" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 font-montserrat">Perguntas frequentes</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tire suas dúvidas sobre o ElectroSpot e nossa rede de eletropostos no Rio de Janeiro
        </p>
      </div>
      
      <Card className="border border-electric-green/20 overflow-hidden">
        <Accordion type="single" collapsible className="w-full divide-y">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 font-montserrat font-medium text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
