import {
  EBouqetSize,
  EFlowerKinds,
  EFlowerColors,
  EBouqetType,
  ELanguage,
} from "./types";

export const BOUQUET_SIZE_NAMES = {
  [EBouqetSize.S]: "S",
  [EBouqetSize.M]: "M",
  [EBouqetSize.L]: "L",
  [EBouqetSize.XL]: "XL",
  [EBouqetSize.WOW]: "WOW",
};

export const FLOWER_KIND_NAMES = {
  [EFlowerKinds.Rose]: "Rose",
  [EFlowerKinds.Hydrangea]: "Hydrangea",
  [EFlowerKinds.Peony]: "Peony",
  [EFlowerKinds.Tanacetum]: "Tanacetum",
  [EFlowerKinds.SprayRoses]: "Spray Roses",
  [EFlowerKinds.FrenchRoses]: "French Roses",
  [EFlowerKinds.Eustoma]: "Eustoma",
  [EFlowerKinds.Delphinium]: "Delphinium",
  [EFlowerKinds.Tulips]: "Tulips",
  [EFlowerKinds.Ranunculus]: "Ranunculus",
};

export const FLOWER_COLOR_NAMES = {
  [EFlowerColors.Blue]: "Blue",
  [EFlowerColors.Fuchsia]: "Fuchsia",
  [EFlowerColors.Green]: "Green",
  [EFlowerColors.Peach]: "Peach",
  [EFlowerColors.Pink]: "Pink",
  [EFlowerColors.Red]: "Red",
  [EFlowerColors.Violet]: "Violet",
  [EFlowerColors.White]: "White",
  [EFlowerColors.Yellow]: "Yellow",
};

export const BOUQUET_TYPE_NAMES = {
  [EBouqetType.MonoBouqet]: "Mono Bouquet",
  [EBouqetType.DuoBouqet]: "Duo Bouquet",
  [EBouqetType.Basket]: "Basket",
  [EBouqetType.MixBouqet]: "Mix Bouquet",
};

export const LANGUAGE_FLAGS = {
  [ELanguage.English]: "🇺🇸",
  [ELanguage.Russian]: "🇷🇺",
  [ELanguage.Arabic]: "🇦🇪",
};

export const WHATSAPP_NUMBER = "+971509700508"; // Replace with actual WhatsApp number
