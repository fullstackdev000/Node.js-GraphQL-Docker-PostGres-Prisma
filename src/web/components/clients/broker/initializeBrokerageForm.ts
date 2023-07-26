import { Region } from '#veewme/gen/graphqlTypes'
import { templateOptions, unsetNumberId } from '#veewme/web/common/consts'
import { OptionValue } from '#veewme/web/common/formikFields/selectField'
import { BrokerFormValues, PhotoDownloadPreset } from '#veewme/web/common/formPanels/valuesInterfaces'
import { useMemo } from 'react'
import { FormOptions } from './brokerForm'
import brokerFormValues from './brokerFormValues'
import { BrokerageOwnerQueryResult, BrokerageQueryResult } from './queriesDataTypes'

const getRegionOptions = (regions: Array<Pick<Region, 'id' | 'label'>>): OptionValue[] => {
  return regions.map(region => ({
    label: region.label,
    value: region.id
  }))
}

export const formEmptyOptions: FormOptions = {
  regionOptions: []
}

// TODO:
export const useInitializeBrokerageForm = (owner?: BrokerageOwnerQueryResult, data?: BrokerageQueryResult): [BrokerFormValues, FormOptions] => {
  const formOptions = useMemo(() => {
    let regionOptions: OptionValue[] = []
    if (owner) {
      regionOptions = getRegionOptions(owner.regions)
    }

    return {
      regionOptions
    }
  }, [owner])

  const values = useMemo(() => {
    let formValues: BrokerFormValues = {
      ...brokerFormValues
    }
    let availablePresets: PhotoDownloadPreset[] = []
    let regionId = unsetNumberId  // TODO make optional in initial data
    let ownerId = 0  // TODO make optional in initial data

    if (owner) {
      availablePresets = owner.mediaExports.map<PhotoDownloadPreset>(preset => {
        const brokerPreset = data && data.photoDownloadPresets.find(bp => bp.photoPreset.id === preset.id)
        return {
          downloadTrigger: brokerPreset && brokerPreset.downloadTrigger || 'NOTRIGGER',
          enabled: brokerPreset && brokerPreset.enabled || false,
          id: brokerPreset && brokerPreset.id,
          photoPreset: preset
        }
      })

      regionId = owner.regions[0].id
    }

    if (data && data.region) {
      regionId = data.region.id
    }

    if (data) {
      ownerId = data.owner.id
    } else if (owner) {
      ownerId = owner.id
    }

    if (data) {
      formValues = {
        ...formValues,
        ...data,
        music: '',
        ownerId,
        photoDownloadPresets: availablePresets,
        realEstateSiteMediaShowcase: {
          // TODO set proper values when available from the backend
          showRealEstateMapOnShowcasePage: false,
          topOfTheShowcasePhoto: ''
        },
        regionId
      }
    } else if (owner) {
      formValues = {
        ...formValues,
        ownerId,
        photoDownloadPresets: availablePresets,
        regionId,
        templateId: owner.templateId || templateOptions[0].value
      }
    }

    return formValues
  }, [owner, data])

  return [values, formOptions]
}
