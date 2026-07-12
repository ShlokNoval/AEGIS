import uuid
from typing import List, Dict, Any
from .chunking import chunk_text
from .embeddings import get_embedding_model
from .vector_store import vector_store

def ingest_text(
    text: str, 
    collection_name: str, 
    source_metadata: Dict[str, Any]
) -> List[str]:
    """
    Ingests a raw text string into ChromaDB.
    1. Chunks the text
    2. Embeds the chunks using Vertex AI
    3. Stores them in ChromaDB
    
    Returns a list of generated chunk IDs.
    """
    # 1. Chunking
    docs = chunk_text(text, metadata=source_metadata)
    
    if not docs:
        return []
        
    texts = [doc.page_content for doc in docs]
    metadatas = [doc.metadata for doc in docs]
    
    # Generate unique IDs for each chunk (can append index to a base ID)
    base_id = source_metadata.get("doc_id", str(uuid.uuid4()))
    ids = [f"{base_id}_chunk_{i}" for i in range(len(texts))]
    
    # 2. Embeddings
    embedding_model = get_embedding_model()
    # Batch embed the texts
    embeddings = embedding_model.embed_documents(texts)
    
    # 3. Store in Vector DB
    vector_store.add_documents(
        collection_name=collection_name,
        documents=texts,
        metadatas=metadatas,
        ids=ids,
        embeddings=embeddings
    )
    
    return ids
