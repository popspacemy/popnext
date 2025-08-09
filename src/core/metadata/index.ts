import { validateDateSchema, validateIdSchema } from "../validators"

export const metadataSchema = {
  id: validateIdSchema(),
  creatorId: validateIdSchema(false),
  createdDate: validateDateSchema(),
  modifiedDate: validateDateSchema(),
}

export function getMetadataValidators() {
  return metadataSchema
}

export function getMetadataFieldsToOmit() {
  return {
    id: true,
    creatorId: true,
    createdDate: true,
    modifiedDate: true,
  } as const
}
