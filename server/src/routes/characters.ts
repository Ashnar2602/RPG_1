import express from 'express';
import { CharacterCreationService } from '../services/CharacterCreationService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/characters - Get user's characters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const characters = await CharacterCreationService.getUserCharacters(userId);
    res.json({ 
      success: true,
      data: characters 
    });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Errore nel recupero dei personaggi' 
    });
  }
});

// GET /api/characters/:id - Get specific character
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const character = await CharacterCreationService.getCharacterById(id);
    
    if (!character) {
      return res.status(404).json({ error: 'Personaggio non trovato' });
    }

    // Check if user owns this character
    if (character.userId !== req.user?.id) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    res.json({ character });
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ error: 'Errore nel recupero del personaggio' });
  }
});

// POST /api/characters/create - Create new character
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const characterData = req.body;
    
    // Validate required fields
    if (!characterData.name || !characterData.race || !characterData.characterClass) {
      return res.status(400).json({ 
        error: 'Campi obbligatori mancanti: name, race, characterClass' 
      });
    }

    const character = await CharacterCreationService.createCharacter(userId, characterData);
    
    res.status(201).json({ 
      message: 'Personaggio creato con successo',
      character 
    });
  } catch (error) {
    console.error('Character creation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Validation failed') || 
        errorMessage.includes('Nome personaggio già in uso') ||
        errorMessage.includes('limite massimo')) {
      return res.status(400).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: 'Errore nella creazione del personaggio' });
  }
});

// POST /api/characters/preview - Get live preview stats
router.post('/preview', authenticateToken, async (req, res) => {
  try {
    const { race, statDistribution } = req.body;
    
    if (!race || !statDistribution) {
      return res.status(400).json({ error: 'Race e statDistribution richiesti' });
    }

    const previewStats = CharacterCreationService.calculatePreviewStats(race, statDistribution);
    res.json(previewStats);
  } catch (error) {
    console.error('Preview stats error:', error);
    res.status(500).json({ error: 'Errore nel calcolo delle statistiche' });
  }
});

// GET /api/characters/data/races - Get racial bonuses data
router.get('/data/races', authenticateToken, async (req, res) => {
  try {
    const racialBonuses = CharacterCreationService.getRacialBonuses();
    res.json({ racialBonuses });
  } catch (error) {
    console.error('Get racial bonuses error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei bonus razziali' });
  }
});

// GET /api/characters/data/classes - Get class traits data
router.get('/data/classes', authenticateToken, async (req, res) => {
  try {
    const classTraits = CharacterCreationService.getClassTraits();
    res.json({ classTraits });
  } catch (error) {
    console.error('Get class traits error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei tratti delle classi' });
  }
});

// GET /api/characters/data/traits - Get selectable traits data
router.get('/data/traits', authenticateToken, async (req, res) => {
  try {
    const selectableTraits = CharacterCreationService.getSelectableTraits();
    res.json({ selectableTraits });
  } catch (error) {
    console.error('Get selectable traits error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei tratti selezionabili' });
  }
});

export default router;
