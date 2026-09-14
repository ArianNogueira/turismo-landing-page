export type Tour = {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
};

export const tours: Tour[] = [
  {
    id: 1,
    title: "Circuito Lagoas",
    description: "Dunas, lagoas cristalinas e paradas estratégicas para banho e contemplação.",
    duration: "3 horas",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Passeio 4x4",
    description: "Uma experiência de aventura por paisagens naturais e caminhos inesquecíveis.",
    duration: "Meio período",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Pôr do Sol",
    description: "Finalize o dia diante de um dos cenários mais bonitos do Maranhão.",
    duration: "Tarde",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
  }
];
