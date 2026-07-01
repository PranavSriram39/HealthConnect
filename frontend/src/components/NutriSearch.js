import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { genContext } from '../contexts/GeneralContext';

const NutriSearch = () => {
  const { setNutri } = useContext(genContext);

  const handleInputChange = (e) => {
    setNutri(e.target.value);
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-gray-100 flex items-center justify-center" style={{ backgroundImage: 'url("https://source.unsplash.com/1920x1080/?food")' }}>
      <div className="w-full max-w-2xl bg-gray-800 bg-opacity-98 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 text-white text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Nutrients in Your Food</h1>
          <p className="text-base md:text-lg mb-6">
            Choose a diet filled with vibrant fruits, veggies, whole grains, and lean proteins for a healthier body and mind. Dive into nutrient-packed salads, hearty soups, and energizing snacks like nuts and seeds. Keep hydrated with water and herbal teas. Mindfully enjoying each meal creates a balanced connection with food, enhancing well-being.
          </p>

          <form className="mb-4">
            <label htmlFor="food" className="block text-sm md:text-lg text-slate-200 font-bold mb-2">Enter the Food Name:</label>
            <input
              onChange={handleInputChange}
              type="text"
              id="food"
              name="food"
              className="w-full text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="E.g., Avocado Toast"
            />
            <Link to="/nutrition">
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-white text-lg font-semibold transition duration-300 ease-in-out"
              >
                Get Nutritional Info
              </button>
            </Link>
          </form>

          <p className="text-xs md:text-sm text-gray-300">We'd love to hear about your food choice!</p>
        </div>
      </div>
    </div>
  );
};

export default NutriSearch;
