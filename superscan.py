#!/usr/bin/python
# coding: utf-8

# Inspired by https://discussions.apple.com/thread/250099677

from Foundation import NSURL
from Quartz import PDFDocument, PDFPage
import os
import sys


def usage():
    print("Usage: {} document_fronts.pdf document_backs.pdf".format(__file__))

def load_pdf(filepath):
    corrected_filepath = os.path.expanduser(filepath)
    if not corrected_filepath.endswith('.pdf'):
        raise Exception('PDF file type required')

    url = NSURL.fileURLWithPath_(corrected_filepath)
    pdf = PDFDocument.alloc().initWithURL_(url)

    return pdf

def get_filename_from_path(filepath):
    basepath, ext = os.path.splitext(filepath)
    filename = os.path.basename(basepath)
    return filename

def get_output_filename(filepath1, filepath2):
    filename1 = get_filename_from_path(filepath1)
    filename2 = get_filename_from_path(filepath2)
    output_filename = ""
    for i in range(0, min(len(filename1), len(filename2))):
        char1 = filename1[i]
        char2 = filename2[i]
        if char1 == char2:
            output_filename += char1

    if (len(output_filename) == 0): return 'unnamed.pdf'

    return output_filename + '.pdf'

def main():
    if len(sys.argv) != 3:
        usage()
        sys.exit(1)

    fronts_path = sys.argv[1]
    backs_path = sys.argv[2]

    output_filename = get_output_filename(fronts_path, backs_path)

    fronts_pdf = load_pdf(fronts_path)
    backs_pdf = load_pdf(backs_path)

    if fronts_pdf.pageCount() != backs_pdf.pageCount():
        raise Exception('PDF file have different page length')

    num_pages = fronts_pdf.pageCount()
    pdf_out = PDFDocument.alloc().init()

    for i in range(0, num_pages):
        front_page = fronts_pdf.pageAtIndex_(i)
        back_page = backs_pdf.pageAtIndex_(num_pages - i - 1)
        pdf_out.insertPage_atIndex_(front_page, i * 2)
        pdf_out.insertPage_atIndex_(back_page, i * 2 + 1)

    pdf_out.writeToFile_(output_filename)

if __name__ == '__main__':
    sys.exit(main())