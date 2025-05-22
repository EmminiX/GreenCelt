# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# Modifications and enhancements by Emmi C (GreenCeltAI)
# SPDX-License-Identifier: MIT

from langgraph.graph import END, START, StateGraph

from src.document.graph.md_generator_node import md_generator_node
from src.document.graph.pdf_generator_node import pdf_generator_node
from src.document.graph.state import DocumentState


def build_graph():
    """Build and return the document export workflow graph."""
    # Build state graph
    builder = StateGraph(DocumentState)
    
    # Add nodes for different document formats
    builder.add_node("pdf_generator", pdf_generator_node)
    builder.add_node("md_generator", md_generator_node)
    
    # Add conditional edge from START to the appropriate generator based on format
    def route_by_format(state):
        """Route to the appropriate generator based on the format."""
        if state.format.lower() == "pdf":
            return "pdf_generator"
        else:
            return "md_generator"
    
    # Add edges
    builder.add_conditional_edges(START, route_by_format)
    builder.add_edge("pdf_generator", END)
    builder.add_edge("md_generator", END)
    
    return builder.compile()


# Create workflow instance
workflow = build_graph()

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    # Test with a simple example
    test_content = "# Test Document\n\nThis is a test document."
    
    # Test PDF generation
    pdf_state = workflow.invoke({"input": test_content, "format": "pdf"})
    if pdf_state["output"]:
        with open("test.pdf", "wb") as f:
            f.write(pdf_state["output"])
        print("PDF generated successfully")
    else:
        print(f"PDF generation failed: {pdf_state.get('error', 'Unknown error')}")
    
    # Test Markdown generation
    md_state = workflow.invoke({"input": test_content, "format": "markdown"})
    if md_state["output"]:
        with open("test.md", "wb") as f:
            f.write(md_state["output"])
        print("Markdown generated successfully")
    else:
        print(f"Markdown generation failed: {md_state.get('error', 'Unknown error')}")
