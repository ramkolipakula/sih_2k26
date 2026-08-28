"""
LLM Provider Abstraction Layer.

Supports OpenAI, Anthropic, and Google Generative AI with
structured JSON output, retries, timeouts, and fallback.
"""
import json
import time
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Type, TypeVar
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import logger

T = TypeVar("T", bound=BaseModel)


class LLMResponse:
    """Standardized LLM response wrapper."""
    def __init__(self, content: str, provider: str, model: str, 
                 usage: Dict[str, int], latency_ms: float):
        self.content = content
        self.provider = provider
        self.model = model
        self.usage = usage
        self.latency_ms = latency_ms

    def parse_json(self) -> Dict[str, Any]:
        """Parse the response content as JSON."""
        text = self.content.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            text = "\n".join(lines)
        return json.loads(text)

    def parse_model(self, model_class: Type[T]) -> T:
        """Parse the response content into a Pydantic model."""
        data = self.parse_json()
        return model_class.model_validate(data)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str,
                 temperature: float = 0.1, max_tokens: int = 4096,
                 json_mode: bool = True) -> LLMResponse:
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI API provider (GPT-4o, GPT-4o-mini, etc.)."""

    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        from openai import OpenAI
        self.client = OpenAI(api_key=api_key, timeout=settings.LLM_TIMEOUT)
        self.model = model

    @property
    def provider_name(self) -> str:
        return "openai"

    def generate(self, system_prompt: str, user_prompt: str,
                 temperature: float = 0.1, max_tokens: int = 4096,
                 json_mode: bool = True) -> LLMResponse:
        start = time.time()
        kwargs = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        resp = self.client.chat.completions.create(**kwargs)
        latency = (time.time() - start) * 1000

        return LLMResponse(
            content=resp.choices[0].message.content,
            provider="openai",
            model=self.model,
            usage={
                "prompt_tokens": resp.usage.prompt_tokens,
                "completion_tokens": resp.usage.completion_tokens,
                "total_tokens": resp.usage.total_tokens,
            },
            latency_ms=latency,
        )


class AnthropicProvider(LLMProvider):
    """Anthropic API provider (Claude)."""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-20250514"):
        from anthropic import Anthropic
        self.client = Anthropic(api_key=api_key, timeout=settings.LLM_TIMEOUT)
        self.model = model

    @property
    def provider_name(self) -> str:
        return "anthropic"

    def generate(self, system_prompt: str, user_prompt: str,
                 temperature: float = 0.1, max_tokens: int = 4096,
                 json_mode: bool = True) -> LLMResponse:
        start = time.time()

        messages = [{"role": "user", "content": user_prompt}]
        if json_mode:
            system_prompt += "\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no explanation outside JSON."

        resp = self.client.messages.create(
            model=self.model,
            system=system_prompt,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        latency = (time.time() - start) * 1000
        content = resp.content[0].text

        return LLMResponse(
            content=content,
            provider="anthropic",
            model=self.model,
            usage={
                "prompt_tokens": resp.usage.input_tokens,
                "completion_tokens": resp.usage.output_tokens,
                "total_tokens": resp.usage.input_tokens + resp.usage.output_tokens,
            },
            latency_ms=latency,
        )


class GoogleProvider(LLMProvider):
    """Google Generative AI provider (Gemini)."""

    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        self._genai = genai
        self.model = model

    @property
    def provider_name(self) -> str:
        return "google"

    def generate(self, system_prompt: str, user_prompt: str,
                 temperature: float = 0.1, max_tokens: int = 4096,
                 json_mode: bool = True) -> LLMResponse:
        start = time.time()
        model = self._genai.GenerativeModel(
            model_name=self.model,
            system_instruction=system_prompt,
            generation_config=self._genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
                response_mime_type="application/json" if json_mode else "text/plain",
            ),
        )
        resp = model.generate_content(user_prompt)
        latency = (time.time() - start) * 1000

        usage = {}
        if hasattr(resp, "usage_metadata") and resp.usage_metadata:
            usage = {
                "prompt_tokens": getattr(resp.usage_metadata, "prompt_token_count", 0),
                "completion_tokens": getattr(resp.usage_metadata, "candidates_token_count", 0),
                "total_tokens": getattr(resp.usage_metadata, "total_token_count", 0),
            }

        return LLMResponse(
            content=resp.text,
            provider="google",
            model=self.model,
            usage=usage,
            latency_ms=latency,
        )


class GroqProvider(LLMProvider):
    """Groq API provider."""

    def __init__(self, api_key: str, model: str = "openai/gpt-oss-20b"):
        from openai import OpenAI
        self.client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1", timeout=settings.LLM_TIMEOUT)
        self.model = model

    @property
    def provider_name(self) -> str:
        return "groq"

    def generate(self, system_prompt: str, user_prompt: str,
                 temperature: float = 0.1, max_tokens: int = 4096,
                 json_mode: bool = True) -> LLMResponse:
        start = time.time()
        kwargs = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        resp = self.client.chat.completions.create(**kwargs)
        latency = (time.time() - start) * 1000

        return LLMResponse(
            content=resp.choices[0].message.content,
            provider="groq",
            model=self.model,
            usage={
                "prompt_tokens": resp.usage.prompt_tokens if resp.usage else 0,
                "completion_tokens": resp.usage.completion_tokens if resp.usage else 0,
                "total_tokens": resp.usage.total_tokens if resp.usage else 0,
            },
            latency_ms=latency,
        )


def get_provider(provider_name: str = None, model: str = None) -> LLMProvider:
    """Factory function to get the configured LLM provider."""
    name = (provider_name or settings.LLM_PROVIDER).lower()
    mdl = model or settings.LLM_MODEL

    if name == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not set")
        return OpenAIProvider(api_key=settings.OPENAI_API_KEY, model=mdl)
    elif name == "anthropic":
        if not settings.ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY not set")
        return AnthropicProvider(api_key=settings.ANTHROPIC_API_KEY, model=mdl)
    elif name == "google":
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not set")
        return GoogleProvider(api_key=settings.GOOGLE_API_KEY, model=mdl)
    elif name == "groq":
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not set")
        return GroqProvider(api_key=settings.GROQ_API_KEY, model=mdl)
    else:
        raise ValueError(f"Unknown LLM provider: {name}")


def llm_generate(system_prompt: str, user_prompt: str,
                 temperature: float = None, max_tokens: int = 4096,
                 json_mode: bool = True, provider_name: str = None,
                 model: str = None) -> LLMResponse:
    """
    High-level LLM call with retry and fallback.
    This is the primary entry point for all AI calls in the system.
    """
    temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
    retries = settings.LLM_MAX_RETRIES
    last_error = None

    # Try primary provider
    for attempt in range(retries + 1):
        try:
            provider = get_provider(provider_name, model)
            response = provider.generate(system_prompt, user_prompt,
                                         temperature=temp, max_tokens=max_tokens,
                                         json_mode=json_mode)
            logger.info(
                f"LLM call succeeded: provider={response.provider} model={response.model} "
                f"tokens={response.usage.get('total_tokens', '?')} latency={response.latency_ms:.0f}ms"
            )
            return response
        except Exception as e:
            last_error = e
            logger.warning(f"LLM attempt {attempt+1}/{retries+1} failed: {e}")
            if attempt < retries:
                time.sleep(2 ** attempt)

    # Try fallback provider if configured
    if settings.LLM_FALLBACK_PROVIDER:
        logger.info(f"Falling back to {settings.LLM_FALLBACK_PROVIDER}")
        try:
            provider = get_provider(settings.LLM_FALLBACK_PROVIDER, settings.LLM_FALLBACK_MODEL)
            response = provider.generate(system_prompt, user_prompt,
                                         temperature=temp, max_tokens=max_tokens,
                                         json_mode=json_mode)
            logger.info(f"Fallback LLM call succeeded: {response.provider}/{response.model}")
            return response
        except Exception as e:
            logger.error(f"Fallback LLM also failed: {e}")

    raise RuntimeError(f"All LLM providers failed. Last error: {last_error}")
