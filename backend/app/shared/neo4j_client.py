import os
from neo4j import GraphDatabase
import logging

logger = logging.getLogger(__name__)

class Neo4jClient:
    def __init__(self):
        # Read from environment or fallback to docker-compose defaults
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "your-secure-password")
        
        try:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            logger.info(f"Connected to Neo4j at {self.uri}")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def query(self, cypher: str, parameters: dict = None):
        """
        Executes a Cypher query and returns a list of dictionaries (records).
        """
        if not self.driver:
            logger.warning("Neo4j driver is not initialized. Skipping query.")
            return []

        try:
            with self.driver.session() as session:
                result = session.run(cypher, parameters or {})
                return [record.data() for record in result]
        except Exception as e:
            logger.error(f"Neo4j query failed: {e}")
            return []
            
    def execute_write(self, cypher: str, parameters: dict = None):
        """
        Executes a write transaction in Neo4j.
        """
        if not self.driver:
            logger.warning("Neo4j driver is not initialized. Skipping write.")
            return None

        try:
            with self.driver.session() as session:
                def _write_tx(tx):
                    result = tx.run(cypher, parameters or {})
                    return [record.data() for record in result]
                return session.execute_write(_write_tx)
        except Exception as e:
            logger.error(f"Neo4j write failed: {e}")
            return None

# Singleton instance
neo4j_client = Neo4jClient()
