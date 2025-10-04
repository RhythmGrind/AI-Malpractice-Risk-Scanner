import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any
import pandas as pd
from app.core.config import settings
from app.schemas import SimilarCase


class VectorDatabase:
    """Vector database service for case retrieval."""

    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        self.collection_name = "malpractice_cases"
        self.collection = None

    def initialize(self):
        """Initialize or get existing collection."""
        try:
            self.collection = self.client.get_collection(name=self.collection_name)
            print(f"✅ Loaded existing collection: {self.collection_name}")
        except:
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            print(f"✅ Created new collection: {self.collection_name}")

    def load_cases_from_csv(self, csv_path: str):
        """Load malpractice cases from CSV into vector database."""
        try:
            df = pd.read_csv(csv_path)

            documents = []
            metadatas = []
            ids = []

            for idx, row in df.iterrows():
                # Create document text from facts
                doc = row['Facts']

                # Create metadata
                metadata = {
                    'case_name': str(row['Case Name']),
                    'year': int(row['Year']),
                    'specialty': str(row['Specialty']),
                    'facts': str(row['Facts']),
                    'verdict': str(row['Verdict']),
                    'key_error': str(row['Key Error']),
                    'settlement': str(row.get('Settlement', 'N/A'))
                }

                documents.append(doc)
                metadatas.append(metadata)
                ids.append(f"case_{idx}")

            # Add to collection
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )

            print(f"✅ Loaded {len(documents)} cases into vector database")
            return len(documents)

        except Exception as e:
            print(f"❌ Error loading cases: {e}")
            raise

    def search_similar_cases(
        self,
        query: str,
        n_results: int = 5
    ) -> List[SimilarCase]:
        """Search for similar cases using semantic search."""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )

            similar_cases = []

            if results['metadatas'] and results['distances']:
                for metadata, distance in zip(results['metadatas'][0], results['distances'][0]):
                    # Convert distance to similarity score (0-1)
                    similarity = 1 - distance

                    similar_case = SimilarCase(
                        case_name=metadata['case_name'],
                        year=metadata['year'],
                        specialty=metadata['specialty'],
                        facts=metadata['facts'],
                        verdict=metadata['verdict'],
                        key_error=metadata['key_error'],
                        settlement=metadata.get('settlement'),
                        similarity_score=round(similarity, 2)
                    )
                    similar_cases.append(similar_case)

            return similar_cases

        except Exception as e:
            print(f"❌ Error searching cases: {e}")
            return []

    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the collection."""
        count = self.collection.count()
        return {
            "collection_name": self.collection_name,
            "total_cases": count
        }


# Singleton instance
vector_db = VectorDatabase()
