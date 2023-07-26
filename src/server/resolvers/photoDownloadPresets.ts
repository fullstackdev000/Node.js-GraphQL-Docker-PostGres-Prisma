import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'

export function convertToUpdateEnabledPresetInput (
  updatePreset: PrismaTypes.EnabledPhotoPresetUpdateWithWhereUniqueNestedInput[],
  preset: GraphqlTypes.EnabledPhotoPresetUpdateInput
): PrismaTypes.EnabledPhotoPresetUpdateWithWhereUniqueNestedInput[] {
  updatePreset.push({
    data: {
      downloadTrigger: preset.downloadTrigger,
      enabled: !!preset.enabled
    },
    where: { id: preset.id }
  })
  return updatePreset
}

export function convertToUpsertEnabledPresetInput (
  upsertPreset: PrismaTypes.EnabledPhotoPresetUpsertWithWhereUniqueNestedInput[],
  preset: GraphqlTypes.EnabledPhotoPresetUpdateInput
): PrismaTypes.EnabledPhotoPresetUpsertWithWhereUniqueNestedInput[] {
  if (preset.photoPresetId) {
    upsertPreset.push({
      create: {
        downloadTrigger: preset.downloadTrigger,
        enabled: !!preset.enabled,
        photoPreset: { connect: { id: preset.photoPresetId } }
      },
      update: {
        downloadTrigger: preset.downloadTrigger,
        enabled: !!preset.enabled
      },
      where: { id: preset.id }
    })
  }
  return upsertPreset
}

export function convertToEnabledPhotoPresetCreateManyInput (enabledPresets?: GraphqlTypes.EnabledPhotoPresetCreateInput[])
: PrismaTypes.Maybe<PrismaTypes.EnabledPhotoPresetCreateManyInput> {
  const photoDownloadPresets = enabledPresets ? enabledPresets.map(preset => {
    return {
      downloadTrigger: preset.downloadTrigger,
      enabled: preset.enabled,
      photoPreset: { connect: { id: preset.photoPresetId } }
    }
  }) : []
  if (photoDownloadPresets.length > 0) {
    return { create: photoDownloadPresets }
  }
  return
}

export function convertToEnabledPhotoPresetUpdateManyInput (enabledPresets?: GraphqlTypes.EnabledPhotoPresetUpdateInput[] | null)
: PrismaTypes.Maybe<PrismaTypes.EnabledPhotoPresetUpdateManyInput> {
  if (enabledPresets) {
    return {
      update: enabledPresets.reduce(convertToUpdateEnabledPresetInput, []),
      upsert: enabledPresets.reduce(convertToUpsertEnabledPresetInput, [])
    }
  }
  return
}
