/** Zentrale Angaben für AGB, Widerruf und Datenschutz — hier pflegen. */
export const LEGAL = {
  companyName:    "Burger Station Leer",
  ownerName:      "[Vor- und Nachname des Inhabers]",
  street:         "Bahnhofsring 30",
  zipCity:        "26789 Leer",
  phone:          "0491 99 755 279",
  phoneTel:       "+4949199755279",
  email:          "kontakt@burgerstation-leer.de",
  ustId:          "[USt-IdNr.]",
  handelsregister: "[Falls eingetragen: Amtsgericht …, HRA/HRB …]",
  website:        "https://www.burgerstation-leer.de",
  standDate:      "22.05.2026",
  logRetentionDays: 30,
  emailProvider:  "[E-Mail-Versanddienstleister — noch nicht festgelegt]",
  taxAdvisor:     "[Steuerberatung — falls extern beauftragt]",
} as const;

export function legalAddressBlock() {
  return `${LEGAL.companyName}\n${LEGAL.street}\n${LEGAL.zipCity}`;
}
