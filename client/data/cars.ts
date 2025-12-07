export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "Automatic" | "Manual";
  fuelType: "Gasoline" | "Electric" | "Hybrid" | "Diesel";
  condition: "New" | "Excellent" | "Good" | "Fair";
  description: string;
  imageUrl: string;
  specs: {
    engine: string;
    horsepower: number;
    topSpeed: string;
    acceleration: string;
  };
}

export const CARS: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "911 Carrera",
    year: 2024,
    price: 115000,
    mileage: 1200,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "New",
    description: "Iconic sports car with timeless design and exhilarating performance. Features premium leather interior and state-of-the-art technology.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    specs: { engine: "3.0L Twin-Turbo Flat-6", horsepower: 379, topSpeed: "182 mph", acceleration: "4.0s 0-60" },
  },
  {
    id: "2",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    price: 89990,
    mileage: 500,
    transmission: "Automatic",
    fuelType: "Electric",
    condition: "New",
    description: "The quickest production car ever made. Features tri-motor all-wheel drive and an incredible 390-mile range.",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
    specs: { engine: "Tri Motor Electric", horsepower: 1020, topSpeed: "200 mph", acceleration: "1.99s 0-60" },
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2024,
    price: 118300,
    mileage: 3200,
    transmission: "Automatic",
    fuelType: "Hybrid",
    condition: "Excellent",
    description: "The pinnacle of luxury sedans with cutting-edge technology and unmatched comfort. Features executive rear seating package.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    specs: { engine: "3.0L I6 Turbo + Electric", horsepower: 429, topSpeed: "130 mph", acceleration: "4.9s 0-60" },
  },
  {
    id: "4",
    make: "BMW",
    model: "M4 Competition",
    year: 2023,
    price: 84500,
    mileage: 8500,
    transmission: "Manual",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Track-ready performance with everyday usability. Carbon fiber roof and aggressive styling make it stand out.",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    specs: { engine: "3.0L Twin-Turbo I6", horsepower: 503, topSpeed: "180 mph", acceleration: "3.8s 0-60" },
  },
  {
    id: "5",
    make: "Range Rover",
    model: "Sport",
    year: 2024,
    price: 95000,
    mileage: 2100,
    transmission: "Automatic",
    fuelType: "Diesel",
    condition: "New",
    description: "Commanding presence with genuine off-road capability and luxurious on-road comfort. Perfect blend of sport and utility.",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    specs: { engine: "3.0L I6 Diesel", horsepower: 346, topSpeed: "140 mph", acceleration: "5.8s 0-60" },
  },
  {
    id: "6",
    make: "Audi",
    model: "RS e-tron GT",
    year: 2024,
    price: 142500,
    mileage: 800,
    transmission: "Automatic",
    fuelType: "Electric",
    condition: "New",
    description: "Electric performance at its finest. Stunning design with Porsche Taycan underpinnings and Audi luxury.",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800",
    specs: { engine: "Dual Motor Electric", horsepower: 637, topSpeed: "155 mph", acceleration: "3.1s 0-60" },
  },
  {
    id: "7",
    make: "Ford",
    model: "Mustang GT",
    year: 2024,
    price: 55000,
    mileage: 4500,
    transmission: "Manual",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "American muscle icon with modern technology. V8 rumble meets contemporary design.",
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5f82bd6d3?w=800",
    specs: { engine: "5.0L V8", horsepower: 486, topSpeed: "168 mph", acceleration: "4.1s 0-60" },
  },
  {
    id: "8",
    make: "Lamborghini",
    model: "Huracán EVO",
    year: 2023,
    price: 268000,
    mileage: 2800,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Italian supercar excellence. Naturally aspirated V10 delivers pure driving emotion and head-turning presence.",
    imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    specs: { engine: "5.2L V10", horsepower: 631, topSpeed: "202 mph", acceleration: "2.9s 0-60" },
  },
  {
    id: "9",
    make: "Chevrolet",
    model: "Corvette Stingray",
    year: 2024,
    price: 67500,
    mileage: 1800,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "New",
    description: "Mid-engine American sports car that punches well above its weight class. Incredible value for supercar performance.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    specs: { engine: "6.2L V8", horsepower: 490, topSpeed: "194 mph", acceleration: "2.9s 0-60" },
  },
  {
    id: "10",
    make: "Rivian",
    model: "R1T",
    year: 2024,
    price: 73000,
    mileage: 6200,
    transmission: "Automatic",
    fuelType: "Electric",
    condition: "Excellent",
    description: "Adventure-ready electric truck with innovative features like the gear tunnel and camp kitchen. The future of outdoor exploration.",
    imageUrl: "https://images.unsplash.com/photo-1671801823956-2fb0f28e1e86?w=800",
    specs: { engine: "Quad Motor Electric", horsepower: 835, topSpeed: "110 mph", acceleration: "3.0s 0-60" },
  },
  {
    id: "11",
    make: "Porsche",
    model: "Taycan Turbo S",
    year: 2024,
    price: 187400,
    mileage: 1500,
    transmission: "Automatic",
    fuelType: "Electric",
    condition: "New",
    description: "Electric performance sedan that proves EVs can be thrilling. Launch control delivers repeatable sub-3-second sprints.",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
    specs: { engine: "Dual Motor Electric", horsepower: 750, topSpeed: "162 mph", acceleration: "2.6s 0-60" },
  },
  {
    id: "12",
    make: "Ferrari",
    model: "Roma",
    year: 2023,
    price: 245000,
    mileage: 3800,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Elegant grand tourer with Ferrari DNA. La Nuova Dolce Vita design philosophy creates timeless beauty.",
    imageUrl: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800",
    specs: { engine: "3.9L Twin-Turbo V8", horsepower: 612, topSpeed: "199 mph", acceleration: "3.4s 0-60" },
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-US").format(mileage) + " mi";
}
