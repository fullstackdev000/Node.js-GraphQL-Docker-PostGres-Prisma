import {
  AgentAccountValues,
  AgentValues as AgentAllValues,
  DefaultColorSchemeValues,
  RealEstateFlyer,
  RealEstateSiteMediaShowcaseValues,
  RealEstateSiteTourSettingsValues
} from '#veewme/web/common/formPanels/valuesInterfaces'

export type AgentSettings = Pick<AgentAccountValues,
  'internalNote'
  | 'officeAdmin'
  | 'brokerAdmin'
> &
{
  id?: number
} & Pick<AgentAllValues,
  'showInternalNoteUponOrder'
>
  & DefaultColorSchemeValues
  & RealEstateFlyer
  & RealEstateSiteTourSettingsValues
  & RealEstateSiteMediaShowcaseValues
  & {
    user: Partial<Pick<AgentAllValues['user'], 'joinDate' | 'lastLogIn'>>
  }
