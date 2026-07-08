import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Beef, Calculator, Sparkles } from "lucide-react"

const formulas = [
  {
    title: "Besoins énergétiques",
    formula: "UFL = entretien + croissance + engraissement",
    description: "Prend en compte le gain de poids attendu et la durée de l’engraissement.",
  },
  {
    title: "Besoins protéiques",
    formula: "PDIE = besoins de protéines pour la croissance",
    description: "Optimise la ration pour un engraissement homogène et performant.",
  },
  {
    title: "Équilibre ruminal",
    formula: "NDF / énergie = ajustement du ratio fourrage/concentré",
    description: "Assure un compromis adapté entre digestibilité et volume de ration.",
  },
]

export function BeefBullCalculator() {
  return (
    <Card className="border-amber-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-amber-100 p-2 text-amber-700">
            <Beef className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-amber-800">Calculateur engraissement des taurillons</CardTitle>
            <CardDescription>
              Module spécialisé pour la formulation de rations d’engraissement.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <Calculator className="h-4 w-4" />
            <span className="font-semibold">Formules principales</span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {formulas.map((formula) => (
              <div key={formula.title} className="rounded-lg border border-amber-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-gray-900">{formula.title}</h4>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    <Sparkles className="mr-1 h-3 w-3" />
                    INRA
                  </Badge>
                </div>
                <p className="mt-2 text-sm font-medium text-amber-700">{formula.formula}</p>
                <p className="mt-2 text-sm text-gray-600">{formula.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
