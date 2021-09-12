# Superscan

Merges 2 pdfs scanned on the document feeder by alternating and reversing pages.

You scan your documents fronts and backs on via the document feeder in two files.
superscan will merge them together while reversing the order from the backs.pdf.
That gives you the pdf you want.

## Output name

It creates the output name based on what both filenames have in common.
Best to name your files is for example:

- fronts: your_document_name1.pdf
- backs: your_document_name2.pdf
- output: your_document_name.pdf

Or:

- fronts: your_document_namefronts.pdf
- backs: your_document_namebacks.pdf
- output: your_document_name.pdf

## Usage

`superscan fronts.pdf backs.pdf`

## Info

Inspired by: https://discussions.apple.com/thread/250099677