/** Paginación — valores compartidos entre URL, hooks y API */

export const DEFAULT_PAGE = 1

/** Bandeja del experto: ítems por página en listado paginado */
export const EXPERT_EVALUATIONS_PAGE_SIZE = 20

/** Tope de `size` aceptado en query params de la bandeja experto */
export const EXPERT_EVALUATIONS_MAX_PAGE_SIZE = 100

/** Tope único de ítems por request cuando el listado es acotado (respuestas, evidencia, empresas) */
export const API_MAX_PAGE_SIZE = 100

/** Debounce para búsqueda en combobox y filtros de texto */
export const SEARCH_DEBOUNCE_MS = 500

/** Longitud máxima de `companies.name` en BD (String(200)). El registro usa max 100 en formulario. */
export const COMPANY_NAME_MAX_LENGTH = 200

/** Longitud máxima de `responses.observations` — ResponseUpsert (Pydantic max_length=500). */
export const RESPONSE_OBSERVATIONS_MAX_LENGTH = 500
