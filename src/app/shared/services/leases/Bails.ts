export class Bails {
    id: string;
    bailNum: string;

    dateStart: string; // Instant en Java correspond à une date ISO 8601
    termJour: number;
    dateEnd: string;
    status: string;

    renewNotification: number;
    firstPaymentPeriod: string;
    paymentPeriod: string; // Ex: "MONTH", "WEEK", "OTHER"
    methodOfPayment: string; // Ex: "Cash", "Bank Transfer"
    placeOfPayment: string; // Ex: "Bank XYZ", "Office"

    amountRent: number;
    amountService: number;
    isAmountPerMonth: boolean;
    isAmountPerWeek: boolean;

    // Données du locataire (tenant)
    tenantId: string;
    tenantName: string;
    tenantEmail: string;
    tenantPhone: string;

    // Données de l’unité louée
    unitId: string;
    unitAddress: string;
    unitDescription: string;

    // Liste des services sélectionnés pour le bail
    selectedServiceIds: string[];

    // Liste des inclusions sélectionnées pour le bail
    selectedInclusions: string[];

    // Lien vers le contrat PDF généré
    contractUrl: string;

    constructor(init?: Partial<Bails>) {
        Object.assign(this, init);
    }
}


