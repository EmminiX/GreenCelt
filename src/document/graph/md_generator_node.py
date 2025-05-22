# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# Modifications and enhancements by Emmi C (GreenCeltAI)
# SPDX-License-Identifier: MIT

from typing import Dict, Any

from src.document.graph.state import DocumentState


def md_generator_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Node for preparing markdown content for download.
    
    This node takes the input markdown content and prepares it for download
    by encoding it as UTF-8 bytes.
    
    Args:
        state: The current state of the workflow.
        
    Returns:
        The updated state with the output field set.
    """
    # Create state object from dictionary
    state_obj = DocumentState(state)
    
    try:
        # For markdown, we simply encode the content as UTF-8
        if state_obj.input:
            state_obj.output = state_obj.input.encode('utf-8')
        else:
            state_obj.error = "No input content provided"
    except Exception as e:
        state_obj.error = f"Error generating markdown: {str(e)}"
    
    # Return the updated state
    return state_obj.to_dict()
