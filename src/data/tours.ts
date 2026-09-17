export type Tour = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export const tours: Tour[] = [
  { id: 1, title: "Ponta Verde", description: "Conheça o Circuito Ponta Verde e viva paisagens marcantes dos Lençóis Maranhenses.", image: "/Ponta_Verde.jpg" },
  { id: 2, title: "América", description: "Aventure-se pelo Circuito América em um roteiro especial entre dunas e lagoas.", image: "/America.jpg" },
  { id: 3, title: "Emendadas", description: "Descubra o Circuito Emendadas e aproveite cenários naturais inesquecíveis.", image: "/Emendas.jpg" },
  { id: 4, title: "Betânia", description: "Explore o Circuito Betânia com a GLM e descubra um dos roteiros da região.", image: "/Betania.jpg" },
  { id: 5, title: "Rancharia", description: "Paisagens, aventura e contato com a natureza no Circuito Rancharia.", image: "/Rancharia.jpg" },
  { id: 6, title: "Travosa", description: "Conheça o Circuito Travosa e monte seu passeio diretamente com nossa equipe.", image: "/Travosa.jpg" },
  { id: 7, title: "Andorinhas", description: "Viva a experiência do Circuito Andorinhas com atendimento direto da GLM.", image: "/Andorinhas.jpeg" },
  { id: 8, title: "Guarás", description: "Descubra o Circuito Guarás e consulte disponibilidade e detalhes pelo WhatsApp.", image: "/Guaras.jpg" }
];
