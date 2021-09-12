#!/usr/bin/python
# coding: utf-8

# write a PDF with its pages reversed into name_reversed.pdf
# tested with Python 2.7.10 on macOS High Sierra 10.13.6
# VikingOSX, 2019-01-19, Apple Support Communities, No warranties.

from Foundation import NSURL
from Quartz import PDFDocument, PDFPage
import os
import sys


def usage():
    print("Usage: {} file1.pdf … filen.pdf".format(__file__))


def main():
    if len(sys.argv) < 2:
        usage()
        sys.exit(1)

    for apdf in sys.argv[1:]:
        pdf_file = os.path.expanduser(apdf)
        if not pdf_file.endswith('.pdf'):
            raise Exception('PDF file type required')

        # build output PDF filename
        bpath, ext = os.path.splitext(pdf_file)
        pdfrev = os.path.basename(bpath + '_reversed' + ext)

        url = NSURL.fileURLWithPath_(pdf_file)
        pdf = PDFDocument.alloc().initWithURL_(url)
        pdf_out = PDFDocument.alloc().init()
        page_cnt = pdf.pageCount()
        pdf_page = PDFPage

        # n is sequential page increase, r is the reversed page number
        for n, r in enumerate(reversed(range(0, page_cnt))):
            pdf_page = pdf.pageAtIndex_(r)
            pdf_out.insertPage_atIndex_(pdf_page, n)

        pdf_out.writeToFile_(pdfrev)


if __name__ == '__main__':
    sys.exit(main())