import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { genContext } from '../contexts/GeneralContext';

const CONDITIONS = {
    'Viral Fever': ['fever', 'body ache', 'fatigue', 'headache'],
    'Common Cold': ['cough', 'sore throat', 'runny nose', 'sneezing'],
    'COVID-19': ['fever', 'cough', 'loss of smell', 'loss of taste', 'shortness of breath'],
    'Influenza': ['fever', 'chills', 'body ache', 'cough'],
    'Gastritis': ['stomach pain', 'nausea', 'vomiting', 'bloating'],
    'Migraine': ['headache', 'sensitivity to light', 'nausea', 'vomiting'],
    'Urinary Tract Infection': ['burning', 'urine', 'frequent urination', 'lower abdominal pain']
};

const suggestionTests = [
    { test: 'CBC', reason: 'General infection / anemia screening' },
    { test: 'Blood Sugar', reason: 'Check for glucose-related causes' },
    { test: 'COVID Test', reason: 'Respiratory symptoms or fever' },
    { test: 'Urine Test', reason: 'Urinary symptoms' },
    { test: 'X-Ray', reason: 'Suspected chest/lung involvement' },
    { test: 'ECG', reason: 'Chest pain or cardiac suspicion' },
    { test: 'Thyroid Test', reason: 'Fatigue, weight changes' },
    { test: 'Liver Function Test', reason: 'Abdominal pain or jaundice' }
];

const ResultsPage = () => {
    useContext(genContext); // consume context if needed elsewhere; avoid unused bindings
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [payload, setPayload] = useState(null);
    const [emergency, setEmergency] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('lastSymptomCheck') || 'null');
        if (!stored) {
            setLoading(false);
            return;
        }
        setPayload(stored);
        runPrediction(stored);
        // fetch history if user logged in
        const userEmail = stored.userEmail;
        if (userEmail) {
            fetch(`/symptom/history?userEmail=${encodeURIComponent(userEmail)}`)
                .then(r => r.json())
                .then(j => setHistory(j.data || []))
                .catch(() => {});
        }
    }, []);

    const runPrediction = async (input) => {
        setLoading(true);
        try {
            const symptoms = (input.symptoms || []).map(s => s.toLowerCase());

            // emergency detection
            const emergencyKeywords = ['chest pain', 'shortness of breath', 'severe bleeding', 'unconscious', 'sudden weakness', 'slurred speech'];
            const isEmergency = symptoms.some(s => emergencyKeywords.some(k => s.includes(k)));
            setEmergency(isEmergency);

            // score conditions
            const scores = Object.keys(CONDITIONS).map(cond => {
                const keys = CONDITIONS[cond];
                const matched = keys.filter(k => symptoms.some(s => s.includes(k)));
                const score = Math.min(95, Math.round((matched.length / Math.max(1, keys.length)) * 100));
                return { condition: cond, score, matched };
            }).sort((a, b) => b.score - a.score);

            // create recommendations
            const rec = {
                homeCare: ['Rest', 'Hydration', 'Paracetamol for fever as per instructions', 'Avoid strenuous activity'],
                diet: ['Light, easy-to-digest meals', 'Avoid spicy/fried foods if stomach upset'],
                hydration: ['Oral rehydration, clear fluids, avoid alcohol'],
                rest: ['Sleep and avoid heavy work until symptoms improve'],
                warningSigns: ['If chest pain, severe breathlessness, fainting, or uncontrolled bleeding – seek emergency care']
            };

            setResults(scores);

            // save to backend
            try {
                const toSave = { ...input, predictions: scores.slice(0, 6), recommendations: rec };
                await fetch('/symptom/assess', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toSave) });
            } catch (err) {
                console.warn('Failed to save assessment', err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <nav className="bg-greeen p-4 text-white">
                <div className="container mx-auto">
                    <button className="px-4 py-2 bg-white text-blue-500 rounded">
                        <Link className='w-full h-full' to='/symptom'>Retake the Test</Link>
                    </button>
                </div>
            </nav>
            <div className="bg-[url('https://i.ibb.co/sKhvTHc/image.png')] min-h-screen py-8">
                <div className="container mx-auto bg-white max-w-4xl p-6 rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">Symptom Assessment</h1>

                    {!payload ? (
                        <div>No symptom check data found. Please take the test first.</div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <strong>Patient:</strong> {payload.userEmail || 'Guest'} • <strong>Age:</strong> {payload.age} • <strong>Gender:</strong> {payload.gender}
                            </div>

                            {loading && <div>Running assessment...</div>}

                            {emergency && (
                                <div className="rounded p-4 mb-4 bg-red-50 border border-red-200 text-red-700">
                                    <strong>Emergency detected:</strong> Your symptoms suggest a possible medical emergency. Seek immediate medical attention or call emergency services.
                                </div>
                            )}

                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Possible Conditions</h2>
                                {results.length === 0 && !loading && <div className='text-sm text-gray-600'>No strong matches found.</div>}
                                <div className='mt-2 space-y-2'>
                                    {results.map((r) => (
                                        <div key={r.condition} className='p-2 border rounded'>
                                            <div className='flex justify-between'>
                                                <div className='font-medium'>{r.condition}</div>
                                                <div className='text-sm text-gray-600'>{r.score}%</div>
                                            </div>
                                            <div className='w-full bg-gray-100 h-2 rounded mt-2'>
                                                <div style={{ width: `${r.score}%` }} className='bg-green-500 h-2 rounded' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-4'>
                                <h2 className='text-lg font-semibold'>Recommendations</h2>
                                <ul className='list-disc pl-6'>
                                    <li>Home care: Rest, hydration, symptomatic relief as needed.</li>
                                    <li>Diet: Light, balanced meals; avoid irritants.</li>
                                    <li>Hydration: Sip oral rehydration or clear fluids.</li>
                                    <li>When to see doctor: Worsening symptoms, high fever >39°C, severe pain, persistent vomiting, or breathing difficulty.</li>
                                </ul>
                            </div>

                            <div className='mb-4'>
                                <h2 className='text-lg font-semibold'>Recommended Medical Tests</h2>
                                <ul className='list-disc pl-6'>
                                    {suggestionTests.map(t => <li key={t.test}><strong>{t.test}:</strong> {t.reason}</li>)}
                                </ul>
                            </div>

                            {history.length > 0 && (
                                <div className='mt-6'>
                                    <h3 className='font-semibold'>Past Assessments</h3>
                                    <ul className='mt-2 space-y-2'>
                                        {history.map(h => (
                                            <li key={h._id} className='p-2 border rounded'>
                                                <div className='text-sm text-gray-700'>{new Date(h.createdAt).toLocaleString()} • {h.symptoms.join(', ')}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
