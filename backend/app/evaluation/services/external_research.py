"""
External Web Research Service.
Uses Serper API for controlled web search with provenance tracking.
Falls back gracefully if unavailable.
"""
import time
from typing import List, Dict, Any
from app.core.config import settings
from app.core.logging import logger


class ExternalResearchService:
    """Controlled external research with provenance."""

    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search the web for relevant research using Serper API.
        Returns structured results with trust classification.
        """
        if not settings.SERPER_API_KEY:
            logger.info("External research skipped: SERPER_API_KEY not configured")
            return []

        try:
            import httpx
            response = httpx.post(
                "https://google.serper.dev/search",
                headers={
                    "X-API-KEY": settings.SERPER_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "q": f"{query} research paper OR project OR technology",
                    "num": num_results,
                },
                timeout=15,
            )

            if response.status_code != 200:
                logger.warning(f"Serper API returned {response.status_code}")
                return []

            data = response.json()
            results = []

            for item in data.get("organic", [])[:num_results]:
                trust = self._classify_trust(item.get("link", ""))
                results.append({
                    "url": item.get("link", ""),
                    "title": item.get("title", ""),
                    "source": self._extract_domain(item.get("link", "")),
                    "snippet": item.get("snippet", ""),
                    "publication_date": item.get("date"),
                    "retrieved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "trust_level": trust,
                    "relevance_score": item.get("position", 10) / 10.0 if item.get("position") else 0.5,
                })

            logger.info(f"External research found {len(results)} results for: {query[:80]}")
            return results

        except Exception as e:
            logger.warning(f"External research failed (non-fatal): {e}")
            return []

    def _classify_trust(self, url: str) -> str:
        """Classify trust level based on the URL domain."""
        url_lower = url.lower()
        high_trust = [
            "gov.in", ".gov", "ieee.org", "springer.com", "sciencedirect.com",
            "nature.com", "acm.org", "arxiv.org", "nih.gov", "who.int",
            "researchgate.net", "scholar.google",
        ]
        medium_trust = [
            "wikipedia.org", "medium.com", "github.com", "stackoverflow.com",
        ]

        for domain in high_trust:
            if domain in url_lower:
                return "HIGH"
        for domain in medium_trust:
            if domain in url_lower:
                return "MEDIUM"
        return "LOW"

    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL."""
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            return parsed.netloc
        except Exception:
            return url[:50]
