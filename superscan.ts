import { createWriteStream } from 'fs'
import { readFile } from 'fs/promises'
import { Document, ExternalDocument } from 'pdfjs'

run()
  .then(() => console.log('🎉 Done'))
  .catch(console.error)

async function run() {
  const { frontPath, backPath } = getInputFiles()

  const frontPages = await loadPDF(frontPath)
  const backPages = await loadPDF(backPath)

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
      createWriteStream(getOutputFilePath({ frontPath, backPath })),
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
  const [frontPath, backPath] = files
  return {
    frontPath,
    backPath,
  }
}

async function loadPDF(filePath: string) {
  const file = await readFile(filePath)
  const pdf = new ExternalDocument(file)
  const pageCount = (pdf as any).pageCount
  return {
    pdf,
    pageCount,
  }
}

function getOutputFilePath({
  frontPath,
  backPath,
}: {
  frontPath: string
  backPath: string
}) {
  let outputFilePath = ''
  for (let i = 0; i < frontPath.length; i++) {
    if (frontPath[i] !== backPath[i]) break
    outputFilePath += frontPath[i]
  }
  return `${outputFilePath}.pdf`
}
