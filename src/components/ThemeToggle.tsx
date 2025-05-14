
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    window.localStorage.setItem("theme", newTheme);
  };
  
  return (
    <Button 
      variant="outline" 
      size={isMobile ? "icon" : "default"}
      onClick={toggleTheme}
      className="bg-background"
    >
      {theme === "light" ? "🌙" : "☀️"} {!isMobile && (theme === "light" ? "Modo escuro" : "Modo claro")}
    </Button>
  );
}
