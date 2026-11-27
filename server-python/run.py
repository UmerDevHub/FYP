import uvicorn
import os
import sys
from dotenv import load_dotenv

# Set UTF-8 encoding for standard output on Windows
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print("\n==================================================")
    print(f"[FASTAPI] Service starting on: http://localhost:{port}")
    print(f"[FASTAPI] Interactive Swagger Docs: http://localhost:{port}/docs")
    print("==================================================\n")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
