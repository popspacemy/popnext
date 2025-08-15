import { validateDateSchema, validateIdSchema } from "../validators"

export const metadataSchema = {
  id: validateIdSchema(),
  userId: validateIdSchema(false),
  createdDate: validateDateSchema(),
  modifiedDate: validateDateSchema(),
}

export function getMetadataValidators() {
  return metadataSchema
}

export function getMetadataFieldsToOmit() {
  return {
    id: true,
    userId: true,
    createdDate: true,
    modifiedDate: true,
  } as const
}
