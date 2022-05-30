import { createWriteStream } from 'fs'
import { readFile } from 'fs/promises'
import { basename } from 'path'
import { Document, ExternalDocument } from 'pdfjs'

run()
  .then(() => console.log('🎉 Done'))
  .catch(console.error)

async function run() {
  const { frontFile, backFile } = getInputFiles()

  const frontPages = await loadPDF(frontFile)
  const backPages = await loadPDF(backFile)

  if (frontPages.pageCount !== backPages.pageCount) {
    console.error(
      `Both PDFs have different number of pages. PDF 1: ${frontPages.pageCount} PDF 2: ${backPages.pageCount}`,
    )
    return
  }

  const pageCount = frontPages.pageCount

  const mergePdf = new Document()
  for (let i = 1; i <= pageCount; i++) {
    mergePdf.addPageOf(i, frontPages.pdf)
    // Add back pages in reverse order because they are scanned in reverse order
    mergePdf.addPageOf(pageCount + 1 - i, backPages.pdf)
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

function getInputFiles() {
  const files = process.argv.filter((arg) => arg.endsWith('.pdf'))
  if (files.length !== 2) throw new Error('Expected exactly 2 PDF files')
  const [frontFile, backFile] = files
  return {
    frontFile,
    backFile,
  }
}

async function loadPDF(filePath: string) {
  const file = await readFile(filePath)
  const pdf = new ExternalDocument(file)
  const pageCount = (pdf as any).pageCount
  const fileName = basename(filePath, '.pdf')
  return {
    pdf,
    pageCount,
    fileName,
  }
}
