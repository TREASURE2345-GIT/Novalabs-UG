import { useState, useEffect, useRef } from 'react';
import DNAExtractionSimulation from '@components/simulations/DNAExtractionSimulation';
import ApparatusSection from '@components/apparatus/ApparatusSection';
import { experimentCatalog } from '../../data/experimentCatalog';
import { getProgress, setProgress } from '../../services/progressService';
import { useAuth } from '../../hooks/useAuth';
import LabAIGuide from '@components/ai/LabAIGuide';
import QuantitativeSimulation from '@components/simulations/QuantitativeSimulation';
import SubjectIcon from '@components/ui/SubjectIcon';

export default function DNAExtractionPage() {
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [practicalComplete, setPracticalComplete] = useState(false);
  const [simulationTrialCount, setSimulationTrialCount] = useState(0);
  const progressLoaded = useRef(false);

  const steps = [
    {
      title: 'Setup Equipment',
      description: 'Gather all necessary laboratory equipment',
      instructions: [
        '1. Prepare a clear glass or beaker',
        '2. Gather cheesecloth or coffee filter',
        '3. Get a glass rod for stirring',
        '4. Prepare ice-cold test tubes',
      ],
    },
    {
      title: 'Prepare Sample',
      description: 'Prepare the biological sample (plant or animal cells)',
      instructions: [
        '1. Measure out approximately 50 grams of sample',
        '2. Place in blender with distilled water',
        '3. Blend for 15 seconds to break down cell walls',
        '4. Filter through cheesecloth into a clear container',
      ],
    },
    {
      title: 'Extract DNA',
      description: 'Extract DNA using chemical precipitation',
      instructions: [
        '1. Add extraction buffer to the sample',
        '2. Gently stir for 2 minutes',
        '3. Add cold ethanol or isopropanol slowly',
        '4. Observe white precipitate forming (this is DNA!)',
      ],
    },
    {
      title: 'Collect & Observe',
      description: 'Collect and observe the extracted DNA',
      instructions: [
        '1. Use glass rod to spool out the DNA',
        '2. Place extracted DNA in clean test tube',
        '3. Add buffer solution to preserve',
        '4. Record observations and results',
      ],
    },
  ];

  const handleStepComplete = (stepIndex: number, isCorrect: boolean) => {
    if (isCorrect) {
      if (stepIndex === steps.length - 1 && !practicalComplete) {
        setFeedback('Complete the virtual bench and submit your practical evidence before finishing.');
        return;
      }
      const nextScore = Math.round(((stepIndex + 1) / steps.length) * 100);
      setScore(nextScore);
      setFeedback('✓ Great job! Moving to next step...');
      setTimeout(() => {
        if (stepIndex < steps.length - 1) {
          setCurrentStep(stepIndex + 1);
          setFeedback('');
        } else {
          setFeedback('✓ Experiment completed successfully!');
        }
      }, 1500);
    } else {
      setFeedback('✗ Try again! Review the instructions carefully.');
    }
  };

  // Load progress on mount (per user if available)
  useEffect(() => {
    progressLoaded.current = false;
    const progress = getProgress('dna-extraction', user?.id ?? null);
    progressLoaded.current = true;
    if (progress) {
      setCurrentStep(progress.currentStep ?? 0);
      setScore(progress.score ?? 0);
      setPracticalComplete(progress.practicalComplete === true);
      setSimulationTrialCount(typeof progress.dataPoints === 'number' ? progress.dataPoints : 0);
    } else {
      // ensure progress starts at 0%
      setProgress('dna-extraction', { currentStep: 0, score: 0, totalSteps: steps.length }, user?.id ?? null);
      setCurrentStep(0);
      setScore(0);
      setPracticalComplete(false);
    }
  }, [user?.id]);

  // Persist progress when currentStep or score changes
  useEffect(() => {
    if (!progressLoaded.current) return;

    const completed = score >= 100;
    setProgress('dna-extraction', {
      currentStep,
      score,
      totalSteps: steps.length,
      completedSteps: completed ? steps.length : Math.min(currentStep, steps.length),
      completed,
      practicalComplete,
      dataPoints: simulationTrialCount,
    }, user?.id ?? null);
  }, [currentStep, score, practicalComplete, simulationTrialCount, user?.id]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SubjectIcon subject="biology" title="DNA Extraction Lab" className="w-12 h-12 ring-1 ring-white/50" />
          <h1 className="text-3xl font-bold">DNA Extraction Lab</h1>
        </div>
        <p className="text-green-100">Extract DNA from cells using laboratory techniques</p>
      </div>

      {/* Experiment Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Experiment Aim</h2>
        <p className="text-gray-700 mb-4">
          In this virtual laboratory, you will perform a DNA extraction experiment. You will learn how DNA can be
          separated from cells and made visible to the naked eye. This is a fundamental technique in molecular
          biology and is used in many real-world applications, including forensics and genetic testing.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Objectives</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Understand the structure of cells and how DNA is stored</li>
          <li>Learn the steps of DNA extraction</li>
          <li>Conduct a virtual experiment safely</li>
          <li>Observe and record scientific data</li>
        </ul>
      </div>

      {/* AI Guide */}
      <div className="mb-8">
        <LabAIGuide 
          labName="DNA Extraction"
          topic="DNA Extraction and Cell Biology"
          relatedTopics={['Genetics', 'Cell Structure', 'Molecular Biology', 'Lab Techniques']}
        />
      </div>

      <ApparatusSection
        key="dna-extraction"
        experiment={experimentCatalog['dna-extraction']}
        currentStep={currentStep}
        onPracticalComplete={() => {
          setPracticalComplete(true);
          setFeedback('Practical evidence submitted. Continue with the DNA extraction steps.');
        }}
      />

      <QuantitativeSimulation
        experiment={experimentCatalog['dna-extraction']}
        onDataChange={(trials) => setSimulationTrialCount(trials.length)}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left: Simulation Area */}
        <div className="lg:col-span-2">
          <div className="lab-simulation-container bg-white rounded-lg shadow p-6">
            <DNAExtractionSimulation currentStep={currentStep} onStepChange={setCurrentStep} />
          </div>

          {/* Controls */}
          <div className="mt-6 flex justify-between items-center bg-white rounded-lg shadow p-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-secondary"
            >
              ← Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
              <div className="w-48 bg-gray-300 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => {
                handleStepComplete(currentStep, true);
              }}
              className="btn-success"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Right: Instructions & Feedback */}
        <div>
          {/* Instructions Panel */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-700 mb-4">{steps[currentStep].description}</p>

            <div className="space-y-2">
              {steps[currentStep].instructions.map((instruction, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-xs font-bold text-blue-600 mt-0.5">→</span>
                  <p className="text-sm text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`rounded-lg p-4 mb-6 font-medium ${
                feedback.includes('✓') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Score Card */}
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h4 className="font-bold text-gray-900 mb-4">Score: {score}%</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Accuracy</span>
                  <span className="text-xs font-bold text-gray-900">{score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {score === 100 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm font-bold text-green-800">🎉 Excellent Work!</p>
                <p className="text-xs text-green-700">You've completed the experiment successfully</p>
              </div>
            )}
          </div>

          {/* AI Tutor Button */}
          <div className="w-full mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 text-center">
            <p className="text-sm font-bold text-gray-900">💡 Hint:</p>
            <p className="text-xs text-gray-600 mt-1">Use the AI Guide above to get instant answers to any questions about DNA extraction!</p>
          </div>
        </div>
      </div>

      {/* Data Collection Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Data Collection & Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataInputCard label="DNA Appearance" placeholder="Describe the color and texture" />
          <DataInputCard label="DNA Amount (mg)" placeholder="Enter approximate amount" />
          <DataInputCard label="Solution Clarity" placeholder="Clear, slightly cloudy, or cloudy" />
          <DataInputCard label="Observations" placeholder="Any other observations" />
        </div>

        <button className="mt-6 btn-primary">Submit Results</button>
      </div>
    </div>
  );
}

function DataInputCard({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
