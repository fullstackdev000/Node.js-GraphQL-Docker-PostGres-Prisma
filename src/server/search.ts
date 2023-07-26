import { postgresClient } from './index'

/**
 * Search real estates by given search phrase using full-text search. Returns a list of real estate IDs that match the
 * query. Real estates are looked up by: city, street, zip code, state, country. The search fields are merged into one
 * field `RealEstate.searchDocument` for easier searching.
 */
export const searchRealEstates = async (searchPhrase: string): Promise<number[]> => {
  const postgresSchema = process.env.POSTGRES_SCHEMA || 'veewme$dev'

  const sql = `
    SELECT id
    FROM "${postgresSchema}"."RealEstate"
    WHERE to_tsvector('english', "searchDocument") @@ plainto_tsquery('english', $1)
  `
  const result = await postgresClient.query(sql, [searchPhrase])
  return result.rows.map((obj: any) => obj.id)
}

/**
 * Normalizes search document in a unified way:
 * - transform it to lower case
 * - strip special characters
 * @param searchDocument - search document without normalization
 * @returns normalized search document
 */
export const normalizeSearch = (searchDocument: string): string => {
  let normalized = searchDocument.replace(/[^a-zA-Z0-9 ]/g, '')
  normalized = normalized.toLowerCase()
  normalized = normalized.trim()
  return normalized
}
