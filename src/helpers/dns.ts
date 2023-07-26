import { resolveCname } from 'dns'
import { promisify } from 'util'
import { CnameStatus } from '../lib/types'

const promisedResolveCname = promisify(resolveCname)

export const checkCname = async (cname: string, domain: string): Promise<CnameStatus> => {
  try {
    const addresses = await promisedResolveCname(cname)

    const domainExist = addresses.includes(domain)
    if (domainExist) {
      return CnameStatus.SUCCESS
    }
    return CnameStatus.NOT_EXIST

  } catch (error) {
    return CnameStatus.WRONG_VALUE
  }
}
