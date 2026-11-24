import type { MenuCategoryId, MenuItem, SeatingZone } from '../types/restaurant';

export const RESTAURANT_INFO = {
  name: 'El Peñol Paisa',
  fullTitle: 'Restaurante Colombiano El Peñol Paisa',
  coordinates: {
    lat: 40.1252648,
    lng: -3.6749503,
    label: '40.1253° N, 3.6750° W',
  },
  googleMapsUrl:
    'https://www.google.com/maps/place/Restaurante+Colombiano+El+Pe%C3%B1ol+Paisa/@40.1259481,-3.6697521,1758m/data=!3m1!1e3!4m6!3m5!1s0xd421d5650ba5a9b:0x7d0e9ac95b0cd53f!8m2!3d40.1252648!4d-3.6749503!16s%2Fg%2F11nhwnq2sy?entry=ttu',
  phoneDisplay: '+34 918 08 42 19',
  email: 'reservas@elpenolpaisa.es',
  images: {
    hero: '/src/assets/images/hero_bandeja_paisa_1795528476601.jpg',
    empanadas: '/src/assets/images/dish_empanadas_criollas_1795528477609.jpg',
    ajiaco: '/src/assets/images/dish_ajiaco_sopa_1795528478545.jpg',
    jugos: '/src/assets/images/dish_jugos_tropicales_1795528479197.jpg',
    interior: '/src/assets/images/team_el_penol.jpg',
  },
} as const;

export const MENU_CATEGORIES: readonly {
  id: MenuCategoryId;
  label: { es: string; en: string };
  subtitle: { es: string; en: string };
}[] = [
  {
    id: 'tipicos',
    label: { es: 'Platos Típicos', en: 'Signature Plates' },
    subtitle: {
      es: 'Recetas tradicionales de Antioquia preparadas a fuego lento cada mañana.',
      en: 'Traditional Antioquian classics simmered fresh each morning.',
    },
  },
  {
    id: 'entrantes',
    label: { es: 'Entrantes y Arepas', en: 'Starters & Arepas' },
    subtitle: {
      es: 'Maíz trillado molido en casa, chicharrón crujiente y ají artesanal.',
      en: 'Stone-ground corn arepas, crisp chicharrón, and house-made ají.',
    },
  },
  {
    id: 'sopas',
    label: { es: 'Sopas y Cazuelas', en: 'Soups & Cazuelas' },
    subtitle: {
      es: 'Caldos de cuchara reconfortantes servidos en barro negro tradicional.',
      en: 'Hearty regional soups and stews served in black clay stoneware.',
    },
  },
  {
    id: 'brasa',
    label: { es: 'Brasa y Mar', en: 'Grill & Coast' },
    subtitle: {
      es: 'Cortes madurados al carbón y pescados con sabor del Pacífico colombiano.',
      en: 'Charcoal-grilled cuts and coastal fish with coconut rice.',
    },
  },
  {
    id: 'bebidas',
    label: { es: 'Bebidas y Postres', en: 'Drinks & Desserts' },
    subtitle: {
      es: 'Pulpa de fruta tropical importada, café de origen y dulces de la abuela.',
      en: 'Freshly pressed Colombian tropical juices, single-origin coffee, and sweets.',
    },
  },
];

export const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 'bandeja-paisa',
    category: 'tipicos',
    name: { es: 'Bandeja Paisa Tradicional', en: 'Traditional Bandeja Paisa' },
    description: {
      es: 'Frijoles cargamanto cocidos con plátano, arroz blanco, chicharrón carnudo crocante, carne molida o asada, chorizo antioqueño, huevo frito, tajada madura, aguacate y arepa.',
      en: 'Slow-simmered red cargamanto beans, white rice, crispy pork belly chicharrón, grilled or minced beef, Antioquian chorizo, fried egg, sweet plantain, avocado, and corn arepa.',
    },
    ingredients: {
      es: 'Frijol cargamanto, panceta de cerdo, ternera, chorizo artesano, maíz blanco, aguacate Hass',
      en: 'Red cargamanto beans, pork belly, beef flank, artisanal chorizo, white corn, Hass avocado',
    },
    pairing: {
      es: 'Jugo natural de maracuyá o cerveza artesanal tostada',
      en: 'Fresh passionfruit juice or toasted amber lager',
    },
    priceEur: 18.9,
    flags: ['gluten-free', 'signature'],
    allergens: { es: 'Huevo', en: 'Egg' },
    image: RESTAURANT_INFO.images.hero,
  },
  {
    id: 'cazuela-frijoles',
    category: 'tipicos',
    name: { es: 'Cazuela de Frijoles El Peñol', en: 'El Peñol Bean Cazuela' },
    description: {
      es: 'Frijoles antioqueños cremosos servidos en cazuela de barro con chicharrón troceado, maduro en cuadritos, aguacate, maicitos dulces y ripio de patata.',
      en: 'Creamy Antioquian red beans in clay pot topped with diced crispy pork belly, sweet plantain cubes, avocado, sweet corn, and crisp potato shoestrings.',
    },
    ingredients: {
      es: 'Frijol rojo, plátano maduro, chicharrón, maíz dulce, hogao de tomate y cebolla larga',
      en: 'Red beans, ripe plantain, pork belly, sweet corn, tomato-scallion hogao',
    },
    pairing: {
      es: 'Limonada de coco recién batida',
      en: 'Blended coconut limeade',
    },
    priceEur: 15.5,
    flags: ['gluten-free', 'signature'],
    allergens: { es: 'Sin alérgenos mayores', en: 'No major allergens' },
  },
  {
    id: 'sobrebarriga-criolla',
    category: 'tipicos',
    name: { es: 'Sobrebarriga en Salsa Criolla', en: 'Braised Flank in Creole Sauce' },
    description: {
      es: 'Corte de ternera cocinado a fuego lento durante cuatro horas en hogao casero, servido con patata chorreada con queso, yuca al vapor y arroz.',
      en: 'Beef flank braised for four hours in slow-cooked tomato and scallion hogao, served with cheese-glazed potato, steamed yuca, and white rice.',
    },
    ingredients: {
      es: 'Falda de ternera, tomate maduro, cebolla de verdeo, comino, queso campesino, yuca',
      en: 'Beef flank, ripe tomato, scallion, cumin, queso campesino, yuca root',
    },
    pairing: {
      es: 'Copa de Ribera del Duero joven o jugo de mora',
      en: 'Young Ribera del Duero red wine or blackberry juice',
    },
    priceEur: 17.5,
    flags: ['gluten-free'],
    allergens: { es: 'Lácteos', en: 'Dairy' },
  },
  {
    id: 'arroz-paisa',
    category: 'tipicos',
    name: { es: 'Arroz Paisa de la Casa', en: 'House Paisa Rice' },
    description: {
      es: 'Arroz salteado al wok con costilla desmechada, chorizo antioqueño, chicharrón, maíz tierno, verduras frescas y láminas de plátano maduro.',
      en: 'Wok-seared rice tossed with pulled pork ribs, Antioquian chorizo, chicharrón, sweet corn, garden vegetables, and sweet plantain.',
    },
    ingredients: {
      es: 'Arroz grano largo, costilla de cerdo, chorizo, maicitos, salsa de soja suave, maduro',
      en: 'Long-grain rice, pork rib, chorizo, sweet corn, light soy glaze, plantain',
    },
    pairing: {
      es: 'Jugo de lulo bien frío',
      en: 'Chilled lulo juice',
    },
    priceEur: 16.5,
    flags: [],
    allergens: { es: 'Soja', en: 'Soy' },
  },
  {
    id: 'empanadas-criollas',
    category: 'entrantes',
    name: { es: 'Empanadas Antioqueñas (4 uds)', en: 'Antioquian Corn Empanadas (4 pcs)' },
    description: {
      es: 'Masa fina de maíz amarillo rellena de carne desmechada y patata sabanera sazonada con hogao, acompañadas de ají verde picante de cilantro y lima.',
      en: 'Crisp yellow-corn pastry filled with slow-braised beef and spiced potato, served with house cilantro ají and fresh lime.',
    },
    ingredients: {
      es: 'Maíz amarillo, carne de res desmechada, patata, cilantro, ají rocoto suave',
      en: 'Yellow corn masa, shredded beef, potato, fresh cilantro, mild chili ají',
    },
    pairing: {
      es: 'Cerveza colombiana fría o refajo',
      en: 'Chilled Colombian lager or refajo',
    },
    priceEur: 7.8,
    flags: ['gluten-free', 'signature'],
    allergens: { es: 'Sin alérgenos mayores', en: 'No major allergens' },
    image: RESTAURANT_INFO.images.empanadas,
  },
  {
    id: 'chicharron-patacon',
    category: 'entrantes',
    name: { es: 'Chicharrón con Patacón y Guacamole', en: 'Crispy Chicharrón & Patacón' },
    description: {
      es: 'Tira gruesa de panceta dorada al punto justo de crujiente sobre tostones de plátano verde prensado y guacamole fresco con pico de gallo.',
      en: 'Thick-cut crackling pork belly served over twice-fried green plantain tostones and fresh avocado guacamole.',
    },
    ingredients: {
      es: 'Panceta de cerdo, plátano verde macho, aguacate, lima, tomate, cilantro',
      en: 'Pork belly, green plantain, avocado, lime, tomato, cilantro',
    },
    pairing: {
      es: 'Limonada natural con panela',
      en: 'Fresh limeade sweetened with panela',
    },
    priceEur: 11.5,
    flags: ['gluten-free'],
    allergens: { es: 'Sin alérgenos mayores', en: 'No major allergens' },
  },
  {
    id: 'arepa-queso-hogao',
    category: 'entrantes',
    name: { es: 'Arepa de Chocolo con Queso Campesino', en: 'Sweet Corn Arepa with Queso Campesino' },
    description: {
      es: 'Arepa tierna de maíz dulce asada a la plancha, rellena de queso fresco fundido y acompañada de mantequilla artesanal.',
      en: 'Griddled sweet-corn arepa layered with warm queso campesino and cultured butter.',
    },
    ingredients: {
      es: 'Maíz tierno dulce, queso campesino fresco, mantequilla, pizca de panela',
      en: 'Sweet corn, fresh queso campesino, butter, touch of raw panela',
    },
    pairing: {
      es: 'Café colombiano filtrado o chocolate santafereño',
      en: 'Colombian pour-over coffee or hot cocoa',
    },
    priceEur: 6.9,
    flags: ['gluten-free', 'vegetarian'],
    allergens: { es: 'Lácteos', en: 'Dairy' },
  },
  {
    id: 'patacones-vegetarianos',
    category: 'entrantes',
    name: { es: 'Patacones con Hogao y Queso Fresco', en: 'Green Plantain Tostones with Hogao' },
    description: {
      es: 'Cuatro patacones crujientes coronados con sofrito lento de tomate y cebolla larga, queso costeño rallado y aguacate.',
      en: 'Four crisp green plantain rounds topped with slow-cooked tomato hogao, grated coastal cheese, and avocado.',
    },
    ingredients: {
      es: 'Plátano verde, tomate pera, cebolla larga, queso fresco, aguacate',
      en: 'Green plantain, plum tomato, scallion, fresh cheese, avocado',
    },
    pairing: {
      es: 'Jugo de guanábana en agua',
      en: 'Fresh soursop juice',
    },
    priceEur: 8.5,
    flags: ['gluten-free', 'vegetarian'],
    allergens: { es: 'Lácteos', en: 'Dairy' },
  },
  {
    id: 'ajiaco-santafereño',
    category: 'sopas',
    name: { es: 'Ajiaco Santafereño', en: 'Bogotá-Style Ajiaco Soup' },
    description: {
      es: 'Sopa insignia de tres variedades de patata y guascas aromáticas con pechuga de pollo desmechada y mazorca dulce, servida con crema de leche, alcaparras, arroz y aguacate.',
      en: 'Iconic triple-potato chicken soup infused with aromatic guascas herb and sweet corn on the cob, accompanied by crema, capers, white rice, and avocado.',
    },
    ingredients: {
      es: 'Papa criolla, papa sabanera, pollo de corral, guascas, mazorca, alcaparras',
      en: 'Yellow criolla potato, white potato, free-range chicken, guascas herb, corn, capers',
    },
    pairing: {
      es: 'Jugo natural de feijoa o agua con gas y lima',
      en: 'Fresh feijoa juice or sparkling lime water',
    },
    priceEur: 15.9,
    flags: ['gluten-free', 'signature'],
    allergens: { es: 'Lácteos', en: 'Dairy' },
    image: RESTAURANT_INFO.images.ajiaco,
  },
  {
    id: 'sancocho-trifasico',
    category: 'sopas',
    name: { es: 'Sancocho de Costilla y Yuca', en: 'Colombian Beef Rib Sancocho' },
    description: {
      es: 'Caldo tradicional cocinado a fuego lento con costilla de res, yuca harinosa, plátano verde, patata, cilantro cimarrón y arroz blanco de guarnición.',
      en: 'Slow-simmered broth of beef short rib, tender yuca, green plantain, potato, and wild cilantro, served with white rice and avocado.',
    },
    ingredients: {
      es: 'Costilla de ternera, yuca, plátano verde, mazorca, cilantro, cebolla larga',
      en: 'Beef rib, yuca root, green plantain, corn, cilantro, scallion',
    },
    pairing: {
      es: 'Refajo tradicional o aguapanela fría con limón',
      en: 'Traditional refajo or chilled panela limeade',
    },
    priceEur: 16.5,
    flags: ['gluten-free'],
    allergens: { es: 'Sin alérgenos mayores', en: 'No major allergens' },
  },
  {
    id: 'churrasco-paisa',
    category: 'brasa',
    name: { es: 'Churrasco Antioqueño a la Brasa', en: 'Charcoal-Grilled Antioquian Churrasco' },
    description: {
      es: 'Lomo alto de ternera de 320g asado al carbón con chimichurri de cilantro, acompañado de patata asada con hogao, ensalada fresca y arepa con queso.',
      en: '320g prime beef striploin grilled over charcoal with cilantro chimichurri, served with hogao potato, garden salad, and cheese arepa.',
    },
    ingredients: {
      es: 'Lomo alto madurado, sal marina, cilantro, ajo confitado, arepa de maíz',
      en: 'Aged beef striploin, sea salt, cilantro, confit garlic, corn arepa',
    },
    pairing: {
      es: 'Vino tinto Rioja Crianza',
      en: 'Rioja Crianza red wine',
    },
    priceEur: 21.5,
    flags: ['gluten-free'],
    allergens: { es: 'Lácteos (en la arepa)', en: 'Dairy (in arepa)' },
  },
  {
    id: 'mojarra-frita-coco',
    category: 'brasa',
    name: { es: 'Mojarra Dorada con Arroz de Coco', en: 'Crispy Whole Tilapia & Coconut Rice' },
    description: {
      es: 'Pescado entero marinado en ajo y lima frito hasta quedar crujiente, acompañado de arroz cremoso de coco con pasas, patacones y ensalada de aguacate.',
      en: 'Whole lime-and-garlic marinated fish fried crisp, paired with sweet coconut rice, green plantain tostones, and avocado salad.',
    },
    ingredients: {
      es: 'Mojarra fresca entera, leche de coco natural, arroz, plátano verde, lima',
      en: 'Whole fresh fish, natural coconut milk, rice, green plantain, lime',
    },
    pairing: {
      es: 'Limonada de hierbabuena o vino blanco Albariño',
      en: 'Mint limeade or crisp Albariño white wine',
    },
    priceEur: 18.2,
    flags: ['gluten-free'],
    allergens: { es: 'Pescado', en: 'Fish' },
  },
  {
    id: 'jugos-naturales',
    category: 'bebidas',
    name: { es: 'Jugos Tropicales (Lulo, Maracuyá, Mora o Guanábana)', en: 'Colombian Fruit Juices (Lulo, Passionfruit, Blackberry, Soursop)' },
    description: {
      es: 'Batidos al momento con pulpa de fruta colombiana 100% natural, preparados en agua fría o en leche entera.',
      en: 'Blended to order from 100% authentic Colombian fruit pulp, prepared with chilled water or whole milk.',
    },
    ingredients: {
      es: 'Pulpa natural de fruta tropical, hielo picado, toque opcional de azúcar de caña',
      en: 'Pure tropical fruit pulp, crushed ice, optional touch of cane sugar',
    },
    pairing: {
      es: 'Ideal para acompañar cualquier plato típico',
      en: 'Pairs naturally with any signature plate',
    },
    priceEur: 4.5,
    flags: ['gluten-free', 'vegetarian', 'signature'],
    allergens: { es: 'Lácteos (solo si se pide en leche)', en: 'Dairy (only if ordered with milk)' },
    image: RESTAURANT_INFO.images.jugos,
  },
  {
    id: 'limonada-coco',
    category: 'bebidas',
    name: { es: 'Limonada de Coco Cremosa', en: 'Creamy Coconut Limeade' },
    description: {
      es: 'Clásico refrescante de Cartagena elaborado con zumo de lima fresca y crema de coco natural triturada con hielo.',
      en: 'Cartagena coastal favorite blended with fresh-squeezed lime juice, natural coconut cream, and ice.',
    },
    ingredients: {
      es: 'Lima fresca, crema de coco, hielo, ralladura de lima',
      en: 'Fresh lime, coconut cream, ice, lime zest',
    },
    pairing: {
      es: 'Perfecta con Mojarra o Chicharrón',
      en: 'Ideal alongside Crispy Fish or Chicharrón',
    },
    priceEur: 5.2,
    flags: ['gluten-free', 'vegetarian'],
    allergens: { es: 'Sin alérgenos mayores', en: 'No major allergens' },
  },
  {
    id: 'tres-leches',
    category: 'bebidas',
    name: { es: 'Torta Tres Leches Artesanal', en: 'House Tres Leches Cake' },
    description: {
      es: 'Bizcocho esponjoso empapado en tres leches con vainilla de Madagascar, coronado con merengue italiano ligeramente tostado y canela.',
      en: 'Sponge cake soaked in three milks infused with vanilla, finished with torched Italian meringue and cinnamon.',
    },
    ingredients: {
      es: 'Leche evaporada, leche condensada, nata, huevo, harina de trigo, vainilla',
      en: 'Evaporated milk, condensed milk, cream, egg, wheat flour, vanilla',
    },
    pairing: {
      es: 'Tinto colombiano (café espresso largo de Antioquia)',
      en: 'Colombian tinto (Antioquian black coffee)',
    },
    priceEur: 6.2,
    flags: ['vegetarian'],
    allergens: { es: 'Lácteos, Huevo, Gluten', en: 'Dairy, Egg, Gluten' },
  },
];

export const SEATING_ZONES: readonly {
  id: SeatingZone;
  label: { es: string; en: string };
  description: { es: string; en: string };
}[] = [
  {
    id: 'salon',
    label: { es: 'Salón Principal', en: 'Main Dining Room' },
    description: {
      es: 'Mesas amplias de nogal junto a nuestra cocina vista y ambiente cálido.',
      en: 'Spacious walnut tables near our open kitchen in a warm candlelit room.',
    },
  },
  {
    id: 'terraza',
    label: { es: 'Terraza Cubierta', en: 'Covered Terrace' },
    description: {
      es: 'Espacio luminoso y ventilado ideal para comidas familiares y sobremesas.',
      en: 'Airy sheltered terrace suited for family lunches and relaxed evenings.',
    },
  },
  {
    id: 'barra',
    label: { es: 'Barra de Jugos y Tapas', en: 'Bar & Antojitos Counter' },
    description: {
      es: 'Asientos altos para disfrutar empanadas, arepas y cócteles de fruta fresca.',
      en: 'High-top counter seating for empanadas, arepas, and fresh tropical drinks.',
    },
  },
];

export const OPENING_HOURS = [
  {
    days: { es: 'Martes a Jueves', en: 'Tuesday – Thursday' },
    hours: '13:00 – 16:30 · 20:00 – 23:30',
  },
  {
    days: { es: 'Viernes y Sábado', en: 'Friday – Saturday' },
    hours: '13:00 – 17:00 · 20:00 – 00:30',
  },
  {
    days: { es: 'Domingo', en: 'Sunday' },
    hours: '12:30 – 17:30 · 20:00 – 23:00',
  },
  {
    days: { es: 'Lunes', en: 'Monday' },
    hours: { es: 'Cerrado por descanso', en: 'Closed' },
  },
] as const;

export const UI_COPY = {
  es: {
    nav: {
      story: 'Historia',
      menu: 'La Carta',
      reservations: 'Reservas',
      location: 'Ubicación',
      bookCta: 'Reservar Mesa',
    },
    hero: {
      kicker: 'Seseña, Toledo · Cocina Tradicional Antioqueña',
      title: 'El sabor auténtico de Antioquia en cada mesa',
      subtitle:
        'Bandeja Paisa de fogón lento, arepas de maíz trillado y jugos tropicales recién batidos. Un rincón colombiano diseñado para compartir sin prisas.',
      primaryCta: 'Reservar Mesa',
      secondaryCta: 'Explorar la Carta',
      highlights: [
        { label: 'Horario de cocina', value: 'Mar – Dom · Comidas y Cenas' },
        { label: 'Elaboración diaria', value: 'Maíz molido y hogao artesanal' },
        { label: 'Ubicación', value: 'Seseña · A-4 Salida 36' },
      ],
    },
    story: {
      kicker: 'Nuestra Casa',
      title: 'Tradición paisa hecha a fuego lento',
      lead: 'Inspirados en la piedra del Peñol y la calidez de los hogares antioqueños, preparamos cada plato desde cero con ingredientes de origen colombiano y producto fresco de cercanía.',
      pillars: [
        {
          index: '01.',
          title: 'Fogón Antioqueño',
          body: 'Frijoles cargamanto cocidos durante horas con plátano y costilla, chicharrón crocante al corte y sopas servidas en barro negro.',
        },
        {
          index: '02.',
          title: 'Maíz y Fruta de Origen',
          body: 'Arepas prensadas al momento y pulpa 100% natural de lulo, maracuyá, guanábana y mora traída directamente de fincas colombianas.',
        },
        {
          index: '03.',
          title: 'Hospitalidad sin Prisas',
          body: 'Salón cálido, terraza cubierta y atención cercana pensada tanto para comidas familiares como para celebraciones especiales.',
        },
      ],
    },
    menu: {
      kicker: 'Carta Digital',
      title: 'Sabores de Colombia, plato a plato',
      subtitle:
        'Explora nuestra carta completa con notas de ingredientes, alérgenos y maridajes recomendados.',
      allCategories: 'Todos',
      searchPlaceholder: 'Buscar plato, ingrediente o sabor...',
      dietaryAll: 'Todos',
      dietaryGf: 'Sin Gluten',
      dietaryVeg: 'Vegetariano',
      clearFilters: 'Limpiar filtros',
      emptyTitle: 'No encontramos platos con esos filtros',
      emptyBody: 'Prueba con otro término de búsqueda o restablece los filtros activos.',
      showingCount: (n: number) => `${n} ${n === 1 ? 'plato disponible' : 'platos disponibles'}`,
      signatureLabel: 'Especialidad',
      gfLabel: 'Sin Gluten',
      vegLabel: 'Vegetariano',
      viewDetail: 'Ver detalles',
      ingredientsLabel: 'Ingredientes principales',
      pairingLabel: 'Maridaje sugerido',
      allergensLabel: 'Alérgenos',
      reserveFromDish: 'Reservar mesa para probarlo',
      closeModal: 'Cerrar ficha',
    },
    reservations: {
      kicker: 'Reservas Online',
      title: 'Asegura tu mesa en segundos',
      subtitle:
        'Consulta la disponibilidad en tiempo real por zona y horario, y recibe confirmación inmediata con código de gestión.',
      tabNew: 'Nueva Reserva',
      tabManage: 'Consultar / Cancelar',
      stepWhen: '1. Fecha, comensales y zona',
      dateLabel: 'Fecha',
      guestsLabel: 'Comensales',
      guestSingular: 'persona',
      guestPlural: 'personas',
      zoneLabel: 'Zona del restaurante',
      stepTime: '2. Horario disponible',
      lunchTitle: 'Servicio de Mediodía',
      dinnerTitle: 'Servicio de Noche',
      seatsLeft: (n: number) => `${n} plazas`,
      fullLabel: 'Completo',
      stepDetails: '3. Datos de contacto',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Ej. Camila Restrepo',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'nombre@ejemplo.com',
      phoneLabel: 'Teléfono de contacto',
      phonePlaceholder: '+34 600 000 000',
      notesLabel: 'Alergias o notas de ocasión (opcional)',
      notesPlaceholder: 'Ej. Cumpleaños, trona para bebé, intolerancia...',
      submitBtn: 'Confirmar Reserva',
      submittingBtn: 'Confirmando mesa...',
      confirmedTitle: 'Mesa confirmada',
      confirmedSubtitle:
        'Guarda tu código de reserva para consultar o modificar tu cita en cualquier momento.',
      codeLabel: 'Código de reserva',
      downloadIcs: 'Añadir al calendario (.ics)',
      newBookingBtn: 'Hacer otra reserva',
      manageBookingBtn: 'Gestionar esta reserva',
      lookupTitle: 'Consulta o cancela tu reserva',
      lookupSubtitle:
        'Introduce el código de confirmación que recibiste al reservar (por ejemplo, EPP-4821).',
      lookupLabel: 'Código de confirmación',
      lookupPlaceholder: 'EPP-XXXX',
      lookupBtn: 'Buscar Reserva',
      searchingBtn: 'Buscando...',
      cancelBtn: 'Cancelar Reserva',
      cancellingBtn: 'Cancelando...',
      statusConfirmed: 'Confirmada',
      statusCancelled: 'Cancelada',
      notFoundError: 'No encontramos ninguna reserva con ese código.',
    },
    location: {
      kicker: 'Visítanos',
      title: 'En el corazón de Seseña, a minutos de Madrid Sur',
      subtitle:
        'Fácil acceso desde la A-4 (Salida 36) y aparcamiento en las inmediaciones.',
      addressTitle: 'Ubicación verificada',
      addressText: 'Restaurante Colombiano El Peñol Paisa · Seseña, Toledo',
      hoursTitle: 'Horario de Apertura',
      contactTitle: 'Contacto directo',
      openMapsBtn: 'Abrir en Google Maps',
      reserveBtn: 'Reservar Mesa',
    },
    footer: {
      tagline: 'Cocina tradicional colombiana en Seseña, Toledo.',
      rights: '© 2026 Restaurante Colombiano El Peñol Paisa.',
    },
  },
  en: {
    nav: {
      story: 'Our Story',
      menu: 'Digital Menu',
      reservations: 'Reservations',
      location: 'Location',
      bookCta: 'Book a Table',
    },
    hero: {
      kicker: 'Seseña, Toledo · Authentic Antioquian Kitchen',
      title: 'The warmth of Colombia at every table',
      subtitle:
        'Slow-simmered Bandeja Paisa, hand-pressed corn arepas, and freshly blended tropical juices. Traditional hospitality crafted without rush.',
      primaryCta: 'Book a Table',
      secondaryCta: 'Explore the Menu',
      highlights: [
        { label: 'Kitchen Hours', value: 'Tue – Sun · Lunch & Dinner' },
        { label: 'Made Fresh Daily', value: 'Stone-ground corn & hogao' },
        { label: 'Location', value: 'Seseña · A-4 Exit 36' },
      ],
    },
    story: {
      kicker: 'Our Kitchen',
      title: 'Paisa heritage simmered slow',
      lead: 'Inspired by the rock of El Peñol and Antioquian family tables, every dish is prepared from scratch using authentic Colombian staples and fresh local produce.',
      pillars: [
        {
          index: '01.',
          title: 'Antioquian Hearth',
          body: 'Red cargamanto beans simmered for hours, crisp pork belly chicharrón, and comforting soups served in black clay cazuelas.',
        },
        {
          index: '02.',
          title: 'Single-Origin Staples',
          body: 'Griddled white and sweet-corn arepas alongside 100% natural lulo, passionfruit, soursop, and blackberry fruit pulps.',
        },
        {
          index: '03.',
          title: 'Unrushed Hospitality',
          body: 'Warm walnut dining room, sheltered terrace, and attentive service suited for both Sunday family lunches and intimate dinners.',
        },
      ],
    },
    menu: {
      kicker: 'Digital Menu',
      title: 'Colombian classics, dish by dish',
      subtitle:
        'Browse our full menu with key ingredients, allergen notes, and suggested drink pairings.',
      allCategories: 'All',
      searchPlaceholder: 'Search dish, ingredient, or flavor...',
      dietaryAll: 'All',
      dietaryGf: 'Gluten-Free',
      dietaryVeg: 'Vegetarian',
      clearFilters: 'Clear filters',
      emptyTitle: 'No dishes match those filters',
      emptyBody: 'Try another search term or reset your active dietary filters.',
      showingCount: (n: number) => `${n} ${n === 1 ? 'dish available' : 'dishes available'}`,
      signatureLabel: 'House Signature',
      gfLabel: 'Gluten-Free',
      vegLabel: 'Vegetarian',
      viewDetail: 'View details',
      ingredientsLabel: 'Key ingredients',
      pairingLabel: 'Suggested pairing',
      allergensLabel: 'Allergens',
      reserveFromDish: 'Book a table for this dish',
      closeModal: 'Close details',
    },
    reservations: {
      kicker: 'Online Reservations',
      title: 'Reserve your table in seconds',
      subtitle:
        'Check real-time seating availability by zone and service time, and receive an instant confirmation code.',
      tabNew: 'New Reservation',
      tabManage: 'Lookup / Cancel',
      stepWhen: '1. Date, party size & seating',
      dateLabel: 'Date',
      guestsLabel: 'Party size',
      guestSingular: 'guest',
      guestPlural: 'guests',
      zoneLabel: 'Dining area',
      stepTime: '2. Available service times',
      lunchTitle: 'Lunch Service',
      dinnerTitle: 'Dinner Service',
      seatsLeft: (n: number) => `${n} seats left`,
      fullLabel: 'Full',
      stepDetails: '3. Guest contact details',
      nameLabel: 'Full name',
      namePlaceholder: 'e.g. Camila Restrepo',
      emailLabel: 'Email address',
      emailPlaceholder: 'name@example.com',
      phoneLabel: 'Phone number',
      phonePlaceholder: '+34 600 000 000',
      notesLabel: 'Allergies or occasion notes (optional)',
      notesPlaceholder: 'e.g. Birthday, high chair needed, dietary request...',
      submitBtn: 'Confirm Reservation',
      submittingBtn: 'Confirming table...',
      confirmedTitle: 'Reservation confirmed',
      confirmedSubtitle:
        'Save your confirmation code to review or cancel your booking at any time.',
      codeLabel: 'Confirmation code',
      downloadIcs: 'Add to calendar (.ics)',
      newBookingBtn: 'Book another table',
      manageBookingBtn: 'Manage this booking',
      lookupTitle: 'Look up or cancel your booking',
      lookupSubtitle:
        'Enter the confirmation code provided when you booked (for example, EPP-4821).',
      lookupLabel: 'Confirmation code',
      lookupPlaceholder: 'EPP-XXXX',
      lookupBtn: 'Find Reservation',
      searchingBtn: 'Searching...',
      cancelBtn: 'Cancel Reservation',
      cancellingBtn: 'Cancelling...',
      statusConfirmed: 'Confirmed',
      statusCancelled: 'Cancelled',
      notFoundError: 'We could not find a reservation with that code.',
    },
    location: {
      kicker: 'Visit Us',
      title: 'In Seseña, minutes from South Madrid',
      subtitle:
        'Easy access via the A-4 highway (Exit 36) with street parking nearby.',
      addressTitle: 'Verified Location',
      addressText: 'Restaurante Colombiano El Peñol Paisa · Seseña, Toledo',
      hoursTitle: 'Opening Hours',
      contactTitle: 'Direct Contact',
      openMapsBtn: 'Open in Google Maps',
      reserveBtn: 'Book a Table',
    },
    footer: {
      tagline: 'Traditional Colombian dining in Seseña, Toledo.',
      rights: '© 2026 Restaurante Colombiano El Peñol Paisa.',
    },
  },
} as const;
