# Indian Language Translator

A modern web application for translating text between various Indian languages and English using Google's Generative AI.

## Features

- Support for multiple Indian languages and English
- Modern, responsive UI built with React and Material-UI
- FastAPI backend with Google's Generative AI integration
- Real-time translation
- Language swap functionality
- Error handling and loading states

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Google Generative AI API key

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Unix or MacOS
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory and add your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Select the source language from the dropdown
3. Enter the text you want to translate
4. Select the target language
5. Click the "Translate" button
6. The translated text will appear in the right text box

## Supported Languages

- English
- Hindi
- Bengali
- Telugu
- Tamil
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Urdu

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Axios

- Backend:
  - FastAPI
  - Google Generative AI
  - Python-dotenv
  - Uvicorn 