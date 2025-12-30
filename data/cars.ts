import { ImageSource } from "expo-image";

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
  imageUrls: ImageSource[];
  specs: {
    engine: string;
    horsepower: number;
    topSpeed: string;
    acceleration: string;
  };
}

export const CARS: Car[] = [
  {
    id: "audi-rs6-avant",
    make: "Audi",
    model: "RS6 Avant",
    year: 2024,
    price: 135000,
    mileage: 1800,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Twin-turbo V8 super wagon with Quattro grip, massive cargo space, and everyday usability wrapped in aggressive styling.",
    imageUrls: [
      require("../../assets/images/cars/Audi RS6/Audi1.jpg"),
      require("../../assets/images/cars/Audi RS6/Audi2.jpg"),
      require("../../assets/images/cars/Audi RS6/Audi3.jpg"),
    ],
    specs: {
      engine: "4.0L Twin-Turbo V8",
      horsepower: 621,
      topSpeed: "190 mph",
      acceleration: "3.3s 0-60",
    },
  },
  {
    id: "bugatti-chiron",
    make: "Bugatti",
    model: "Chiron",
    year: 2022,
    price: 3300000,
    mileage: 500,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Quad-turbocharged W16 hypercar that blends artful coachbuilding with mind-bending performance and bespoke craftsmanship.",
    imageUrls: [
      require("../../assets/images/cars/Bugatti Chiron/BugattiChiron1.avif"),
      require("../../assets/images/cars/Bugatti Chiron/BugattiChiron2.jpg"),
      require("../../assets/images/cars/Bugatti Chiron/BugattiChiro3.jpg"),
    ],
    specs: {
      engine: "8.0L Quad-Turbo W16",
      horsepower: 1500,
      topSpeed: "261 mph",
      acceleration: "2.4s 0-60",
    },
  },
  {
    id: "chevrolet-camaro-ss",
    make: "Chevrolet",
    model: "Camaro SS (6th Gen)",
    year: 2023,
    price: 45500,
    mileage: 4200,
    transmission: "Manual",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Classic American coupe with magnetic ride control, burly V8 soundtrack, and a chassis tuned for backroad fun.",
    imageUrls: [
      require("../../assets/images/cars/Chevrolet Camaro SS (6th Gen)/ChevroletCamaro1.jpg"),
      require("../../assets/images/cars/Chevrolet Camaro SS (6th Gen)/ChevroletCamaro2.jpg"),
      require("../../assets/images/cars/Chevrolet Camaro SS (6th Gen)/ChevroletCamaro3.jpg"),
    ],
    specs: {
      engine: "6.2L Naturally Aspirated V8",
      horsepower: 455,
      topSpeed: "165 mph",
      acceleration: "4.0s 0-60",
    },
  },
  {
    id: "hyundai-ev-performance",
    make: "Hyundai",
    model: "N Vision",
    year: 2024,
    price: 78000,
    mileage: 900,
    transmission: "Automatic",
    fuelType: "Electric",
    condition: "Excellent",
    description: "Futuristic Hyundai N design study that blends retro lines with modern EV performance and track-focused tuning.",
    imageUrls: [
      require("../../assets/images/cars/Hyundai/Hyundai1.jpg"),
      require("../../assets/images/cars/Hyundai/Hyundai2.webp"),
    ],
    specs: {
      engine: "Dual Motor Electric",
      horsepower: 650,
      topSpeed: "162 mph",
      acceleration: "3.5s 0-60",
    },
  },
  {
    id: "porsche-911-gt3",
    make: "Porsche",
    model: "911 GT3",
    year: 2024,
    price: 182000,
    mileage: 2400,
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "Excellent",
    description: "Naturally aspirated flat-six that revs beyond 9,000 rpm, rear steering, and motorsport aero deliver a purist’s track weapon.",
    imageUrls: [
      require("../../assets/images/cars/Porsche 911 GT3/Porsche1.webp"),
      require("../../assets/images/cars/Porsche 911 GT3/Porsche2.avif"),
      require("../../assets/images/cars/Porsche 911 GT3/Porsche3.avif"),
    ],
    specs: {
      engine: "4.0L Naturally Aspirated Flat-6",
      horsepower: 502,
      topSpeed: "199 mph",
      acceleration: "3.2s 0-60",
    },
  },
  {
    id: "rivian-r1t",
    make: "Rivian",
    model: "R1T",
    year: 2024,
    price: 82000,
    mileage: 3100,
    transmission: "Automatic",
    fuelType: "Electric",
    condition: "Excellent",
    description: "Adventure-ready electric pickup with quad motors, clever gear tunnel storage, and over-the-air updates for new off-road tricks.",
    imageUrls: [
      require("../../assets/images/cars/Rivian R1T/Rivian1.avif"),
      require("../../assets/images/cars/Rivian R1T/Rivian2.jpg"),
      require("../../assets/images/cars/Rivian R1T/Rivian3.webp"),
    ],
    specs: {
      engine: "Quad Motor Electric",
      horsepower: 835,
      topSpeed: "110 mph",
      acceleration: "3.0s 0-60",
    },
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
