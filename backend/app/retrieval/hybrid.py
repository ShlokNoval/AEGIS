import logging
from typing import List
from .vector_store import vector_store
from .graph import retrieve_graph_context

logger = logging.getLogger(__name__)

def get_fused_context(query: str, collection_name: str) -> str:
    """
    Hybrid Retrieval: Fuses Vector Search (ChromaDB) and Graph Search (Neo4j).
    Returns a unified context string for the LLM prompt.
    """
    fused_blocks = []
    
    # 1. Vector Search (ChromaDB)
    try:
        vector_results = vector_store.search(collection_name=collection_name, query_texts=[query], n_results=5)
        if vector_results and 'documents' in vector_results and vector_results['documents'][0]:
            fused_blocks.append("--- SEMANTIC CONTEXT (Vector DB) ---")
            for doc in vector_results['documents'][0]:
                fused_blocks.append(f"- {doc}")
    except Exception as e:
        logger.error(f"Vector search failed: {e}")
        
    # 2. Graph Search (Neo4j)
    try:
        graph_results = retrieve_graph_context(query, hops=2)
        if graph_results:
            fused_blocks.append("\n--- RELATIONAL CONTEXT (Knowledge Graph) ---")
            for res in graph_results:
                fused_blocks.append(f"- {res}")
    except Exception as e:
        logger.error(f"Graph search failed: {e}")
        
    if not fused_blocks:
        return "No relevant context found."
        
    return "\n".join(fused_blocks)
