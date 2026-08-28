from abc import ABC, abstractmethod
import fitz  # PyMuPDF
import docx
import os
from typing import List, Dict, Any, Tuple
from app.core.logging import logger

class DocumentProcessor(ABC):
    @abstractmethod
    def process(self, file_path: str) -> Tuple[List[Dict[str, Any]], int]:
        pass

class PDFTextProcessor(DocumentProcessor):
    def process(self, file_path: str) -> Tuple[List[Dict[str, Any]], int]:
        if not os.path.exists(file_path):
            raise FileNotFoundError("PDF file missing from storage")
            
        try:
            doc = fitz.open(file_path)
            extracted_pages = []
            page_count = len(doc)
            
            for page_num in range(page_count):
                page = doc.load_page(page_num)
                text = page.get_text("text").strip()
                if text:
                    extracted_pages.append({
                        "page_number": page_num + 1,
                        "section_name": "Unknown Section", # PDF lacks easy section headers without layout analysis
                        "text": text
                    })
            doc.close()
            return extracted_pages, page_count
        except Exception as e:
            logger.error(f"Failed to process PDF {file_path}: {str(e)}")
            raise Exception(f"Corrupted or unreadable PDF: {str(e)}")

class DOCXProcessor(DocumentProcessor):
    def process(self, file_path: str) -> Tuple[List[Dict[str, Any]], int]:
        if not os.path.exists(file_path):
            raise FileNotFoundError("DOCX file missing from storage")
            
        try:
            doc = docx.Document(file_path)
            extracted_sections = []
            
            current_section = "Unknown Section"
            current_text = []
            
            for para in doc.paragraphs:
                # Basic heuristic for headings: style name starts with 'Heading'
                if para.style.name.startswith('Heading'):
                    # Save previous section if it has text
                    if current_text:
                        extracted_sections.append({
                            "page_number": 1, # DOCX doesn't have fixed pages easily
                            "section_name": current_section,
                            "text": "\n".join(current_text).strip()
                        })
                    current_section = para.text.strip()
                    current_text = []
                elif para.text.strip():
                    current_text.append(para.text.strip())
            
            if current_text:
                extracted_sections.append({
                    "page_number": 1,
                    "section_name": current_section,
                    "text": "\n".join(current_text).strip()
                })
                
            return extracted_sections, 0
        except Exception as e:
            logger.error(f"Failed to process DOCX {file_path}: {str(e)}")
            raise Exception(f"Corrupted or unreadable DOCX: {str(e)}")

class ExtractionService:
    def __init__(self):
        self.processors = {
            "pdf": PDFTextProcessor(),
            "docx": DOCXProcessor()
        }

    def process_document(self, file_path: str, file_type: str) -> Tuple[List[Dict[str, Any]], int, str]:
        processor = self.processors.get(file_type.lower())
        if not processor:
            raise ValueError(f"Unsupported file type: {file_type}")
            
        extracted_data, page_count = processor.process(file_path)
        
        status = "SUCCESS"
        if not extracted_data:
            status = "NO_TEXT_FOUND"
            
        return extracted_data, page_count, status
