require('dotenv').config();
const axios = require('axios');

// Simple in-memory cache for recent searches
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes
const CACHE_MAX = 100;

const nutrientNamesById = {
  208: 'calories',
  203: 'protein',
  205: 'carbohydrates',
  204: 'fat',
  291: 'fiber',
  269: 'sugar',
  307: 'sodium',
  601: 'cholesterol',
  306: 'potassium',
};

function mapFoodItem(item) {
  const mapped = {
    name: item.food_name || item.food_name || '',
    serving_qty: item.serving_qty || item.serving_qty || null,
    serving_unit: item.serving_unit || item.serving_unit || null,
    serving_weight_grams: item.serving_weight_grams || null,
    calories: item.nf_calories ?? null,
    protein: item.nf_protein ?? null,
    carbohydrates: item.nf_total_carbohydrate ?? null,
    fat: item.nf_total_fat ?? null,
    fiber: item.nf_dietary_fiber ?? null,
    sugar: item.nf_sugars ?? null,
    sodium: item.nf_sodium ?? null,
    cholesterol: item.nf_cholesterol ?? null,
    potassium: item.nf_potassium ?? null,
    photo: item.photo || null,
    full_nutrients: item.full_nutrients || [],
    vitamins: {},
  };

  // map some vitamins/other nutrients from full_nutrients if present
  if (Array.isArray(item.full_nutrients)) {
    item.full_nutrients.forEach(fn => {
      const id = Number(fn.attr_id);
      const name = nutrientNamesById[id];
      if (name) mapped[name] = fn.value;
      // also collect vitamins into mapped.vitamins for display
      if (id >= 401 && id <= 423) {
        // basic heuristic: attr ids in this range are vitamins/minerals
        mapped.vitamins[`id_${id}`] = fn.value;
      }
    });
  }

  return mapped;
}

function mapUSDAItem(item) {
  // item is expected from FoodData Central search results
  const nutrients = Array.isArray(item.foodNutrients) ? item.foodNutrients : [];
  const find = (names) => {
    const n = nutrients.find(nr => names.some(k => (nr.nutrientName || '').toLowerCase().includes(k)));
    return n ? n.value : null;
  };

  const mapped = {
    name: item.description || item.lowercaseDescription || item.dataType || 'Unknown',
    serving_qty: item.servingSize || 1,
    serving_unit: item.servingSizeUnit || 'serving',
    calories: find(['energy', 'kilocalories', 'calories']),
    protein: find(['protein']),
    carbohydrates: find(['carbohydrate', 'carbohydrates', 'carb']),
    fat: find(['total lipid', 'fat']),
    fiber: find(['fiber']),
    sugar: find(['sugars', 'sugar']),
    sodium: find(['sodium']),
    cholesterol: find(['cholesterol']),
    potassium: find(['potassium']),
    photo: null,
    full_nutrients: nutrients,
    vitamins: {},
  };

  return mapped;
}

const getNutritionData = async (req, res) => {
  const foodQuery = (req.body?.foodQuery || req.body?.query || '').toString().trim();

  if (!foodQuery) {
    return res.status(400).json({ error: 'Please enter a food name to search.' });
  }

  try {
    // return cached value if fresh
    const cacheKey = foodQuery.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return res.status(200).json({ foods: cached.data, query: foodQuery, cached: true });
    }

    const appId = process.env.NUTRITIONIX_APP_ID || process.env.APP_ID || '';
    const appKey = process.env.NUTRITIONIX_APP_KEY || process.env.APP_KEY || '';
    const usdaKey = process.env.USDA_API_KEY || '';

    // Prefer Nutritionix if credentials are present, otherwise fall back to USDA FoodData Central
    if (appId && appKey) {
      // Try Nutritionix first; if it returns 401/403 and USDA key exists, fall back to USDA
      try {
        const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
        const payload = { query: foodQuery };

        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': appId,
            'x-app-key': appKey,
            'User-Agent': 'HealthConnect/1.0',
          },
          timeout: 10000,
        });

        const data = response.data || {};
        const foodsRaw = Array.isArray(data.foods) ? data.foods : [];
        var foods = foodsRaw.map(mapFoodItem);
      } catch (nxErr) {
        const status = nxErr?.response?.status || nxErr?.status;
        // if auth issue and USDA key available, fall back
        if ((status === 401 || status === 403) && usdaKey) {
          const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(usdaKey)}`;
          const payload = { query: foodQuery, pageSize: 10 };
          const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
          });
          const data = response.data || {};
          const foodsRaw = Array.isArray(data.foods) ? data.foods : [];
          var foods = foodsRaw.map(mapUSDAItem);
        } else {
          // rethrow to outer catch
          throw nxErr;
        }
      }
    } else if (usdaKey) {
      // Use USDA FoodData Central search endpoint
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(usdaKey)}`;
      const payload = { query: foodQuery, pageSize: 10 };
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      const data = response.data || {};
      // response.foods is an array of food items
      const foodsRaw = Array.isArray(data.foods) ? data.foods : [];
      var foods = foodsRaw.map(mapUSDAItem);
    } else {
      return res.status(500).json({ error: 'Nutrition API credentials are not configured on the server.' });
    }

    // cache result
    try {
      if (cache.size >= CACHE_MAX) {
        // remove oldest
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(cacheKey, { ts: Date.now(), data: foods });
    } catch (e) {
      // ignore cache errors
      console.warn('Cache store error', e?.message || e);
    }

    if (foods.length === 0) {
      return res.status(200).json({ foods: [], query: foodQuery, message: 'Food not found' });
    }

    return res.status(200).json({ foods, query: foodQuery, cached: false });
  } catch (err) {
    console.error('Nutrition fetch error:', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 502;
    let msg = 'Unable to fetch nutrition information right now.';

    if (status === 401 || status === 403) {
      // return friendly message and a small mock result so the UI remains usable
      const sample = [
        {
          name: 'Apple',
          serving_qty: 1,
          serving_unit: 'medium (182 g)',
          calories: 95,
          protein: 0.5,
          carbohydrates: 25,
          fat: 0.3,
          fiber: 4.4,
          sugar: 19,
          sodium: 1,
          cholesterol: 0,
          potassium: 195,
          vitamins: { vitamin_c_mg: 8.4 }
        }
      ];
      return res.status(200).json({ foods: sample, query: foodQuery, message: 'Nutrition service authorization failed; returning sample data. Please check server credentials.' });
    } else if (err?.response?.data) {
      msg = err.response.data.message || JSON.stringify(err.response.data) || msg;
    } else if (err?.message) {
      msg = err.message;
    }

    return res.status(status).json({ error: msg, details: (process.env.NODE_ENV === 'development') ? (err?.response?.data || err?.message) : undefined });
  }
};

module.exports = { getNutritionData };