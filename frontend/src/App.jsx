import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Typography, 
  Paper,
  CircularProgress,
  Grid,
  Divider,
  Alert,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Fade,
  Switch,
  FormControlLabel
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';

// Create a dark theme with customizable colors
const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',      // Primary purple
      light: '#D3BFFF',     // Lighter variant
      dark: '#7D4B9D',      // Darker variant
    },
    secondary: {
      main: '#03DAC6',      // Accent teal
      light: '#66FFF9',
      dark: '#00A896',
    },
    background: {
      default: '#121212',   // Dark background
      paper: '#1E1E1E',     // Slightly lighter paper
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          // Subtle shadow for dark mode
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Extend baseTheme to include breakpoint-specific typography changes
const theme = createTheme(baseTheme, {
  typography: {
    h2: {
      ...baseTheme.typography.h2,
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '3.5rem',
      },
    },
  },
});

function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pronunciationText, setPronunciationText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorSeverity, setErrorSeverity] = useState('error');
  const [isPaperLight, setIsPaperLight] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/languages');
      setLanguages(response.data.languages);
    } catch (err) {
      setError('Failed to fetch languages');
      setErrorSeverity('error');
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setError('');
    setErrorSeverity('error');

    try {
      const response = await axios.post('http://localhost:8000/translate', {
        text: sourceText,
        source_language: sourceLanguage,
        target_language: targetLanguage
      });
      setTranslatedText(response.data.translated_text);
      setPronunciationText(response.data.hinglish_text);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 429) {
          setError('API quota exceeded. Please try again later.');
          setErrorSeverity('warning');
        } else if (status === 401) {
          setError('Invalid API key. Please check your configuration.');
          setErrorSeverity('error');
        } else {
          setError(err.response.data.detail || 'Translation failed. Please try again.');
          setErrorSeverity('error');
        }
      } else {
        setError('Network error. Please check your connection.');
        setErrorSeverity('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setPronunciationText('');
    setError('');
  };

  const getPronunciationLabel = () => {
    return targetLanguage === 'hi'
      ? "Hinglish Version (Easy to understand)"
      : "Pronunciation in English Script";
  };

  const getPronunciationHelperText = () => {
    return targetLanguage === 'hi'
      ? "This version uses a mix of Hindi and English words for better understanding"
      : "This shows how to pronounce the text in English script";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '93.7vh',
        minWidth: '100vw',
        // Dark gradient background for a modern look
        background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        py: 4
      }}>
        <Container maxWidth="xl" sx={{ width: '100%' }}>
          <Fade in timeout={1000}>
            <Box>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                mt: 1,
                mb: 1
              }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={isPaperLight}
                      onChange={() => setIsPaperLight(!isPaperLight)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {isPaperLight ? 
                        <LightModeIcon sx={{ fontSize: 18, color: '#FFD700' }} /> : 
                        <DarkModeIcon sx={{ fontSize: 18, color: '#999' }} />
                      }
                      <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                        {isPaperLight ? 'Light Mode' : 'Dark Mode'}
                      </Typography>
                    </Box>
                  }
                  labelPlacement="end"
                />
              </Box>
              
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                align="center" 
                sx={{ 
                  mb: 4, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  width: '100%'
                }}
              >
                <LanguageIcon sx={{ fontSize: { xs: 40, md: 56, lg: 64 } }} />
                Indian Language Translator
              </Typography>

              <Paper elevation={3} sx={{ 
                p: { xs: 3, md: 6 },
                width: '100%',
                maxWidth: '1800px',
                mx: 'auto',
                background: isPaperLight ? '#ffffff' : '#1f2937',
                color: isPaperLight ? '#121212' : '#e5e7eb'
              }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={5.5}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel sx={{ 
                        fontSize: '1.2rem',
                        color: isPaperLight ? '#333333' : undefined 
                      }}>From</InputLabel>
                      <Select
                        value={sourceLanguage}
                        label="From"
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        sx={{ 
                          fontSize: '1.2rem',
                          '& .MuiSelect-select': { padding: '16px' },
                          bgcolor: isPaperLight ? '#ffffff' : undefined,
                          color: isPaperLight ? '#121212' : undefined,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isPaperLight ? 'rgba(0, 0, 0, 0.23)' : undefined
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: isPaperLight ? '#ffffff' : undefined,
                              color: isPaperLight ? '#121212' : undefined,
                            }
                          }
                        }}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code} sx={{ 
                            fontSize: '1.2rem',
                            color: isPaperLight ? '#121212' : undefined 
                          }}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      variant="outlined"
                      label="Enter text to translate"
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Type or paste your text here..."
                      sx={{ 
                        '& .MuiInputBase-root': { 
                          fontSize: '1.3rem',
                          padding: '16px',
                          bgcolor: isPaperLight ? '#ffffff' : undefined,
                          color: isPaperLight ? '#121212' : undefined,
                        },
                        '& .MuiInputLabel-root': { 
                          fontSize: '1.2rem',
                          color: isPaperLight ? '#333333' : undefined 
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isPaperLight ? 'rgba(0, 0, 0, 0.23)' : undefined
                        },
                        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: isPaperLight ? theme.palette.primary.main : undefined
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={1} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <Tooltip title="Swap languages">
                      <IconButton
                        color="primary"
                        onClick={swapLanguages}
                        sx={{ 
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'white'
                          },
                          width: 64,
                          height: 64
                        }}
                      >
                        <SwapHorizIcon sx={{ fontSize: 40 }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} md={5.5}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel sx={{ 
                        fontSize: '1.2rem',
                        color: isPaperLight ? '#333333' : undefined 
                      }}>To</InputLabel>
                      <Select
                        value={targetLanguage}
                        label="To"
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        sx={{ 
                          fontSize: '1.2rem',
                          '& .MuiSelect-select': { padding: '16px' },
                          bgcolor: isPaperLight ? '#ffffff' : undefined,
                          color: isPaperLight ? '#121212' : undefined,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isPaperLight ? 'rgba(0, 0, 0, 0.23)' : undefined
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: isPaperLight ? '#ffffff' : undefined,
                              color: isPaperLight ? '#121212' : undefined,
                            }
                          }
                        }}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code} sx={{ 
                            fontSize: '1.2rem',
                            color: isPaperLight ? '#121212' : undefined 
                          }}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      variant="outlined"
                      label="Translation"
                      value={translatedText}
                      InputProps={{ readOnly: true }}
                      sx={{ 
                        '& .MuiInputBase-root': { 
                          fontSize: '1.3rem',
                          padding: '16px',
                          bgcolor: isPaperLight ? '#ffffff' : undefined,
                          color: isPaperLight ? '#121212' : undefined,
                        },
                        '& .MuiInputLabel-root': { 
                          fontSize: '1.2rem',
                          color: isPaperLight ? '#333333' : undefined 
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isPaperLight ? 'rgba(0, 0, 0, 0.23)' : undefined
                        }
                      }}
                    />
                    <Divider sx={{ 
                      my: 3,
                      borderColor: isPaperLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' 
                    }} />
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      variant="outlined"
                      label={getPronunciationLabel()}
                      value={pronunciationText}
                      InputProps={{ readOnly: true }}
                      helperText={getPronunciationHelperText()}
                      sx={{ 
                        '& .MuiInputBase-root': { 
                          fontSize: '1.3rem',
                          padding: '16px',
                          bgcolor: isPaperLight ? '#ffffff' : undefined,
                          color: isPaperLight ? '#121212' : undefined,
                        },
                        '& .MuiInputLabel-root': { 
                          fontSize: '1.2rem',
                          color: isPaperLight ? '#333333' : undefined 
                        },
                        '& .MuiFormHelperText-root': { 
                          fontSize: '1rem',
                          mt: 1,
                          color: isPaperLight ? '#555555' : undefined
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isPaperLight ? 'rgba(0, 0, 0, 0.23)' : undefined
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ 
                  mt: 5, 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: 3
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTranslate}
                    disabled={loading || !sourceText.trim()}
                    startIcon={loading ? <CircularProgress size={28} /> : <TranslateIcon sx={{ fontSize: 32 }} />}
                    sx={{ 
                      minWidth: 280,
                      py: 2,
                      px: 6,
                      fontSize: '1.4rem',
                      boxShadow: 3,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    {loading ? 'Translating...' : 'Translate'}
                  </Button>
                </Box>

                {error && (
                  <Alert 
                    severity={errorSeverity} 
                    sx={{ 
                      mt: 4,
                      borderRadius: 2,
                      boxShadow: 2,
                      fontSize: '1.2rem',
                      '& .MuiAlert-icon': { fontSize: '2rem' }
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
