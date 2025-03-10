from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Google Generative AI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.error("GOOGLE_API_KEY not found in environment variables")
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

try:
    genai.configure(api_key=GOOGLE_API_KEY)
    logger.info("Google API configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Google API: {str(e)}")
    raise

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str

@app.get("/")
async def read_root():
    return {"message": "Language Translator API is running"}

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        logger.info(f"Received translation request: {request.source_language} -> {request.target_language}")
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Create the prompt for translation
        translation_prompt = f"Translate the following text from {request.source_language} to {request.target_language}. Only provide the translation without any additional text or explanations: {request.text}"
        
        # Generate translation
        translation_response = model.generate_content(translation_prompt)
        
        if not translation_response or not translation_response.text:
            raise ValueError("Empty response from Google API")
        
        # Create prompt for pronunciation/romanization
        pronunciation_prompt = f"""For the following text in {request.target_language}, provide the pronunciation in English script (romanization).
        If the target language is Hindi, provide a Hinglish version (mix of Hindi and English).
        For other Indian languages, provide the pronunciation in English script.
        Make it easy to read and understand.
        Text: {translation_response.text}"""
        
        # Generate pronunciation/romanization
        pronunciation_response = model.generate_content(pronunciation_prompt)
        
        if not pronunciation_response or not pronunciation_response.text:
            raise ValueError("Empty response from Google API for pronunciation")
            
        logger.info("Translation and pronunciation completed successfully")
        
        return {
            "translated_text": translation_response.text,
            "hinglish_text": pronunciation_response.text,
            "source_language": request.source_language,
            "target_language": request.target_language
        }
    except Exception as e:
        error_message = str(e)
        logger.error(f"Translation error: {error_message}")
        
        # Handle specific error cases
        if "429" in error_message or "quota" in error_message.lower():
            raise HTTPException(
                status_code=429,
                detail="API quota exceeded. Please try again later or contact support."
            )
        elif "401" in error_message or "403" in error_message:
            raise HTTPException(
                status_code=401,
                detail="Invalid API key or insufficient permissions. Please check your API key."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Translation failed: {error_message}"
            )

@app.get("/languages")
async def get_supported_languages():
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "hi", "name": "Hindi"},
            {"code": "bn", "name": "Bengali"},
            {"code": "te", "name": "Telugu"},
            {"code": "ta", "name": "Tamil"},
            {"code": "mr", "name": "Marathi"},
            {"code": "gu", "name": "Gujarati"},
            {"code": "kn", "name": "Kannada"},
            {"code": "ml", "name": "Malayalam"},
            {"code": "pa", "name": "Punjabi"},
            {"code": "ur", "name": "Urdu"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 