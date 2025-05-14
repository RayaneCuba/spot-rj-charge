
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MapboxConfigProps {
  onSaveToken: (token: string) => void;
}

export function MapboxConfig({ onSaveToken }: MapboxConfigProps) {
  const [token, setToken] = useState('');

  const handleSaveToken = () => {
    if (token.trim()) {
      localStorage.setItem('mapbox_token', token);
      onSaveToken(token);
      toast.success("Token do Mapbox salvo com sucesso!");
    } else {
      toast.error("Por favor, insira um token válido.");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-blue rounded-lg shadow-lg">
      <h3 className="text-lg font-montserrat font-semibold mb-4">Configurar Mapbox</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Para visualizar o mapa interativo, é necessário fornecer um token do Mapbox.
        <br />
        Obtenha o seu token em <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">account.mapbox.com/access-tokens/</a>
      </p>
      <div className="flex gap-2">
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Insira seu token público do Mapbox"
          className="flex-1"
        />
        <Button onClick={handleSaveToken}>Salvar</Button>
      </div>
    </div>
  );
}
