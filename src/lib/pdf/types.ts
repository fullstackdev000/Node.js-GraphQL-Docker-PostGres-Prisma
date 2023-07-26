import { AreaMeasurementUnit, State, TimePeriod } from '#veewme/gen/prisma'
export interface FlyerImage {
  id: number
  fileId: {
    path: string
  }
}

export interface OnePageFlyerPdf {
  agentPhone: string
  agentCity: string
  agentEmail: string
  brokerageCity: string
  realEstateFullBathrooms: number
  realEstateSideImg1: string
  brokerageLogoImg: string
  brokerageState: State
  realEstateState: State
  realEstateBigImg: string
  realEstatePrice: number
  agentFirstName: string
  realEstateLotSize: number
  realEstateSideImg2: string
  realEstateHalfBathrooms: number
  agentOthers: string
  agentLastName: string
  realEstateDescriptionShort: string
  realEstatePeriod: TimePeriod
  realEstateBedrooms: number
  realEstateCity: string
  urlForQrCode: string
  realEstateHomeSizeUnit: AreaMeasurementUnit
  realEstateStreet: string
  agentImg: string
  brokerageStreet: string
  brokerageZip: string
  realEstateCoverImg: string
  realEstateYearBuilt: number
  brokerageWebsite: string
  agentWebsite: string
}
