import { useState, useCallback, useEffect, useRef } from 'react';
import { FiCopy, FiRefreshCcw } from 'react-icons/fi'; 
import './App.css';

function App() {
  const [length, setLength] = useState(10);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState([]);
  const [strength, setStrength] = useState('Weak');

  const passwordRef = useRef(null);

  const generatePassword = useCallback(() => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str += '0123456789';
    if (charAllowed) str += '!@#$%^&*()_+';
    if (excludeSimilar) str = str.replace(/[l1O0]/g, ''); // Exclude similar characters

    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    setHistory((prev) => [...prev, pass]); // Add to history

    // Calculate password strength
    let strengthValue = 'Weak';
    if (length >= 12 && numberAllowed && charAllowed) strengthValue = 'Strong';
    else if (length >= 8 && (numberAllowed || charAllowed)) strengthValue = 'Moderate';
    setStrength(strengthValue);
  }, [length, numberAllowed, charAllowed, excludeSimilar]);

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
    passwordRef.current?.select();
    alert('Password copied to clipboard!');
  };

  const refreshPassword = () => {
    generatePassword();
  };

  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, charAllowed, excludeSimilar, generatePassword]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-gray-900 text-white">
      <div className="w-full max-w-md bg-purple-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-6">Password Generator</h1>

        {/* Password Input with Buttons */}
        <div className="relative flex items-center mb-4">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-grow p-2 text-gray-800 bg-gray-200 rounded-l-md"
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="p-2 bg-purple-600 hover:bg-purple-700 transition-all duration-200 rounded-none relative group"
          >
            <FiCopy size={20} />
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Copy Password
            </span>
          </button>
          <button
            onClick={refreshPassword}
            className="p-2 bg-purple-600 hover:bg-purple-700 transition-all duration-200 rounded-r-md relative group"
          >
            <FiRefreshCcw size={20} />
            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Refresh Password
            </span>
          </button>
        </div>

        {/* Password Strength */}
        <p className="mb-4 text-center">
          Strength:{' '}
          <span
            className={`font-bold ${
              strength === 'Strong'
                ? 'text-green-400'
                : strength === 'Moderate'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}
          >
            {strength}
          </span>
        </p>

        {/* Length Slider */}
        <div className="mb-4">
          <label htmlFor="length" className="block text-sm mb-1">
            Length: {length}
          </label>
          <input
            type="range"
            id="length"
            min={6}
            max={24}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Options */}
        <div className="flex flex-col space-y-2 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
              className="mr-2"
            />
            Include Numbers
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
              className="mr-2"
            />
            Include Special Characters
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={() => setExcludeSimilar((prev) => !prev)}
              className="mr-2"
            />
            Exclude Similar Characters (e.g., l, 1, O, 0)
          </label>
        </div>

        <button
          onClick={() => alert(`History:\n${history.join('\n')}`)}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 transition-all duration-200 rounded-md"
        >
          Show History
        </button>
      </div>
    </div>
  );
}

export default App;




