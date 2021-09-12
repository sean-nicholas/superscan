# Superscan

Merges 2 pdfs scanned on the document feeder by alternating and reversing pages.

You scan your documents fronts and backs on via the document feeder in two files.
superscan will merge them together while reversing the order from the backs.pdf.
That gives you the pdf you want.

## Output name

It creates the output name based on what both filenames have in common.
Best to name your files is for example:

- fronts: your_document_name_1.pdf
- backs: your_document_name_2.pdf
- output: your_document_name.pdf

Or:

- fronts: your_document_name_fronts.pdf
- backs: your_document_name_backs.pdf
- output: your_document_name.pdf

## Usage

`superscan document_fronts.pdf document_backs.pdf`

## Info

Inspired by: https://discussions.apple.com/thread/250099677