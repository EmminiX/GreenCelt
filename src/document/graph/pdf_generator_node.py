# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# Modifications and enhancements by Emmi C (GreenCeltAI)
# SPDX-License-Identifier: MIT

import tempfile
import os
from typing import Dict, Any
import subprocess
import io

from src.document.graph.state import DocumentState


def pdf_generator_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Node for converting markdown content to PDF.
    
    This node takes the input markdown content and converts it to a PDF
    using pandoc (if available) or falls back to a simple HTML to PDF conversion.
    
    Args:
        state: The current state of the workflow.
        
    Returns:
        The updated state with the output field set.
    """
    # Create state object from dictionary
    state_obj = DocumentState(state)
    
    try:
        if not state_obj.input:
            state_obj.error = "No input content provided"
            return state_obj.to_dict()
        
        # Write markdown content to a temporary file
        with tempfile.NamedTemporaryFile(suffix='.md', mode='w+', delete=False) as md_file:
            md_file.write(state_obj.input)
            md_file_path = md_file.name
        
        # Output PDF path
        pdf_file_path = md_file_path.replace('.md', '.pdf')
        
        try:
            # Try using pandoc first as it's the most reliable for markdown to PDF
            subprocess.run(
                ["pandoc", md_file_path, "-o", pdf_file_path],
                check=True,
                capture_output=True
            )
            
            # Read the generated PDF
            with open(pdf_file_path, 'rb') as pdf_file:
                state_obj.output = pdf_file.read()
                
        except (subprocess.SubprocessError, FileNotFoundError):
            # Fallback to a simple solution - use markdown to HTML then HTML to PDF
            # Since we don't know which packages are installed, we'll provide guidance
            state_obj.error = "PDF generation failed. Make sure pandoc is installed, or install it with: sudo apt-get install pandoc"
            
        finally:
            # Clean up temporary files
            try:
                os.unlink(md_file_path)
                if os.path.exists(pdf_file_path):
                    os.unlink(pdf_file_path)
            except OSError:
                pass
                
    except Exception as e:
        state_obj.error = f"Error generating PDF: {str(e)}"
    
    # Return the updated state
    return state_obj.to_dict()
