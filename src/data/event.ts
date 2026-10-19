import { EventDetails, Invitation } from "@/types/invitation";

/**
 * CONFIGURACIÓN PRINCIPAL DEL EVENTO
 * Modifica estos valores para personalizar los datos de la quinceañera y la fiesta.
 */
export const defaultEventDetails: EventDetails = {
  celebrantName: "Valentina Sofía",
  celebrantTitle: "Mis Quince Años",
  celebrantAge: 15,
  // Fecha en diciembre (formato ISO para cálculos exactos de cuenta regresiva)
  date: "2026-12-19T19:30:00",
  time: "7:30 PM",
  venueName: "Hacienda Los Rosales & Salón Cristal",
  venueAddress: "Av. Las Orquídeas #1540, Jardines del Pedregal, Ciudad de México",
  googleMapsUrl: "https://maps.google.com/?q=Av.+Las+Orquideas+1540+Jardines+del+Pedregal",
  dressCode: "Rigurosa Etiqueta / Formal Elegante",
  dressCodeDetails: "Vestido largo de noche y traje formal o smoking. Agradecemos reservar los tonos borgoña y ciruela exclusivamente para la quinceañera.",
  welcomeMessage:
    "Hay momentos en la vida que se guardan para siempre en el corazón, y este es uno de los más soñados. Te espero para compartir risas, música y una noche inolvidable.",
  emotionalQuote:
    "«Bajo un cielo estrellado y rodeada de las personas que más quiero, comienzo a escribir un nuevo y mágico capítulo de mi historia.»",
  parentsNames: {
    father: "Luis Roberto Mendoza",
    mother: "Sofía Elena Morales",
  },
  godparentsNames: "Carlos Alberto Mendoza & Mariana Vega",
  itinerary: [
    {
      time: "6:30 PM",
      title: "Misa de Acción de Gracias",
      description: "Parroquia Santa María Reina (a 5 minutos del salón)",
      iconName: "church",
    },
    {
      time: "7:30 PM",
      title: "Recepción de Bienvenida",
      description: "Cóctel de cortesía, alfombra dorada y música instrumental",
      iconName: "sparkles",
    },
    {
      time: "8:45 PM",
      title: "Entrada Real y Vals",
      description: "El tradicional vals con los padres, chambelanes y sorpresa especial",
      iconName: "music",
    },
    {
      time: "9:30 PM",
      title: "Cena de Gala de Cuatro Tiempos",
      description: "Menú especial de autor con maridaje y brindis",
      iconName: "utensils",
    },
    {
      time: "11:00 PM",
      title: "Gran Fiesta y Noche Mágica",
      description: "DJ en vivo, pista iluminada, barra de postres y sorpresas",
      iconName: "party",
    },
  ],
  giftsInfo: {
    type: "envelope",
    title: "Lluvia de Sobres",
    description:
      "Tu presencia es nuestro mejor y más valioso regalo. Si deseas tener un detalle con Valentina para su viaje soñado, dispondremos de un buzón de sobres en la entrada del salón.",
    bankDetails: "Opcional transferencia: CLABE 0123 4567 8901 2345 67 (Titular: Valentina Sofía / Cuenta de Ahorro)",
  },
  rsvpDeadline: "30 de Noviembre de 2026",
  contactPhone: "+52 55 1234 5678",
};

/**
 * DATOS DE DEMOSTRACIÓN PARA INVITACIONES
 * Cada elemento representa un enlace único accesible en /invitacion/[token]
 */
export const defaultMockInvitations: Invitation[] = [
  {
    id: "inv-001",
    token: "familia-mendoza",
    guestName: "Familia Mendoza Pérez",
    allowedGuests: 4,
    status: "pending",
    confirmedGuests: 0,
    attendees: [],
    sentAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "inv-002",
    token: "sofia-castillo",
    guestName: "Sofía Castillo & Acompañante",
    allowedGuests: 2,
    status: "confirmed",
    confirmedGuests: 2,
    attendees: ["Sofía Castillo", "Andrés Morales"],
    note: "¡Muchísimas felicidades Vale! Ya tenemos todo listo para acompañarte en tu gran noche.",
    sentAt: "2026-10-01T10:15:00Z",
    respondedAt: "2026-10-05T14:20:00Z",
  },
  {
    id: "inv-003",
    token: "carlos-ruiz",
    guestName: "Dr. Carlos Ruiz & Familia",
    allowedGuests: 3,
    status: "pending",
    confirmedGuests: 0,
    sentAt: "2026-10-02T11:00:00Z",
  },
  {
    id: "inv-004",
    token: "tia-elena",
    guestName: "Tía Elena & Familia Gómez",
    allowedGuests: 5,
    status: "pending",
    confirmedGuests: 0,
    sentAt: "2026-10-02T11:30:00Z",
  },
  {
    id: "inv-005",
    token: "mateo-fernandez",
    guestName: "Mateo Fernández",
    allowedGuests: 1,
    status: "declined",
    confirmedGuests: 0,
    note: "Querida Vale, me coincide con un viaje escolar fuera del país. Te mando un abrazo enorme y mis mejores deseos.",
    sentAt: "2026-10-03T09:00:00Z",
    respondedAt: "2026-10-06T18:10:00Z",
  },
  {
    id: "inv-006",
    token: "familia-alvarez",
    guestName: "Ing. Javier Álvarez y Sra.",
    allowedGuests: 2,
    status: "pending",
    confirmedGuests: 0,
    sentAt: "2026-10-03T12:00:00Z",
  },
];
