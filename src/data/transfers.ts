export const transfers = [
  "São Luis -> Barreirinhas",
  "São Luis -> Santo Amaro",
  "Aeroporto -> Hotel",
];

// Cada opção tem sua própria foto e preço, compartilhados entre os dois sentidos.
// Preencha image com o caminho da foto em public, por exemplo: "/transfers/barreirinhas.jpg".
// Atualize datas e horórios abaixo quando a programação estiver definida.
export const transferDetails = [
  {
    route: transfers[0],
    directions: ["São Luis -> Barreirinhas", "Barreirinhas -> São Luis"],
    image: "",
    // price: "R$ 0,00",
    summary: "Transfer privativo entre São Luis e Barreirinhas, disponível nos dois sentidos. Informe o sentido da viagem e os locais de embarque e desembarque ao solicitar seu agendamento.",
  },
  {
    route: transfers[1],
    directions: ["São Luis -> Santo Amaro", "Santo Amaro -> São Luis"],
    image: "",
    // price: "R$ 0,00",
    summary: "Transfer privativo entre São Luis e Santo Amaro, disponível nos dois sentidos. Informe o sentido da viagem e os locais de embarque e desembarque ao solicitar seu agendamento.",
  },
  {
    route: transfers[2],
    directions: ["Aeroporto -> Hotel", "Hotel -> Aeroporto"],
    image: "",
    // price: "R$ 0,00",
    summary: "Transfer privativo entre o aeroporto e seu hotel, disponível nos dois sentidos. Informe o sentido da viagem, os dados do voo e o endereço da hospedagem para combinar o embarque.",
  },
].map((transfer) => ({
  ...transfer,
  dates: "Data a combinar, sujeita à confirmação de disponibilidade.",
  times: "Horório de saída a combinar no agendamento.",
}));
