
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <FAQSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
