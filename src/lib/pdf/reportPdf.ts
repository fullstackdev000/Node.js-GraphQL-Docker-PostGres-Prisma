import { getFullPath } from '#veewme/lib/storage'
import { Affiliate, AgentOfAffiliate } from '#veewme/lib/types'
import { Storage } from '@google-cloud/storage'
import * as fs from 'fs'
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces'
import uuidv4 from 'uuid/v4'
import { fonts } from './font'

export function reportPDF (affiliate: Affiliate, list: AgentOfAffiliate[]): string {
  const data = [[ 'Agent ID', 'First Name', 'Last Name', 'Phone Mobile' ]]
  list.forEach(value => {
    data.push([value.id.toString(), value.user.firstName, value.user.lastName, value.phoneMobile])
  })

  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        height: 50,
        image: './src/lib/pdf/image/logo.jpg',
        margin: [ 30, 60, 0, 0 ],
        width: 100
      },
      {
        alignment: 'center',
        bold: true,
        color: '#c0392b',
        fontSize: 30,
        margin: [ 0, -30, 0, 0 ],
        text: affiliate.companyName
      },
      {
        layout: {
          hLineColor () { return 'black' },
          vLineColor () { return 'black' }
        },
        margin: [ 70, 30, 70, 0 ],
        table: {
          body: data,
          headerRows: 1,
          widths: [ '*', 'auto', 100, '*' ]
        }
      }
    ],
    defaultStyle: {
      font: 'Helvetica'
    },
    pageMargins: [ 30, 30, 30, 30 ],
    pageSize: 'A4'
  }

  const url = saveFilePDF(docDefinition, fonts, 'report')
  return url
}

function saveFilePDF (docDefinition: TDocumentDefinitions, font: TFontDictionary, filename: string): string {
  let url = ''

  const printer = new PdfPrinter(font)
  const pdfDoc = printer.createPdfKitDocument(docDefinition)

  const fullPath = getFullPath(`${filename}_${uuidv4()}.pdf`)

  if (process.env.STORAGE_TYPE === 'local') {
    fs.mkdirSync('tmp/storage', { recursive: true })
    pdfDoc.pipe(fs.createWriteStream(`tmp/storage/${fullPath}`))
    url = `/storage/${fullPath}`
  } else if (process.env.STORAGE_TYPE === 'gcloud') {
    const storage = new Storage({
      keyFilename: 'build/gcloud-key.json',
      projectId: process.env.GCLOUD_PROJECT
    })
    const bucket = storage.bucket(process.env.GCLOUD_BUCKET || '')
    const file = bucket.file(fullPath)
    pdfDoc.pipe(file.createWriteStream())
    url = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${fullPath}`
  } else {
    throw new Error('Unknown storage type.')
  }

  pdfDoc.end()

  return url
}
