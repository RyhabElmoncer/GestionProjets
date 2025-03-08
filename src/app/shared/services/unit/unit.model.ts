export class Unit {

  id: string;
  title: string;
  name: string;
  isVisible: boolean;
  number: number;
  bedrooms:number;
  bathrooms: number;
  descriptionFr:string;
  descriptionEn:string;
  marketRent:string;
  unitType:string;
  size: number;
  typeOfSize:string;
  defaultImage :string;
  isHome:number
  accessControl:string;
  rentalType:string;
  status:string;
  propertyId:string;
  serviceIds: string[];
  images: string;
  unitInclusions: UnitInclusion[]; // Add this line
}
export class UnitInclusion {
  inclusionId: string;
  qty: string;
  other: string;
}
