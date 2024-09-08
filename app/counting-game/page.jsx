"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star} from 'lucide-react';
// import { Switch } from '@/components/ui/switch';

const CountingGame = () => {
    const [currentNumber, setCurrentNumber] = useState(1);
    const [options, setOptions] = useState([]);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);
    const [lastClickedIndex, setLastClickedIndex] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [incorrectAttempts, setIncorrectAttempts] = useState({});
    const [isWordMode, setIsWordMode] = useState(false);
    const [gameHistory, setGameHistory] = useState([]);
    const [currentGameId, setCurrentGameId] = useState(1);

    const numberWords = [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
        'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
        'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'forty',
        'forty-one', 'forty-two', 'forty-three', 'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine', 'fifty',
        'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty',
        'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine', 'seventy',
        'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five', 'seventy-six', 'seventy-seven', 'seventy-eight', 'seventy-nine', 'eighty',
        'eighty-one', 'eighty-two', 'eighty-three', 'eighty-four', 'eighty-five', 'eighty-six', 'eighty-seven', 'eighty-eight', 'eighty-nine', 'ninety',
        'ninety-one', 'ninety-two', 'ninety-three', 'ninety-four', 'ninety-five', 'ninety-six', 'ninety-seven', 'ninety-eight', 'ninety-nine', 'one hundred'
    ];

    useEffect(() => {
        generateOptions();
    }, [currentNumber, isWordMode]);

    const generateOptions = () => {
        const correctOption = currentNumber + 1;
        let newOptions = [correctOption];
        while (newOptions.length < 4) {
            const randomOption = Math.floor(Math.random() * 100) + 1;
            if (!newOptions.includes(randomOption) && randomOption !== currentNumber) {
                newOptions.push(randomOption);
            }
        }
        setOptions(newOptions.sort(() => Math.random() - 0.5));
        setLastClickedIndex(null);
        // setFeedback(null);
    };

    const handleOptionClick = (selectedNumber, index) => {
        if (!isGameActive || lastClickedIndex !== null) return;

        setLastClickedIndex(index);

        if (selectedNumber === currentNumber + 1) {
            const pointsEarned = Math.min(streak + 1, 3);
            setScore(score + pointsEarned);
            setStreak(streak + 1);
            setFeedback({ type: 'correct', message: `👍 Great job! +${pointsEarned} points` });

            if (currentNumber === 99) {
                setIsGameActive(false);
                setFeedback({ type: 'complete', message: '🎉 You counted to 100!' });
                saveGameHistory();
            } else {
                setTimeout(() => {
                    setCurrentNumber(currentNumber + 1);
                }, 400);
            }
        } else {
            setStreak(0);
            setFeedback({ type: 'incorrect', message: '❌ Try again!' });
            setIncorrectAttempts(prev => ({
                ...prev,
                [currentNumber]: (prev[currentNumber] || 0) + 1
            }));
            setTimeout(() => {
                setLastClickedIndex(null);
                // setFeedback(null);
            }, 1000);
        }
    };

    const renderStars = () => {
        const filledStars = Math.min(streak, 3);
        return (
            <div className="flex items-center">
                {[...Array(3)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-8 h-8 ${i < filledStars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                ))}
                {streak > 3 && (
                    <span className="ml-2 text-2xl font-bold text-yellow-500">+{streak - 3}</span>
                )}
            </div>
        );
    };

    const getButtonColor = (index) => {
        if (lastClickedIndex === null) return 'bg-blue-500 hover:bg-blue-600';
        if (index === lastClickedIndex) {
            return options[index] === currentNumber + 1
                ? 'bg-green-500 animate-pulse'
                : 'bg-red-500';
        }
        return 'bg-blue-500';
    };

    const toggleMode = () => {
        setIsWordMode(!isWordMode);
        // We're no longer resetting the game here
        generateOptions(); // Regenerate options for the new mode
    };

    const resetGame = () => {
        setCurrentNumber(1);
        setStreak(0);
        setScore(0);
        setIncorrectAttempts({});
        setFeedback(null)
        setIsGameActive(true);
        setCurrentGameId(prev => prev + 1);
        generateOptions();
    };

    const saveGameHistory = () => {
        const totalAttempts = currentNumber + Object.values(incorrectAttempts).reduce((a, b) => a + b, 0);
        const percentageCorrect = ((currentNumber / totalAttempts) * 100).toFixed(2);

        const newHistory = {
            id: currentGameId,
            date: new Date().toLocaleString(),
            mode: isWordMode ? 'Word' : 'Number',
            score: score,
            percentageCorrect: percentageCorrect,
            incorrectAttempts: incorrectAttempts
        };

        setGameHistory(prev => [newHistory, ...prev]);
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-blue-600">Count to 100!</h1>
                <div className="flex items-center">
                    <span className="mr-2 text-primary">Word Mode</span>
                    <Switch checked={isWordMode} onCheckedChange={toggleMode} />
                </div>
            </div>
            <Progress value={currentNumber} max={100} className="mb-4 h-4" />
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
                <span className="text-4xl font-bold text-purple-600">
                    {isWordMode ? numberWords[currentNumber - 1] : currentNumber}
                </span>
                {renderStars()}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {options.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleOptionClick(option, index)}
                        className={`text-xl h-20 ${getButtonColor(index)}`}
                        disabled={!isGameActive || lastClickedIndex !== null}
                    >
                        {isWordMode ? numberWords[option - 1] : option}
                    </Button>
                ))}
            </div>
            <div className="h-16 flex items-center justify-center">
                {feedback && (
                    <div className={`text-2xl font-bold ${feedback.type === 'correct' ? 'text-green-600' :
                            feedback.type === 'incorrect' ? 'text-red-600' :
                                'text-blue-600'
                        }`}>
                        {feedback.message}
                    </div>
                )}
            </div>
            <div className="mt-6 bg-white p-4 rounded-lg shadow text-primary">
                <h2 className="text-xl font-bold mb-2 text-primary">Current Game Stats:</h2>
                <p className='text-primary'>Score: {score} points</p>
                <p>Current Streak: {streak}</p>
                <h3 className="text-lg font-semibold mt-4 mb-2">Numbers that need more practice:</h3>
                <ul className="list-disc pl-5">
                    {Object.entries(incorrectAttempts)
                        .sort(([, a], [, b]) => b - a)
                        .map(([number, attempts]) => (
                            <li key={number} className="text-lg">
                                {isWordMode ? numberWords[parseInt(number) - 1] : number}: {attempts} incorrect {attempts === 1 ? 'attempt' : 'attempts'}
                            </li>
                        ))}
                </ul>
            </div>
            <div className="mt-6 bg-white p-4 rounded-lg shadow text-primary">
                <h2 className="text-xl font-bold mb-2">Game History:</h2>
                {gameHistory.map((game) => (
                    <div key={game.id} className="mb-4 p-2 bg-gray-100 rounded">
                        <p><strong>Date:</strong> {game.date}</p>
                        <p><strong>Mode:</strong> {game.mode}</p>
                        <p><strong>Score:</strong> {game.score} points</p>
                        <p><strong>Accuracy:</strong> {game.percentageCorrect}%</p>
                        <details>
                            <summary className="cursor-pointer">Incorrect Attempts</summary>
                            <ul className="list-disc pl-5 mt-2">
                                {Object.entries(game.incorrectAttempts).map(([number, attempts]) => (
                                    <li key={number}>
                                        {game.mode === 'Word' ? numberWords[parseInt(number) - 1] : number}: {attempts} {attempts === 1 ? 'time' : 'times'}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <Button onClick={resetGame} className="bg-red-500 hover:bg-red-600">
                    Reset Game
                </Button>
            </div>
        </div>
    );
};

const Switch = ({ checked, onCheckedChange }) => (
    <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${checked ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
        onClick={onCheckedChange}
    >
        <span className="sr-only">Toggle mode</span>
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

export default CountingGame;