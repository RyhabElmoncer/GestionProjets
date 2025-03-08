export class Property {
  id: string;
  name!: string;
  description?: string;
  typeProperty!: string;
  applicationFee?: number;
  feesPercentage?: number;
  feesMinimum?: number;
  fiscalYearEnd?: string;
  isOneApplicantPerUnit?: boolean;
  size?: number;
  propertyStatus?: string;
  notes?: string;
  defaultImage?: string;
  isHome?: boolean;
  descriptionFr?: string;
  descriptionEn?: string;
  ownerReserves?: number;
  users?: string[]; // Liste d'UUID des utilisateurs
  address?: Address;
  images: string;
  serviceIds: string[];
  owners: any[];
  agents: any[];

  constructor(data?: Partial<Property>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class Address {
  street?: string;
  city!: string;
  state?: string;
  country!: string;
  zip?: string;
  longitude?: number;
  latitude?: number;

  constructor(data?: Partial<Address>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
