import sys
import os

# Add project root directory to python path for Vercel Serverless runtime
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.main import app

# Export ASGI application for Vercel Serverless
handler = app
