import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Bio-Aliment - Gestion des aliments en élevage Bio",
  description: "Application d'aide à la décision pour l'optimisation de la nutrition animale en élevage biologique en Tunisie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
