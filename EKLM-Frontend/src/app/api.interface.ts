
export interface LoginDTO {
  username: string;
  password: string;
}

export interface ProduktEigenschaft {
  eigsId: number;
  bezeichnung: string;
  vergleichsGruppe: number;
  prio: number;
  anzeigen: boolean;
}

export interface ProduktInfo {
  prodId: number;
  istZutat: boolean;
  bezeichnung: string;
  commoneinheit: string;
  eigenschaften: ProduktEigenschaft[];
}

export interface EinkaufsListeProdukte {
  ekliProdId: number;
  menge: string;
  einheit: string;
  produkt: ProduktInfo;
}

export interface EinkaufsListe {
  id: number;
  hinweis: string;
  zeitstempel: string;
  bezeichnung: string;
  isOwner: boolean;
  inhalt: EinkaufsListeProdukte[];
}

export interface EinkaufsListenInfo {
  id: number;
  hinweis: string;
  zeitstempel: string;
  bezeichnung: string;
}

export interface UserInfo {
  id: number;
  username: string;
  password?: string;
  einkaufslisten: EinkaufsListenInfo[];
  accessibleEinkaufslisten: EinkaufsListenInfo[];
}

export interface GerichtInfo {
  geriId: number;
  bezeichnung: string;
  zubereitungsdauer: string;
  rezept: string;
  schwierigkeitsgrad: number;
  produkte: EinkaufsListeProdukte[];
}

export interface ServerErrorDTO {
  status: number;
  reason?: string;
  message: string;
};

export interface ApiResultHandler {
  onResult: ( result?: any ) => void;
  onError: ( result: ServerErrorDTO ) => void;
}