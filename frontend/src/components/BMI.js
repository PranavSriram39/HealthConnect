import React, { useState } from 'react';

const BMICalculator = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        const ageNum = parseInt(age);

        if (weightNum <= 0 || heightNum <= 0 || ageNum <= 0) {
            alert("Please enter valid weight, height, and age.");
            return;
        }

        const bmi = weightNum / (heightNum * heightNum);
        let resultText = `Your BMI is: ${bmi.toFixed(2)}. `;
        let classification = '';

        if (gender === 'male') {
            if (bmi < 18.5) {
                classification = "Underweight";
                resultText += "You are considered underweight. It's important to consult with a healthcare professional to determine a healthy weight gain plan.";
            } else if (bmi >= 18.5 && bmi < 25) {
                classification = "Normal weight";
                resultText += "Congratulations! You are within the normal weight range. Keep maintaining a healthy lifestyle.";
            } else if (bmi >= 25 && bmi < 30) {
                classification = "Overweight";
                resultText += "You are considered overweight. Consider adopting a balanced diet and regular exercise routine to manage your weight.";
            } else {
                classification = "Obese";
                resultText += "You are considered obese. It's important to consult with a healthcare professional to develop a weight loss plan.";
            }
        } else {
            if (bmi < 18.5) {
                classification = "Underweight";
                resultText += "\nYou are considered underweight. It's important to consult with a healthcare professional to determine a healthy weight gain plan.";
            } else if (bmi >= 18.5 && bmi < 24) {
                classification = "Normal weight";
                resultText += "Congratulations! You are within the normal weight range. Keep maintaining a healthy lifestyle.";
            } else if (bmi >= 24 && bmi < 29) {
                classification = "Overweight";
                resultText += "You are considered overweight. Consider adopting a balanced diet and regular exercise routine to manage your weight.";
            } else {
                classification = "Obese";
                resultText += "You are considered obese. It's important to consult with a healthcare professional to develop a weight loss plan.";
            }
        }

        if (ageNum < 18) {
            resultText += " (Consult a doctor for BMI interpretation for individuals under 18 years of age)";
        }

        setResult({ bmi: bmi.toFixed(2), classification, result: resultText });
    }

    return (
        <div className="flex bg-[url('https://i.ibb.co/tJkCLrK/16404766-v870-tang-37.png')] flex-col justify-center items-center h-screen ">
            <div className="bg-white rounded-lg shadow-md p-6 w-full sm:w-96">
                <h2 className="text-xl font-bold mb-4">BMI Calculator</h2>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="weight" className="mb-1">Weight (kg):</label>
                        <input type="number" id="weight" name="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required className="border border-gray-400 rounded-md p-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="height" className="mb-1">Height (m):</label>
                        <input type="number" id="height" name="height" value={height} onChange={(e) => setHeight(e.target.value)} required className="border border-gray-400 rounded-md p-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="age" className="mb-1">Age:</label>
                        <input type="number" id="age" name="age" value={age} onChange={(e) => setAge(e.target.value)} required className="border border-gray-400 rounded-md p-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="gender" className="mb-1">Gender:</label>
                        <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="border border-gray-400 rounded-md p-2">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Calculate BMI</button>
                </form>
                {result && (
                    <div className="bg-gray-100 p-4 rounded-md text-xl font-bold text-center">
                        <p>{result.result}</p>
                        <table className="w-full mt-4">
                            <tbody>
                                <tr>
                                    <td>Classification:</td>
                                    <td>{result.classification}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BMICalculator;
