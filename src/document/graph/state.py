# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# Modifications and enhancements by Emmi C (GreenCeltAI)
# SPDX-License-Identifier: MIT

from typing import Any, Dict, Optional, Union
from dataclasses import dataclass


@dataclass
class DocumentState:
    """
    State for the document export workflow.
    """
    input: str = ""  # The markdown content to convert
    format: str = "pdf"  # The format to convert to (pdf or markdown)
    output: Optional[bytes] = None  # The output document as bytes
    error: Optional[str] = None  # Error message if any
    
    def __init__(self, state: Optional[Dict[str, Any]] = None):
        """
        Initialize the state.
        """
        if state is None:
            state = {}
        self.input = state.get("input", "")
        self.format = state.get("format", "pdf")
        self.output = state.get("output")
        self.error = state.get("error")
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the state to a dictionary.
        """
        return {
            "input": self.input,
            "format": self.format,
            "output": self.output,
            "error": self.error,
        }
