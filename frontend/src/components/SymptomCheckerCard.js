import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { genContext } from '../contexts/GeneralContext';

const SymptomCheckerCard = () => {

  const { yearOfBirth, setYearOfBirth, gender, setGender, symptoms, setSymptoms } = useContext(genContext)
  const [dropdownSymptoms, setDropdownSymptoms] = useState([]);

  const [symptomInput, setSymptomInput] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [otherConditions, setOtherConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [temperature, setTemperature] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddTypedSymptom = () => {
    const val = symptomInput?.trim();
    if (!val) return;
    if (symptoms.includes(val)) {
      setSymptomInput('');
      return;
    }
    setSymptoms((prev) => [...prev.filter(Boolean), val]);
    setSymptomInput('');
  };

  const handleDeleteSymptom = (index) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms.splice(index, 1);
    setSymptoms(updatedSymptoms);
  };

  const getAllSymptoms = async () => {
    try {
      const response = await fetch('/symptom/getallSymptoms');
      const json = await response.json();
      setDropdownSymptoms(json.data || []);
    } catch (err) {
      console.error('Failed to load symptoms list', err);
      setDropdownSymptoms([]);
    }
  };

  const validate = () => {
    const next = {};
    if (!symptoms || symptoms.filter(Boolean).length === 0) next.symptoms = 'Please add at least one symptom.';
    if (!yearOfBirth) next.yearOfBirth = 'Please enter age.';
    if (!gender) next.gender = 'Please select gender.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSeeResults = async () => {
    if (!validate()) return;

    const payload = {
      age: yearOfBirth,
      gender,
      symptoms: symptoms.filter(Boolean),
      otherConditions,
      medications,
      duration,
      severity,
      temperature,
      userEmail: JSON.parse(localStorage.getItem('user') || 'null')?.email || null,
    };

    localStorage.setItem('lastSymptomCheck', JSON.stringify(payload));
    // navigation handled by Link
  };

  useEffect(() => {
    // restore any saved draft
    const draft = JSON.parse(localStorage.getItem('lastSymptomDraft') || 'null');
    if (draft) {
      setYearOfBirth(draft.age || '');
      setGender(draft.gender || '');
      setSymptoms(draft.symptoms || ['']);
      setOtherConditions(draft.otherConditions || '');
      setMedications(draft.medications || '');
      setDuration(draft.duration || '');
      setSeverity(draft.severity || 5);
      setTemperature(draft.temperature || '');
    } else {
      setYearOfBirth('');
      setGender('');
      setSymptoms(['']);
    }
    getAllSymptoms();
  }, [setYearOfBirth, setGender, setSymptoms]);

  return (
    <div className="bg-[url('https://i.ibb.co/sKhvTHc/image.png')]">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card style={{ width: '100%', maxWidth: '500px', padding: '16px' }}>
          <CardContent>
            <h4 className='font-extrabold'>Symptom Checker</h4>
            <form>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="year-of-birth" shrink>
                  Age
                </InputLabel>
                <Input
                  id="year-of-birth"
                  type="number"
                  value={yearOfBirth}
                  onChange={(e) => setYearOfBirth(e.target.value)}
                  // no startAdornment to avoid invalid ReactNode warnings
                  style={{ marginBottom: '8px' }}
                />
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  label="Gender"
                  labelId="gender-label"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle1" gutterBottom>
                Symptoms (add multiple, press Enter to add):
              </Typography>

              <div className="mb-3 flex flex-wrap gap-2">
                {symptoms.filter(Boolean).map((s, i) => (
                  <div key={`${s}-${i}`} className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                    <span className="text-sm text-gray-700">{s}</span>
                    <button type="button" onClick={() => handleDeleteSymptom(i)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-3">
                <input
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTypedSymptom())}
                  list="symptom-list"
                  placeholder="Type symptom (e.g., fever, cough)"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                />
                <datalist id="symptom-list">
                  {dropdownSymptoms.map((opt) => <option key={opt.ID} value={opt.Name} />)}
                </datalist>
                <Button onClick={handleAddTypedSymptom} size="small" variant="contained" style={{ backgroundColor: '#4CAF50' }}>Add</Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <TextField label="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
                <TextField label="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
                <TextField label="Existing Conditions" value={otherConditions} onChange={(e) => setOtherConditions(e.target.value)} fullWidth className="col-span-2" />
                <TextField label="Current Medications" value={medications} onChange={(e) => setMedications(e.target.value)} fullWidth className="col-span-2" />
                <TextField label="Duration (e.g., 3 days)" value={duration} onChange={(e) => setDuration(e.target.value)} />
                <TextField label="Severity (1-10)" type="number" inputProps={{ min: 1, max: 10 }} value={severity} onChange={(e) => setSeverity(e.target.value)} />
                <TextField label="Body Temperature (°C)" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </div>

              {errors.symptoms && <div className='text-sm text-red-600 mt-2'>{errors.symptoms}</div>}
              {errors.yearOfBirth && <div className='text-sm text-red-600 mt-2'>{errors.yearOfBirth}</div>}
              {errors.gender && <div className='text-sm text-red-600 mt-2'>{errors.gender}</div>}

              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSeeResults} fullWidth style={{ backgroundColor: '#4CAF50' }}>
                  <Link className='w-ful h-full text-white' to='/symptomres'>See Results</Link>
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomCheckerCard;