
import { Card, CardContent } from "@/components/ui/card";
import { Award, Rocket } from "lucide-react";

export function MissionBadge() {
  return (
    <Card className="bg-gradient-to-r from-electric-green/20 to-electric-green/5 border-electric-green/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 h-24 w-24 text-electric-green/10 overflow-hidden">
        <Rocket className="h-full w-full" />
      </div>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="shrink-0">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-electric-green to-electric-green/70 flex items-center justify-center shadow-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-montserrat font-bold text-lg text-electric-green">Missão RJ completa!</h3>
          <p className="text-sm text-muted-foreground">
            +100 eletropostos ativos em todo o estado do Rio. Em breve, vamos chegar até você!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
