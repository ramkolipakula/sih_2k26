from qdrant_client import QdrantClient

client = QdrantClient(url="http://127.0.0.1:6333")
try:
    cols = client.get_collections()
    print("Collections:", cols)
    
    vec = [0.1] * 384
    res = client.search(collection_name="rd_knowledge", query_vector=vec, limit=1)
    print("Search result:", res)
except Exception as e:
    print("Error:", e)
