import { Router } from 'express';
import { prisma } from '../utils/prisma.js';

const router = Router();

// GET /api/locations - Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json({
      success: true,
      data: locations,
      count: locations.length,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations',
    });
  }
});

// GET /api/locations/hierarchy - Get full location hierarchy 
router.get('/hierarchy', async (req, res) => {
  try {
    // Get all locations ordered by coordinates for proper positioning
    const locations = await prisma.location.findMany({
      orderBy: [
        { coordinatesX: 'asc' },
        { coordinatesY: 'asc' },
        { name: 'asc' }
      ]
    });
    
    // Group by hierarchy
    const continents = locations.filter(l => l.parentId === null);
    const regions = locations.filter(l => l.parentId && continents.some(c => c.id === l.parentId));
    const cities = locations.filter(l => l.parentId && regions.some(r => r.id === l.parentId));
    const locationDetails = locations.filter(l => l.parentId && cities.some(c => c.id === l.parentId));
    
    // Build hierarchy with proper coordinate ordering
    const hierarchy = continents
      .sort((a, b) => a.coordinatesX - b.coordinatesX) // Occidentale → Arcipelago → Orientale
      .map(continent => ({
        ...continent,
        children: regions
          .filter(r => r.parentId === continent.id)
          .sort((a, b) => a.coordinatesY - b.coordinatesY) // Top to bottom
          .map(region => ({
            ...region,
            children: cities
              .filter(c => c.parentId === region.id)
              .sort((a, b) => a.coordinatesY - b.coordinatesY) // Top to bottom
              .map(city => ({
                ...city,
                children: locationDetails
                  .filter(l => l.parentId === city.id)
                  .sort((a, b) => a.coordinatesY - b.coordinatesY) // Top to bottom
              }))
          }))
      }));
    
    res.json({
      success: true,
      data: hierarchy,
    });
  } catch (error) {
    console.error('Error fetching location hierarchy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location hierarchy',
    });
  }
});

// GET /api/locations/:id - Get specific location
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await prisma.location.findUnique({
      where: { id }
    });
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Location not found',
      });
    }
    
    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location',
    });
  }
});

export default router;
