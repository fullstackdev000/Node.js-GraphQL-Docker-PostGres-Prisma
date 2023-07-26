import { prisma, Zip } from '#veewme/gen/prisma'
import { zipFiles as zipFilesFn } from '#veewme/helpers/zipFile'
import { getPublicUrl } from '#veewme/lib/storage'
import { sendZippingCompletedEmail } from '#veewme/server/email'
import { GraphQLUpload } from 'graphql-upload'
import * as fpath from 'path'
import { ResolversRequired } from '../graphqlServer'

export const File: ResolversRequired['File'] = {
  path: async parent => {
    const file = await prisma.file({ id: parent.id })
    return file ? getPublicUrl(file.path) : ''
  }
}

export const Upload: ResolversRequired['Upload'] = GraphQLUpload

// TODO remove after demonstration is done
export const zipFiles: ResolversRequired['Mutation']['zipFiles'] = async (_, args, context) => {

  const prefix = 'Zips'
  let outputPath = fpath.join(prefix, `${args.data.realEstateId}`)
  outputPath = fpath.join(outputPath, `${args.data.archiveName && args.data.archiveName.replace(/\s/g, '') || Date.now().toString()}.zip`)
  const zips = await context.prismaBinding.query.zips({
    where: {
      link: getPublicUrl(outputPath),
      realEstateId: { id: args.data.realEstateId },
      status: 'Ready' }
  })
  let zip: Zip
  if (!zips || zips.length === 0) {
    zip = await prisma.createZip({
      archiveName: args.data.archiveName,
      link: '',
      realEstateId: { connect: { id: args.data.realEstateId } },
      status: 'InProgress'
    })
  } else {
    zip = await prisma.updateZip({
      data: {
        link: '',
        status: 'InProgress'
      },
      where: {
        id: zips[0].id
      }
    })
  }
  const zipAndSendMail = async (id: number) => {
    const link = await zipFilesFn(args.data)
    const updatedzip = await prisma.updateZip({
      data: {
        link,
        status: 'Ready'
      },
      where: {
        id
      }
    })
    const user = await context.prismaBinding.query.user({ where: { id: context.userId } })
    return sendZippingCompletedEmail(user.email, updatedzip.link)
  }
  void zipAndSendMail(zip.id)
  return zip
}
