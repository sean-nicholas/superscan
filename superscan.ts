import { createWriteStream } from 'fs'
import { readFile } from 'fs/promises'
import { Document, ExternalDocument } from 'pdfjs'

async function run() {
  const file1 = await readFile(
    '/Users/sean/Downloads/Gesetzliche_Rente_Renteninformation_20221.pdf',
  )
  const pdf1 = new ExternalDocument(file1)
  const pdf1PageCount = (pdf1 as any).pageCount
  const file2 = await readFile(
    '/Users/sean/Downloads/Gesetzliche_Rente_Renteninformation_20222.pdf',
  )
  const pdf2 = new ExternalDocument(file2)
  const pdf2PageCount = (pdf2 as any).pageCount

  if (pdf1PageCount !== pdf2PageCount) {
    console.error(
      `Both PDFs have different number of pages. PDF 1: ${pdf1PageCount} PDF 2: ${pdf2PageCount}`,
    )
    return
  }

  const pageCount = pdf1PageCount

  const mergePdf = new Document()
  for (let i = 1; i <= pageCount; i++) {
    mergePdf.addPageOf(i, pdf1)
    mergePdf.addPageOf(pageCount + 1 - i, pdf2)
  }

  try {
    const writeStream = mergePdf.pipe(
      createWriteStream(
        '/Users/sean/Downloads/Gesetzliche_Rente_Renteninformation_2022.pdf',
      ),
    )
    await mergePdf.end()

    const writeStreamClosedPromise = new Promise((resolve, reject) => {
      try {
        writeStream.on('close', () => resolve(null))
      } catch (e) {
        reject(e)
      }
    })

    await writeStreamClosedPromise
  } catch (error) {
    console.log(error)
  }
}

run()
  .then(() => console.log('🎉 Done'))
  .catch(console.error)
