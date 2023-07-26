import { OnePageFlyerPdf } from '#veewme/lib/pdf/types'
import { FileUpload } from '#veewme/lib/storage'
import * as fs from 'fs'
import os from 'os'
import * as path from 'path'
import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'

const pixelsToPoints = (pixels: number) => {
  return pixels / 4.1666666667
}
const getWidth = () => 0

const tableLayout = {
  defaultBorder: false,
  hLineWidth: getWidth,
  paddingBottom: getWidth,
  paddingLeft: getWidth,
  paddingRight: getWidth,
  paddingTop: getWidth,
  vLineWidth: getWidth
}

export const createOnePageFlyerPdf = async (dataForFlyerPdf: OnePageFlyerPdf): FileUpload => {
  const renderYearBuild = dataForFlyerPdf.realEstateYearBuilt > 0
    ? { style: 'textTop', text: ` \nBuilt ${dataForFlyerPdf.realEstateYearBuilt}` }
    : { style: 'textTop', text: '' }

  const renderLotSize = dataForFlyerPdf.realEstateLotSize > 0
    ? { style: 'textTop', text: ` \nLot ${dataForFlyerPdf.realEstateLotSize} ${dataForFlyerPdf.realEstateHomeSizeUnit}` }
    : { style: 'textTop', text: '' }
  const fonts = {
    Helvetica: {
      bold: 'Helvetica-Bold',
      bolditalics: 'Helvetica-BoldOblique',
      italics: 'Helvetica-Oblique',
      normal: 'Helvetica'
    }
  }
  const printer = new PdfPrinter(fonts)
  const docDefinition: TDocumentDefinitions = {
    background: [
      {
        height: pixelsToPoints(1479),
        image: `${dataForFlyerPdf.realEstateCoverImg}`,
        margin: [pixelsToPoints(871), 0, 0, 0],
        width: pixelsToPoints(1679)
      }],
    content: [
      {
        layout: tableLayout,
        style: 'topSection',
        table: {
          body: [
            [
              {
                color: 'white',
                fillColor: 'black',
                layout: tableLayout,
                margin: [pixelsToPoints(60), pixelsToPoints(70), 0, 0],
                table: {
                  body: [
                    [{
                      text: [
                        { text: `${dataForFlyerPdf.realEstateStreet}\n`, fontSize: 30, bold: true },
                        { text: `${dataForFlyerPdf.realEstateCity}, ${dataForFlyerPdf.realEstateState}`, style: 'textTop', bold: true }
                      ]
                    }],
                    [{
                      text: [
                        {
                          style: 'textTop',
                          text: `\n${dataForFlyerPdf.realEstateBedrooms} Bedrooms \n${dataForFlyerPdf.realEstateFullBathrooms} Bathrooms/${dataForFlyerPdf.realEstateHalfBathrooms} Half`
                        },
                        renderLotSize,
                        renderYearBuild
                      ]
                    }],
                    [{
                      text: [
                        { text: '\nRENTAL', style: 'textTop', bold: true, fontSize: 13 },
                        { text: `\n$${dataForFlyerPdf.realEstatePrice}`, style: 'textTop', bold: true, fontSize: 20 },
                        dataForFlyerPdf.realEstatePeriod && { text: `/${dataForFlyerPdf.realEstatePeriod}`, style: 'textTop', bold: true }
                      ]
                    }]
                  ],
                  heights: [pixelsToPoints(423), pixelsToPoints(656), pixelsToPoints(300)]
                }
              },
              {
                layout: tableLayout,
                margin: [pixelsToPoints(1204), pixelsToPoints(100), pixelsToPoints(100), 0],
                table: {
                  body: [
                    [
                      {
                        fillColor: 'white',
                        fit: pixelsToPoints(300),
                        margin: [pixelsToPoints(20), pixelsToPoints(20), pixelsToPoints(20), pixelsToPoints(20)],
                        qr: dataForFlyerPdf.urlForQrCode
                      }
                    ]
                  ]
                }
              }
            ]
          ],
          heights: pixelsToPoints(1479),
          widths: [pixelsToPoints(871), pixelsToPoints(1679)]
        }
      },
      {
        height: pixelsToPoints(471),
        layout: tableLayout,
        style: 'middleSection',
        table: {
          body: [
            [
              {
                height: pixelsToPoints(942),
                image: dataForFlyerPdf.realEstateBigImg,
                rowSpan: 2,
                width: pixelsToPoints(1702)
              },
              {
                height: pixelsToPoints(447),
                image: dataForFlyerPdf.realEstateSideImg1,
                width: pixelsToPoints(807)
              }
            ],
            ['',
              {
                height: pixelsToPoints(447),
                image: dataForFlyerPdf.realEstateSideImg2,
                margin: [0, pixelsToPoints(48), 0, 0],
                width: pixelsToPoints(807)
              }
            ]
          ],
          widths: [pixelsToPoints(1743), pixelsToPoints(807)]
        }
      },
      {
        layout: tableLayout,
        table: {
          body: [
            [
              {
                alignment: 'center',
                color: 'white',
                fillColor: 'black',
                fontSize: 16,
                margin: [0, pixelsToPoints(35), 0, 0],
                text: `${dataForFlyerPdf.brokerageWebsite}`
              }
            ]
          ],
          heights: pixelsToPoints(127),
          widths: ['*']
        }
      },
      {
        layout: tableLayout,
        style: 'bottomSection',
        table: {
          body: [
            [
              {
                columns: [
                  {
                    stack: [
                      dataForFlyerPdf.agentImg && {
                        height: pixelsToPoints(375),
                        image: dataForFlyerPdf.agentImg,
                        margin: [0, 0, 0, 0],
                        width: pixelsToPoints(375)
                      }
                    ],
                    width: pixelsToPoints(435)
                  },
                  {
                    text: [
                      { text: `${dataForFlyerPdf.agentFirstName} `, style: 'textBottom', alignment: 'left', bold: true, fontSize: 14 },
                      { text: `${dataForFlyerPdf.agentLastName}`, style: 'textBottom', alignment: 'left', bold: true, fontSize: 14 },
                      { text: ' - Realtor', style: 'textBottom', alignment: 'left' },
                      dataForFlyerPdf.agentCity && { text: `\n${dataForFlyerPdf.agentCity} - City`, style: 'textBottom', alignment: 'left' },
                      dataForFlyerPdf.agentPhone && { text: `\n${dataForFlyerPdf.agentPhone}`, style: 'textBottom', alignment: 'left', fontSize: 14 },
                      dataForFlyerPdf.agentEmail && { text: `\n${dataForFlyerPdf.agentEmail}`, style: 'textBottom', alignment: 'left', fontSize: 14 },
                      dataForFlyerPdf.agentWebsite && {
                        alignment: 'left',
                        fontSize: 14,
                        style: 'textBottom',
                        text: `\n${dataForFlyerPdf.agentWebsite}`
                      }
                    ],
                    width: 'auto'
                  },
                  {
                    stack: [
                      dataForFlyerPdf.brokerageLogoImg && {
                        alignment: 'right',
                        height: pixelsToPoints(292),
                        image: dataForFlyerPdf.brokerageLogoImg,
                        width: pixelsToPoints(509)
                      }
                    ],
                    width: '*'
                  }
                ],
                fillColor: '#ebebeb',
                margin: [pixelsToPoints(60), pixelsToPoints(50), pixelsToPoints(60), 0]
              }
            ],
            [
              {
                columns: [
                  {
                    stack: [
                      {
                        alignment: 'center',
                        fontSize: 10,
                        style: 'textBottom',
                        text: dataForFlyerPdf.agentOthers
                      }
                    ],
                    width: pixelsToPoints(435)
                  },
                  {
                    text: '',
                    width: 'auto'
                  },
                  {
                    stack: [
                      {
                        alignment: 'right',
                        margin: [0, pixelsToPoints(-100),0,0],
                        style: 'textBottom',
                        text: `\n${dataForFlyerPdf.brokerageStreet} \n${dataForFlyerPdf.brokerageCity}, ${dataForFlyerPdf.brokerageState} ${dataForFlyerPdf.brokerageZip}`
                      }
                    ],
                    width: '*'
                  }
                ],
                fillColor: '#ebebeb',
                margin: [pixelsToPoints(60), 0, pixelsToPoints(60), 0]
              }
            ]
          ],
          heights: [pixelsToPoints(435), pixelsToPoints(70)],
          widths: ['*']
        }
      },
      {
        layout: tableLayout,
        style: 'footerLine',
        table: {
          body: [
            [
              {
                alignment: 'center',
                color: 'grey',
                fontSize: 10,
                margin: [pixelsToPoints(50), pixelsToPoints(15), pixelsToPoints(50), 0],
                text: `${dataForFlyerPdf.realEstateDescriptionShort}`
              }
            ]
          ],
          widths: ['*']
        }
      }
    ],
    defaultStyle: {
      font: 'Helvetica'
    },
    pageMargins: [0, 0, 0, 0],
    pageSize: 'LETTER',
    styles: {
      bottomSection: {},
      middleSection: {
        margin: [0, 0, 0, pixelsToPoints(28)]
      },
      textBottom: {
        color: '#4a4a4a',
        fontSize: 12,
        lineHeight: 1.4
      },
      textTop: {
        fontSize: 15,
        lineHeight: 1.5
      },
      topSection: {
        margin: [0, 0, 0, pixelsToPoints(28)]
      }
    }
  }
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  const tempDir = os.tmpdir()
  const filePath = path.join(tempDir, `${dataForFlyerPdf.realEstateState}, ${dataForFlyerPdf.realEstateCity}, ${dataForFlyerPdf.realEstateStreet}.pdf`)
  pdfDoc.pipe(fs.createWriteStream(filePath))
  pdfDoc.end()
  return new Promise((resolve, reject) => {
    pdfDoc.on('end', () => {
      const file = {
        createReadStream: () => fs.createReadStream(filePath),
        encoding: 'UTF-8',
        filename: `${dataForFlyerPdf.realEstateState}, ${dataForFlyerPdf.realEstateCity}, ${dataForFlyerPdf.realEstateStreet}.pdf`,
        mimetype: 'application/pdf'
      }
      resolve(file)
    })
    pdfDoc.on('error',err => {
      reject(err)
    })
  })
}
