export enum EBouqetSize {
  S = 1,
  M = 2,
  L = 3,
  XL = 4,
  WOW = 5,
}

export enum EFlowerKinds {
  Rose = 1,
  Hydrangea = 2,
  Peony = 3,
  Tanacetum = 4,
  SprayRoses = 5,
  FrenchRoses = 6,
  Eustoma = 7,
  Delphinium = 8,
  Tulips = 9,
  Ranunculus = 10,
}

export enum EFlowerColors {
  Blue = 1,
  Fuchsia = 2,
  Green = 3,
  Peach = 4,
  Pink = 5,
  Red = 6,
  Violet = 7,
  White = 8,
  Yellow = 9,
}

export enum EBouqetType {
  MonoBouqet = 1,
  DuoBouqet = 2,
  Basket = 3,
  MixBouqet = 4,
}

export enum ELanguage {
  English = "en",
  Russian = "ru",
  Arabic = "ar",
}

export interface IGroupCard {
  id: string;
  name: string;
  imageLink: string;
}

export interface IFlowerOptions {
  id: string;
  size: number;
  price: number;
  imageLinks: string[];
  index?: number;
}

export interface IFlower {
  id: string;
  name: string;
    description: string;
  bouqetType: number;
  flowerGroupId: string;
  flowerColors: number[];
  flowerKinds: number[];
  flowerOptions: IFlowerOptions[];
}
export interface IFlowerAdmin {
  id: string;
  name: string;
  "Descriptions[ar]": string;
  "Descriptions[en]": string;
  "Descriptions[ru]": string;
  bouqetType: number;
  flowerGroupId: string;
  flowerColors: number[];
  flowerKinds: number[];
  flowerOptions: IFlowerOptions[];
  isActive: boolean;
}

export interface IBasketItem {
  flowerId: string;
  flowerName: string;
  size: number;
  price: number;
  imageLink: string;
  quantity: number;
}

export interface IFilterParams {
  flowerName?: string;
  bouqetType?: number;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  colors?: number[];
  kinds?: number[];
}

export interface IPageImage {
  id: string;
  imageLink: string
}
