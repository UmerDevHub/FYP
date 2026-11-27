from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/fyp_db"
    NODE_API_URL: Optional[str] = "http://localhost:5000"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
