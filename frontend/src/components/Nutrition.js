import { useContext, useEffect, useMemo, useState } from 'react';
import { genContext } from '../contexts/GeneralContext';

const Nutrition = () => {
  const { nutri } = useContext(genContext);
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentNutritionSearches') || '[]');
    } catch {
      return [];
    }
  });

  const nutrientRows = useMemo(() => {
    if (!selectedFood) return [];
    const name = selectedFood.food_name || selectedFood.name || 'N/A';
    const serving_qty = selectedFood.serving_qty ?? selectedFood.servingQty ?? 1;
    const serving_unit = selectedFood.serving_unit || selectedFood.serving_unit || 'serving';

    const get = (oldKey, newKey) => selectedFood[oldKey] ?? selectedFood[newKey] ?? 'N/A';

    return [
      { label: 'Food Name', value: name },
      { label: 'Serving Size', value: `${serving_qty} ${serving_unit}` },
      { label: 'Calories', value: `${get('nf_calories', 'calories')} kcal` },
      { label: 'Protein', value: `${get('nf_protein', 'protein')} g` },
      { label: 'Carbohydrates', value: `${get('nf_total_carbohydrate', 'carbohydrates')} g` },
      { label: 'Fat', value: `${get('nf_total_fat', 'fat')} g` },
      { label: 'Fiber', value: `${get('nf_dietary_fiber', 'fiber')} g` },
      { label: 'Sugar', value: `${get('nf_sugars', 'sugar')} g` },
      { label: 'Sodium', value: `${get('nf_sodium', 'sodium')} mg` },
      { label: 'Cholesterol', value: `${get('nf_cholesterol', 'cholesterol')} mg` },
      { label: 'Potassium', value: `${get('nf_potassium', 'potassium')} mg` },
      { label: 'Vitamins', value: selectedFood.vitamins && Object.keys(selectedFood.vitamins).length > 0 ? JSON.stringify(selectedFood.vitamins) : 'Not available' },
    ];
  }, [selectedFood]);

  useEffect(() => {
    if (nutri) {
      setQuery(nutri);
      handleSearch(nutri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nutri]);

  const persistSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter((item) => item !== trimmed)].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem('recentNutritionSearches', JSON.stringify(next));
  };

  const handleSearch = async (value = query) => {
    const term = value?.trim();
    if (!term) {
      setError('Please enter a food item to search.');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedFood(null);
    setFoods([]);

    try {
      const response = await fetch('/api/nutrition/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: term }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || 'Unable to fetch nutrition data.');
      }

      const matchedFoods = Array.isArray(json.foods) ? json.foods : [];
      setFoods(matchedFoods);
      if (matchedFoods.length > 0) {
        setSelectedFood(matchedFoods[0]);
      } else {
        setError('Food not found. Try another item.');
      }
      persistSearch(term);
    } catch (err) {
      setError(err.message || 'Unable to fetch nutrition information right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: 'url("https://source.unsplash.com/1920x1080/?food")' }} className='min-h-screen bg-cover bg-no-repeat'>
      <div className='min-h-screen bg-white/90 px-4 py-8 md:px-8'>
        <div className='mx-auto flex max-w-6xl flex-col gap-6 rounded-xl bg-white p-6 shadow-lg'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-green-700'>Nutrition Search</h1>
            <p className='mt-2 text-sm text-gray-600'>Search foods to view calories, macros, and other nutrition details.</p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
            <div className='flex flex-col gap-3 md:flex-row'>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleSearch())}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-800'
                placeholder='Try Apple, Rice, Chicken, Pizza...'
              />
              <button
                onClick={() => handleSearch()}
                className='rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700'
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {recentSearches.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {recentSearches.map((item) => (
                  <button key={item} onClick={() => { setQuery(item); handleSearch(item); }} className='rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600'>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <div className='rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700'>
              <svg className='inline mr-2 h-5 w-5 animate-spin text-blue-600' viewBox='0 0 24 24'>
                <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' opacity='0.25' />
                <path d='M22 12a10 10 0 00-10-10' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
              </svg>
              Loading nutrition details...
            </div>
          )}

          {error && !loading && <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700'>{error}</div>}

          {!loading && foods.length > 1 && (
            <div className='rounded-lg border border-gray-200 p-4'>
              <h2 className='mb-3 text-lg font-semibold text-gray-700'>Choose a match</h2>
              <div className='flex flex-wrap gap-2'>
                {foods.map((food, index) => {
                  const label = food.food_name || food.name || `Match ${index + 1}`;
                  const isSelected = (selectedFood?.food_name || selectedFood?.name) === (food.food_name || food.name);
                  return (
                    <button key={`${label}-${index}`} onClick={() => setSelectedFood(food)} className={`rounded-full px-3 py-2 text-sm ${isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedFood && (
            <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
              <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-2xl font-semibold text-gray-800'>{selectedFood.food_name}</h2>
                    <p className='mt-1 text-sm text-gray-500'>Serving size: {selectedFood.serving_qty || 1} {selectedFood.serving_unit || 'serving'}</p>
                  </div>
                </div>

                <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                  {nutrientRows.map((item) => (
                    <div key={item.label} className='rounded-lg bg-gray-50 p-3'>
                      <p className='text-sm font-medium text-gray-500'>{item.label}</p>
                      <p className='mt-1 text-base font-semibold text-gray-800'>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
                <h3 className='text-xl font-semibold text-gray-800'>Food Image</h3>
                {selectedFood.photo?.thumb ? (
                  <img src={selectedFood.photo.thumb} alt={selectedFood.food_name} className='mt-4 w-full rounded-lg object-cover' />
                ) : (
                  <div className='mt-4 flex h-40 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500'>No image available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
