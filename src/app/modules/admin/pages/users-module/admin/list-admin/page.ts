export interface Page<T> {
    content: T[];          // Liste des éléments de la page
    totalElements: number; // Nombre total d'éléments dans la base
    totalPages: number;    // Nombre total de pages
    size: number;          // Nombre d'éléments par page
    number: number;        // Index de la page actuelle (commence à 0)
}
