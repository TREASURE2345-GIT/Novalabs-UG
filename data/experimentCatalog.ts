import { experimentDetails } from './experimentDetails';

export type ExperimentLevel = 'olevel' | 'alevel';

export type ExperimentStep = {
  title: string;
  description: string;
  instructions: string[];
};

export type ExperimentEntry = {
  slug: string;
  title: string;
  subject: 'biology' | 'chemistry' | 'physics' | 'agriculture';
  level: ExperimentLevel;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: string;
  aim?: string;
  theory?: string;
  materials: string[];
  relatedTopics?: string[];
  learningObjectives: string[];
  precautions?: string[];
  observationsTemplate?: string[];
  resultsGuidance?: string;
  evaluation?: string[];
  markingScheme?: { criteria: string; marks: number }[];
  steps: ExperimentStep[];
  theme?: string; // For better organization
  classLevel?: string; // e.g., S1, S2, S3, S4, S5, S6
  unebCode?: string; // UNEB practical code if applicable
};

const baseExperimentCatalog: Record<string, ExperimentEntry> = {
  'dna-extraction': {
    slug: 'dna-extraction',
    title: 'DNA Extraction',
    subject: 'biology',
    level: 'olevel',
    classLevel: 'S4',
    theme: 'Genetics and Inheritance',
    description: 'Isolate DNA from plant cells and observe the material responsible for heredity.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: '🧬',
    aim: 'To extract DNA from plant cells and observe the precipitated DNA.',
    theory: 'DNA is found in the nucleus of cells. Breaking the cell wall/membrane (lysis), removing proteins and debris, and precipitating DNA with cold alcohol allows visible strands of DNA to be isolated.',
    materials: [
      'Ripe banana or onion (fresh plant tissue)',
      'Blender or mortar and pestle',
      'Distilled water',
      'Table salt',
      'Washing-up liquid / detergent',
      'Cheesecloth or coffee filter',
      'Glass beakers and measuring cylinder',
      'Glass stirring rod',
      'Ice-cold ethanol or isopropanol',
      'Test tubes and test tube rack',
      'Water bath',
      'Pipette and timer',
    ],
    relatedTopics: ['Cell Biology', 'Genetics', 'Laboratory Skills'],
    learningObjectives: [
      'Explain why DNA is extracted from cells',
      'Describe the main steps in DNA isolation',
      'Identify the role of cell lysis, filtering, and precipitation'
    ],
    precautions: [
      'Handle ethanol carefully (flammable)',
      'Use cold ethanol to improve DNA precipitation',
      'Do not over-blend to avoid shearing DNA excessively',
      'Dispose of biological waste properly',
    ],
    observationsTemplate: [
      'Appearance of filtrate (color/clarity)',
      'What forms at the ethanol boundary',
      'Shape/texture of DNA strands collected',
    ],
    resultsGuidance: 'A white/cloudy/stringy precipitate should form at the interface between the filtrate and ice-cold ethanol, indicating the presence of DNA.',
    evaluation: [
      'Possible contamination from proteins may affect purity',
      'Insufficient cooling can reduce yield',
      'Incomplete filtration may leave cell debris',
    ],
    markingScheme: [
      { criteria: 'Apparatus and setup', marks: 2 },
      { criteria: 'Correct procedure followed', marks: 4 },
      { criteria: 'Observations recorded', marks: 2 },
      { criteria: 'Conclusion and explanation', marks: 2 },
    ],
    steps: [
      {
        title: 'Prepare the Sample',
        description: 'Break open the cells to access the DNA inside.',
        instructions: ['Mash or crush the plant tissue to expose the cells.', 'Add the extraction solution (salt, water, detergent) and mix gently.', 'Allow the sample to sit so the cell contents release.']
      },
      {
        title: 'Separate the DNA',
        description: 'Remove cell debris and isolate the genetic material.',
        instructions: ['Filter the mixture with cheesecloth to remove solid fragments.', 'Add ice-cold ethanol slowly down the side of the tube.', 'Observe the cloudy or stringy DNA layer at the alcohol boundary.']
      },
      {
        title: 'Record and Conclude',
        description: 'Explain what the DNA extraction demonstrates about cells and genetics.',
        instructions: ['Describe the appearance of the DNA.', 'Link the process to cell structure and genetics.', 'State a conclusion based on your observations.']
      }
    ]
  },
  'cell-division': {
    slug: 'cell-division',
    title: 'Cell Division (Mitosis)',
    subject: 'biology',
    level: 'olevel',
    classLevel: 'S2',
    theme: 'Cell Biology',
    description: 'Observe how cells grow, duplicate DNA, and divide through mitosis using stained slides.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: '🔬',
    materials: [
      'Compound microscope',
      'Prepared slides of mitotic stages (onion root tip)',
      'Clean slides and cover slips',
      'Acetocarmine or acetic orcein stain',
      'Dilute hydrochloric acid',
      'Distilled water and dropper bottle',
      'Mounted needle and forceps',
      'Scalpel',
      'Paper towels',
      'Pencil, ruler and drawing paper',
    ],
    relatedTopics: ['Cell Biology', 'Growth and Repair', 'Mitosis'],
    learningObjectives: [
      'Describe the stages of the cell cycle',
      'Differentiate between mitosis and meiosis',
      'Explain why cell division is important for growth and repair'
    ],
    steps: [
      {
        title: 'Prepare Cells',
        description: 'Set up the sample and identify the cell stage being examined.',
        instructions: ['Observe a specimen under the microscope.', 'Identify the visible chromosomes and cell structures.', 'Take notes on the current stage of division.']
      },
      {
        title: 'Model Mitosis',
        description: 'Track chromosomes as they align and separate.',
        instructions: ['Arrange chromosomes in the correct order.', 'Check the spindle fibers and centromeres.', 'Record how chromosomes move during division.']
      },
      {
        title: 'Compare Stages',
        description: 'Analyze the differences between prophase, metaphase, anaphase, and telophase.',
        instructions: ['Compare the chromosome arrangement in each stage.', 'Describe the changes in nuclear membrane visibility.', 'Explain how daughter cells are formed.']
      }
    ]
  },
  'genetics-simulation': {
    slug: 'genetics-simulation',
    title: 'Genetics Simulation',
    subject: 'biology',
    level: 'olevel',
    description: 'Explore how traits are inherited by modeling dominant and recessive alleles with counters.',
    difficulty: 'Intermediate',
    duration: '55 min',
    icon: 'Punnett square',
    materials: [
      'Punnett square worksheet or whiteboard',
      'Coloured beads or counters (two colours per trait)',
      'Coin for random mating flips',
      'Dice',
      'Small containers for gamete pools',
      'Recording sheet',
      'Pencil and calculator',
    ],
    relatedTopics: ['Genetics', 'Inheritance', 'Variation'],
    learningObjectives: [
      'Explain inheritance patterns using Punnett squares',
      'Differentiate between genotype and phenotype',
      'Recognize how variation is produced in offspring'
    ],
    steps: [
      {
        title: 'Set Parent Traits',
        description: 'Choose the alleles carried by the parent organisms.',
        instructions: ['Identify the dominant and recessive traits.', 'Record parental genotype combinations.', 'Predict possible offspring combinations.']
      },
      {
        title: 'Simulate Crossing',
        description: 'Cross the parents to model inheritance patterns.',
        instructions: ['Use a Punnett square to map allele combinations.', 'Toss the coin to model random gamete fusion.', 'Record genotype and phenotype outcomes.']
      },
      {
        title: 'Analyze Results',
        description: 'Interpret the resulting data and explain the inheritance pattern.',
        instructions: ['Compare expected and actual ratios.', 'Discuss dominant and recessive traits.', 'State a clear conclusion based on the data.']
      }
    ]
  },
  'photosynthesis-lab': {
    slug: 'photosynthesis-lab',
    title: 'Photosynthesis - Effect of Light Intensity',
    subject: 'biology',
    level: 'olevel',
    classLevel: 'S2',
    theme: 'Plant Nutrition',
    description: 'Study how light influences photosynthesis by counting oxygen bubbles from pondweed.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: '🌱',
    materials: [
      'Pondweed (Elodea or Ceratophyllum)',
      'Large beaker or trough of water',
      'Boiling tubes and test tube rack',
      'Sodium hydrogencarbonate solution',
      'Lamp (light source)',
      'Ruler',
      'Thermometer',
      'Stopwatch',
      'Forceps',
    ],
    relatedTopics: ['Photosynthesis', 'Plant Biology', 'Energy in Plants'],
    learningObjectives: [
      'Explain why plants need light for photosynthesis',
      'Identify factors affecting the rate of photosynthesis',
      'Collect and interpret evidence from an experiment'
    ],
    steps: [
      {
        title: 'Prepare Plant Sample',
        description: 'Set up the pondweed under different light conditions.',
        instructions: ['Place the sample under a light source.', 'Measure the distance or intensity of light.', 'Prepare a control setup in the dark.']
      },
      {
        title: 'Collect Evidence',
        description: 'Count oxygen bubbles as the reaction proceeds.',
        instructions: ['Record bubble count over a fixed time.', 'Compare light and dark conditions.', 'Note whether the rate changes with distance.']
      },
      {
        title: 'Conclude',
        description: 'Explain the role of light in producing food for the plant.',
        instructions: ['Summarize the results in a simple table.', 'Link the data to photosynthesis.', 'State the evidence supporting the conclusion.']
      }
    ]
  },
  'microscopy-basics': {
    slug: 'microscopy-basics',
    title: 'Microscopy Basics',
    subject: 'biology',
    level: 'olevel',
    description: 'Learn how microscopes are used to observe cells and tiny organisms safely.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: 'Compound microscope',
    materials: [
      'Compound microscope',
      'Prepared slides',
      'Clean slides and cover slips',
      'Dropper bottle of water or iodine stain',
      'Mounted needle',
      'Scissors and scalpel',
      'Forceps',
      'Lens paper',
      'White tile and paper towels',
    ],
    relatedTopics: ['Cell Biology', 'Microscopy', 'Observation and Drawing'],
    learningObjectives: [
      'Use a microscope properly and safely',
      'Focus on specimens at different magnifications',
      'Identify key cell structures'
    ],
    steps: [
      {
        title: 'Set Up the Microscope',
        description: 'Place the slide and adjust the lens correctly.',
        instructions: ['Turn on the light source.', 'Place the slide on the stage.', 'Adjust the coarse focus slowly.']
      },
      {
        title: 'Observe the Specimen',
        description: 'Move through low and high power magnification.',
        instructions: ['Locate the specimen at low power.', 'Increase magnification carefully.', 'Record visible structures.']
      },
      {
        title: 'Draw Conclusions',
        description: 'State what you observed and why it matters.',
        instructions: ['Label the cell structures seen.', 'Describe the sample in detail.', 'Relate your observations to cell function.']
      }
    ]
  },
  'osmosis-in-potato-cells': {
    slug: 'osmosis-in-potato-cells',
    title: 'Osmosis in Potato Cells',
    subject: 'biology',
    level: 'olevel',
    description: 'Investigate how water moves in and out of plant cells in different sucrose solutions.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: 'Potato strips',
    materials: [
      'Fresh potato',
      'Cork borer or scalpel',
      'Metre rule',
      'Distilled water',
      'Sucrose solutions (0 to 1 mol/dm³)',
      'Beakers or boiling tubes',
      'Balance',
      'Paper towels',
      'Test tube rack',
      'Timer',
    ],
    relatedTopics: ['Cell Transport', 'Osmosis', 'Plant Cells'],
    learningObjectives: [
      'Explain osmosis in terms of water movement across a membrane',
      'Compare the effect of different sucrose concentrations',
      'Relate the observations to plant cell behavior in different solutions'
    ],
    steps: [
      {
        title: 'Prepare Potatoes',
        description: 'Cut equal potato pieces and measure their initial size.',
        instructions: ['Cut equal-sized potato strips with a cork borer.', 'Measure the starting length or mass.', 'Place each strip into a different sugar solution.']
      },
      {
        title: 'Observe Changes',
        description: 'Record how the potato changes in each solution.',
        instructions: ['Leave the samples for a fixed time.', 'Measure final length or mass.', 'Note whether tissue increases or decreases in size.']
      },
      {
        title: 'Interpret the Results',
        description: 'Explain the movement of water in and out of the cells.',
        instructions: ['Compare the concentration gradients.', 'State the direction of water movement.', 'Write an evidence-based conclusion about osmosis.']
      }
    ]
  },
  'food-tests-and-nutrition': {
    slug: 'food-tests-and-nutrition',
    title: 'Food Tests and Nutrition',
    subject: 'biology',
    level: 'olevel',
    description: 'Analyze common food samples to identify starch, reducing sugars, proteins, and fats.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: 'Reagent test tubes',
    materials: [
      'Food samples (bread, egg white, oil, fruit juice)',
      'Test tubes and test tube rack',
      'Iodine solution',
      "Benedict's solution",
      'Biuret reagents (sodium hydroxide and copper(II) sulfate)',
      'Ethanol',
      'Water bath or beaker of hot water',
      'Droppers and graduated pipette',
      'White tile',
      'Mortar and pestle (for solid samples)',
    ],
    relatedTopics: ['Nutrition', 'Biomolecules', 'Food Chemistry'],
    learningObjectives: [
      'Use tests to identify nutrients in food samples',
      'Interpret color changes as evidence of nutrient presence',
      'Relate nutrient content to a healthy diet'
    ],
    steps: [
      {
        title: 'Prepare Food Samples',
        description: 'Place equal samples of test substances into separate tubes.',
        instructions: ['Label each tube clearly.', 'Add the correct test reagent to each sample.', 'Use the same volume for comparison.']
      },
      {
        title: 'Observe Reactions',
        description: 'Record color changes and precipitates carefully.',
        instructions: ['Observe each test before and after adding reagents.', 'Compare the results to known nutrient tests.', 'Record all observations in a table.']
      },
      {
        title: 'Conclusion',
        description: 'State which nutrients are present and explain the findings.',
        instructions: ['Match each observation to a nutrient.', 'Explain the importance of the nutrient in the diet.', 'Summarize the nutritional value of the sample.']
      }
    ]
  },
  'enzyme-activity-temperature': {
    slug: 'enzyme-activity-temperature',
    title: 'Effect of Temperature on Enzyme Activity',
    subject: 'biology',
    level: 'olevel',
    description: 'Measure how temperature changes the rate of catalase action using hydrogen peroxide.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: 'Catalase bubbles',
    materials: [
      'Fresh potato or liver (catalase source)',
      'Hydrogen peroxide solution (about 3%)',
      'Test tubes and test tube rack',
      'Measurement cylinder and dropper',
      'Water baths set at different temperatures plus ice',
      'Thermometer',
      'Stopwatch',
      'Delivery tube and syringe',
      'Cork borer (for potato cylinders)',
      'Scalpel and ruler',
    ],
    relatedTopics: ['Enzymes', 'Respiration', 'Nutrition'],
    learningObjectives: [
      'Explain what enzymes do and how temperature affects them',
      'Measure a reaction rate in a controlled way',
      'Interpret a graph of activity against temperature'
    ],
    steps: [
      {
        title: 'Prepare the Enzyme',
        description: 'Cut equal samples of enzyme source to test.',
        instructions: ['Cut equal potato or liver cylinders with a cork borer.', 'Measure the volume of hydrogen peroxide for each tube.', 'Set up water baths at cold, warm, and hot temperatures.']
      },
      {
        title: 'Measure Activity',
        description: 'Time how fast oxygen gas is produced.',
        instructions: ['Add the enzyme sample to the peroxide.', 'Time the release of gas bubbles.', 'Repeat at each temperature and record results.']
      },
      {
        title: 'Explain the Trend',
        description: 'Link temperature to enzyme activity.',
        instructions: ['Plot rate against temperature.', 'Identify the optimum temperature.', 'Explain why the rate decreases when too hot.']
      }
    ]
  },
  'testing-leaf-for-starch': {
    slug: 'testing-leaf-for-starch',
    title: 'Testing a Leaf for Starch',
    subject: 'biology',
    level: 'olevel',
    description: 'Use iodine to prove that a green leaf makes starch only in the presence of light.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: 'Iodine-stained leaf',
    materials: [
      'Potted plant kept in the dark for 48 hours',
      'Beaker and boiling tubes',
      'Bunsen burner, tripod and gauze',
      'Industrial methylated spirits or ethanol',
      'Iodine solution',
      'Hot water bath',
      'White tile',
      'Forceps',
      'Dropper',
    ],
    relatedTopics: ['Photosynthesis', 'Nutrition in Plants'],
    learningObjectives: [
      'Explain why plants need light for photosynthesis',
      'Describe how starch is removed from (destarched) leaves',
      'Interpret iodine colour changes as evidence of starch'
    ],
    steps: [
      {
        title: 'Destarch and Test',
        description: 'Use light and dark leaves to compare starch presence.',
        instructions: ['Pick a leaf from the light and one kept in the dark.', 'Boil the leaves in water to kill the cells.', 'Heat them in alcohol to remove the green colour.']
      },
      {
        title: 'Add Iodine',
        description: 'Test both leaves for starch.',
        instructions: ['Rinse the leaves in warm water.', 'Spread them on a white tile.', 'Add iodine solution and observe colour change.']
      },
      {
        title: 'Conclude',
        description: 'Link the colour change to light and photosynthesis.',
        instructions: ['Compare the dark and light leaf results.', 'State which leaf contained starch.', 'Explain the role of light in starch production.']
      }
    ]
  },
  'acid-base-titration': {
    slug: 'acid-base-titration',
    title: 'Acid-Base Titration',
    subject: 'chemistry',
    level: 'olevel',
    description: 'Determine the concentration of an unknown solution by neutralization.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: 'Burette and flask',
    materials: [
      'Burette',
      '25 cm³ pipette and pipette filler',
      'Conical flask',
      'White tile',
      'Funnel',
      'Dilute hydrochloric acid',
      'Sodium hydroxide solution of known concentration',
      'Methyl orange or phenolphthalein indicator',
      'Beakers and measuring cylinder',
      'Clamp stand with boss head and clamp',
      'Wash bottle of distilled water',
    ],
    learningObjectives: [
      'Explain neutralization reactions',
      'Use titration to calculate concentration',
      'Interpret endpoint data accurately'
    ],
    steps: [
      {
        title: 'Set Up',
        description: 'Prepare the burette and the sample solution.',
        instructions: ['Rinse and fill the burette with the acid.', 'Measure the base into a conical flask with a pipette.', 'Add the indicator carefully.']
      },
      {
        title: 'Titrate',
        description: 'Add acid gradually until the endpoint is reached.',
        instructions: ['Swirl the flask continuously.', 'Watch for the colour change.', 'Record the burette reading.']
      },
      {
        title: 'Calculate',
        description: 'Use the volume data to determine concentration.',
        instructions: ['Apply the stoichiometric ratio.', 'Calculate moles of reactant.', 'State the final concentration clearly.']
      }
    ]
  },
  'reaction-rates': {
    slug: 'reaction-rates',
    title: 'Reaction Rates',
    subject: 'chemistry',
    level: 'olevel',
    description: 'Measure how temperature and concentration affect how quickly a reaction happens.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: 'Stopwatch and flasks',
    materials: [
      'Dilute hydrochloric acid',
      'Magnesium ribbon or marble chips',
      'Sodium thiosulphate solution',
      'Conical flasks',
      'Measuring cylinders',
      'Stopwatch',
      'Thermometer',
      'Bunsen burner (for heating)',
      'Beakers and test tubes',
      'Balance',
    ],
    learningObjectives: [
      'Identify factors affecting reaction rate',
      'Measure and compare rates of change',
      'Explain particle collisions and energy in reactions'
    ],
    steps: [
      {
        title: 'Prepare Solutions',
        description: 'Prepare reaction mixtures at different conditions.',
        instructions: ['Change temperature or concentration.', 'Keep other variables controlled.', 'Set a consistent observation method.']
      },
      {
        title: 'Measure Speed',
        description: 'Record how quickly products form or reactants disappear.',
        instructions: ['Time the reaction carefully.', 'Use consistent sampling intervals.', 'Record all observations.']
      },
      {
        title: 'Compare Results',
        description: 'Link the measured speed to reaction conditions.',
        instructions: ['Plot the data.', 'Compare the rate trends.', 'Explain the cause of the change.']
      }
    ]
  },
  'thermochemistry': {
    slug: 'thermochemistry',
    title: 'Thermochemistry',
    subject: 'chemistry',
    level: 'olevel',
    description: 'Investigate heat transfer and energy changes during chemical reactions.',
    difficulty: 'Intermediate',
    duration: '55 min',
    icon: 'Polystyrene calorimeter',
    materials: [
      'Polystyrene cup calorimeter with lid',
      'Thermometer (-10 °C to 110 °C)',
      'Measuring cylinder',
      'Dilute hydrochloric acid',
      'Sodium hydroxide solution',
      'Ammonium nitrate or sodium bicarbonate (for endothermic test)',
      'Balance',
      'Glass stirring rod',
      'Beakers',
      'Stopwatch',
    ],
    learningObjectives: [
      'Measure temperature change in a reaction',
      'Explain exothermic and endothermic processes',
      'Connect energy transfer to chemical change'
    ],
    steps: [
      {
        title: 'Set Up Calorimeter',
        description: 'Prepare the reaction under controlled conditions.',
        instructions: ['Measure the starting temperature.', 'Add the reactants carefully.', 'Insulate the cup to reduce heat loss.']
      },
      {
        title: 'Collect Heat Data',
        description: 'Track temperature changes over time.',
        instructions: ['Record temperature at 30-second intervals.', 'Observe whether heat is released or absorbed.', 'Keep data organized.']
      },
      {
        title: 'Interpret Energy Change',
        description: "Use the results to explain the reaction's energy change.",
        instructions: ['Identify whether the reaction is exothermic or endothermic.', 'Link the result to bond breaking and making.', 'Write an evidence-based conclusion.']
      }
    ]
  },
  'crystallization': {
    slug: 'crystallization',
    title: 'Crystallization',
    subject: 'chemistry',
    level: 'olevel',
    description: 'Grow crystals and analyze how solubility and precipitation create ordered structures.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: 'Crystal dish',
    materials: [
      'Copper(II) sulphate or alum',
      'Distilled water',
      'Beaker',
      'Bunsen burner, tripod and gauze',
      'Glass stirring rod',
      'Evaporating dish',
      'Watch glass',
      'Thermometer',
      'Filter paper and funnel',
      'Cotton thread (for seed crystal)',
    ],
    learningObjectives: [
      'Explain how crystals form from solutions',
      'Relate crystal growth to solubility and cooling',
      'Observe changes in structure and appearance'
    ],
    steps: [
      {
        title: 'Prepare Solution',
        description: 'Dissolve the solute and make a saturated solution.',
        instructions: ['Heat the solvent if needed.', 'Add solute slowly until no more dissolves.', 'Allow the sample to cool carefully.']
      },
      {
        title: 'Observe Crystal Growth',
        description: 'Watch crystals form as the solution cools or evaporates.',
        instructions: ['Record the first signs of crystallization.', 'Observe shape and size changes.', 'Compare different cooling conditions.']
      },
      {
        title: 'Analyze',
        description: 'Relate the result to solubility and precipitation.',
        instructions: ['Describe the crystal structure.', 'State the role of cooling or evaporation.', 'Summarize the chemistry behind the observation.']
      }
    ]
  },
  'paper-chromatography': {
    slug: 'paper-chromatography',
    title: 'Paper Chromatography',
    subject: 'chemistry',
    level: 'olevel',
    description: 'Separate the dyes in ink or leaf pigments to see if a mixture is pure.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: 'Chromatogram strip',
    materials: [
      'Chromatography paper strips',
      'Coloured ink pens or leaf pigment extract',
      'Boiling tube or beaker',
      'Paper clip or tape',
      'Pencil and ruler',
      'Solvent (water or ethanol)',
      'Glass rod',
      'Capillary tube',
    ],
    learningObjectives: [
      'Explain how chromatography separates mixtures',
      'Describe the terms mobile and stationary phase',
      'Interpret a chromatogram to identify pure vs mixed substances'
    ],
    steps: [
      {
        title: 'Spot the Sample',
        description: 'Mark the paper and apply the ink or pigment.',
        instructions: ['Draw a start line with a pencil, not ink.', 'Spot the sample on the line with a capillary tube.', 'Let the spot dry completely.']
      },
      {
        title: 'Run the Solvent',
        description: 'Allow the solvent to carry the components up the paper.',
        instructions: ['Stand the strip in a small solvent.', 'Keep the start line above the solvent surface.', 'Remove the paper before solvent reaches the top.']
      },
      {
        title: 'Analyze the Chromatogram',
        description: 'Compare the separated dye spots.',
        instructions: ['Mark the solvent front immediately.', 'Count the separate spots and measure distances.', 'State whether the sample was pure or a mixture.']
      }
    ]
  },
  'preparing-a-salt': {
    slug: 'preparing-a-salt',
    title: 'Preparing a Salt by Neutralisation',
    subject: 'chemistry',
    level: 'olevel',
    description: 'React an acid with a base or metal to make a soluble salt and grow its crystals.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: 'Evaporating dish',
    materials: [
      'Dilute sulphuric acid or hydrochloric acid',
      'Excess base (e.g., copper(II) oxide or magnesium)',
      'Beakers',
      'Measuring cylinder',
      'Bunsen burner, tripod and gauze',
      'Glass stirring rod',
      'Filter funnel and filter paper',
      'Evaporating dish',
      'Crystallising dish or watch glass',
      'Balance and thermometer',
    ],
    learningObjectives: [
      'Explain neutralisation as acid plus base reacts to form a salt',
      'Use the excess method to remove leftover base',
      'Grow crystals of the salt produced'
    ],
    steps: [
      {
        title: 'React the Acid and Base',
        description: 'Warm the acid and add base until no more dissolves.',
        instructions: ['Measure a fixed volume of warm dilute acid.', 'Add the base in small amounts while stirring.', 'Stop when excess base remains undissolved.']
      },
      {
        title: 'Remove the Excess',
        description: 'Filter the mixture to get a clear salt solution.',
        instructions: ['Filter while the mixture is warm.', 'Collect the filtrate in a clean beaker.', 'Discard the leftover base on the paper.']
      },
      {
        title: 'Crystallise the Salt',
        description: 'Concentrate and cool the solution to form crystals.',
        instructions: ['Evaporate some water with gentle heat.', 'Cool the solution and leave it to stand.', 'Decant and dry the crystals formed.']
      }
    ]
  },
  'rusting-of-iron': {
    slug: 'rusting-of-iron',
    title: 'Rusting of Iron',
    subject: 'chemistry',
    level: 'olevel',
    description: 'Compare conditions to find what air and water do to iron nails.',
    difficulty: 'Beginner',
    duration: '45 min (observe over several days)',
    icon: 'Iron nails in tubes',
    materials: [
      'Clean iron nails',
      'Boiling tubes and rubber bungs',
      'Distilled water',
      'Tap water',
      'Boiled (deoxygenated) water',
      'Oil or paraffin layer',
      'Calcium chloride (drying agent)',
      'Cotton wool',
      'Labels',
      'Recording sheet',
    ],
    learningObjectives: [
      'Explain the conditions needed for rusting',
      'Compare rusting in different setups',
      'Suggest ways to prevent rusting'
    ],
    steps: [
      {
        title: 'Set Up the Tubes',
        description: 'Prepare four tubes with nails in different conditions.',
        instructions: ['Label each tube clearly.', 'Use distilled water, tap water, dry air, and oil-covered water.', 'Seal the tubes with bungs.']
      },
      {
        title: 'Observe Over Time',
        description: 'Check and record rusting each day.',
        instructions: ['Look for orange-brown rust after 24 hours.', 'Continue observing for several days.', 'Record results in a table.']
      },
      {
        title: 'Conclude',
        description: 'State what is needed for rusting to occur.',
        instructions: ['Compare which tubes rusted.', 'Link rusting to air and water.', 'Suggest a practical prevention method.']
      }
    ]
  },
  'velocity-and-acceleration': {
    slug: 'velocity-and-acceleration',
    title: 'Velocity and Acceleration',
    subject: 'physics',
    level: 'olevel',
    description: 'Investigate how speed, time, and direction affect motion with a ticker-tape timer.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: 'Ticker-tape timer',
    materials: [
      'Ticker-tape timer and power supply',
      'Ticker tape',
      'Carbon discs',
      'Trolley',
      'Ramp or runway',
      'Stopwatch',
      'Metre rule',
      'Clamp stand',
      'Scotch tape',
      'Graph paper',
    ],
    learningObjectives: [
      'Calculate speed and acceleration',
      'Compare different motion scenarios',
      'Relate force to changes in motion'
    ],
    steps: [
      {
        title: 'Measure Motion',
        description: 'Record the distance and time of a moving trolley.',
        instructions: ['Take repeated measurements.', 'Calculate speed from the data.', 'Check the difference between constant and changing motion.']
      },
      {
        title: 'Analyze Acceleration',
        description: 'Compare starting and final speed over time.',
        instructions: ['Identify patterns in the ticker tape gaps.', 'Discuss why the motion changes.', 'Use units correctly.']
      },
      {
        title: 'Explain the Results',
        description: "Connect your data to Newton's laws of motion.",
        instructions: ['Write a clear conclusion.', 'State whether the trolley accelerated.', 'Mention force and friction where relevant.']
      }
    ]
  },
  'simple-circuits': {
    slug: 'simple-circuits',
    title: 'Simple Circuits',
    subject: 'physics',
    level: 'olevel',
    description: 'Build and test circuits to understand electricity flow, resistance, and voltage.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: 'Circuit components',
    materials: [
      'Power supply or battery cell',
      'Connecting wires',
      'Ammeter',
      'Voltmeter',
      'Resistors',
      'Bulbs and bulb holders',
      'Switch',
      'Rheostat (variable resistor)',
      'Crocodile clips',
      'Resistance wire on a metre rule',
    ],
    learningObjectives: [
      'Construct a basic closed circuit',
      'Measure current and voltage',
      'Explain the relationship between voltage, current, and resistance'
    ],
    steps: [
      {
        title: 'Build Circuit',
        description: 'Connect wires, battery, and load into a complete loop.',
        instructions: ['Check that the circuit is closed.', 'Place components in the correct order.', 'Verify that the current has a path to flow.']
      },
      {
        title: 'Measure Values',
        description: 'Collect readings for voltage and current.',
        instructions: ['Use the ammeter and voltmeter correctly.', 'Record data for each component.', 'Note the effect of added resistance.']
      },
      {
        title: 'Interpret Findings',
        description: 'Explain the relationship between the measured values.',
        instructions: ["Apply Ohm's law.", 'Compare series and parallel arrangements.', 'Write a concise summary.']
      }
    ]
  },
  'wave-properties': {
    slug: 'wave-properties',
    title: 'Wave Properties',
    subject: 'physics',
    level: 'olevel',
    description: 'Compare frequency, wavelength, and amplitude using a ripple tank and slinky spring.',
    difficulty: 'Intermediate',
    duration: '55 min',
    icon: 'Ripple tank',
    materials: [
      'Ripple tank',
      'Vibrator motor',
      'Lamp (light source)',
      'White screen',
      'Ruler',
      'Stopwatch',
      'Slinky spring',
      'Rope',
      'Stroboscope (optional)',
    ],
    learningObjectives: [
      'Define amplitude, wavelength, and frequency',
      'Relate wave properties to sound and light',
      'Interpret patterns in wave data'
    ],
    steps: [
      {
        title: 'Generate a Wave',
        description: 'Create a wave pattern and identify its characteristics.',
        instructions: ['Observe the repeated pattern.', 'Measure the wavelength and frequency.', 'Note the amplitude of the motion.']
      },
      {
        title: 'Compare Wave Types',
        description: 'Analyze different sources or frequencies.',
        instructions: ['Collect comparable measurements.', 'Notice how wave speed changes with frequency.', 'Record the results clearly.']
      },
      {
        title: 'Explain the Effects',
        description: 'Relate the observed pattern to physical properties.',
        instructions: ['Describe the relationship between frequency and wavelength.', 'Discuss the impact of amplitude on energy.', 'State a final conclusion.']
      }
    ]
  },
  'friction-and-motion': {
    slug: 'friction-and-motion',
    title: 'Friction and Motion',
    subject: 'physics',
    level: 'olevel',
    description: 'Explore how friction changes speed, force, and object movement.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: 'Spring balance',
    materials: [
      'Wooden block',
      'Slotted weights',
      'Different surfaces (wood, sandpaper, cloth, glass)',
      'Spring balance (newton meter)',
      'Metre rule',
      'Stopwatch',
      'Ramp or slope',
      'String',
    ],
    learningObjectives: [
      'Explain the effect of friction on movement',
      'Compare surfaces with different resistance',
      'Connect force and motion through evidence'
    ],
    steps: [
      {
        title: 'Set Up Surfaces',
        description: 'Test movement on different materials and slopes.',
        instructions: ['Use the same object for each test.', 'Select surfaces with different textures.', 'Record distance and time.']
      },
      {
        title: 'Observe Motion',
        description: 'Compare movement speed across multiple trials.',
        instructions: ['Measure the time taken to travel a fixed distance.', 'Identify which surface causes the most friction.', 'Record the trend.']
      },
      {
        title: 'Reason About the Outcome',
        description: 'Use evidence to explain the force affecting movement.',
        instructions: ['Connect friction to energy loss.', 'State how it affects speed and stopping distance.', 'Write a clear interpretation.']
      }
    ]
  },
  'hookes-law': {
    slug: 'hookes-law',
    title: "Hooke's Law Investigation",
    subject: 'physics',
    level: 'olevel',
    description: 'Measure how a spiral spring stretches as you add weights, and find its limit.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: 'Spiral spring and weights',
    materials: [
      'Spiral spring',
      'Clamp stand with clamp and boss head',
      'Metre rule',
      'Slotted weights and weight hanger',
      'Pointer (e.g., a pin or paper clip)',
      'Balance',
      'Graph paper',
    ],
    learningObjectives: [
      "State Hooke's law (extension is proportional to load)",
      'Measure extension for increasing loads',
      'Identify the elastic limit from a graph'
    ],
    steps: [
      {
        title: 'Set Up the Spring',
        description: 'Hang the spring and record its original length.',
        instructions: ['Clamp the spring firmly.', 'Hang the empty weight hanger and pointer.', 'Read the starting length on the metre rule.']
      },
      {
        title: 'Add Weights',
        description: 'Increase the load step by step and measure extension.',
        instructions: ['Add the same mass each time.', 'Record new length and calculate extension.', 'Stop before the spring is damaged.']
      },
      {
        title: 'Graph and Conclude',
        description: "Plot load against extension to test Hooke's law.",
        instructions: ['Plot load on the y-axis and extension on the x-axis.', 'Identify the straight-line region.', 'Mark where the line starts to curve (elastic limit).']
      }
    ]
  },
  'density-of-solids': {
    slug: 'density-of-solids',
    title: 'Determining the Density of Solids',
    subject: 'physics',
    level: 'olevel',
    description: 'Measure mass and volume accurately to find the density of regular and irregular solids.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: 'Eureka can and balance',
    materials: [
      'Regular solid block',
      'Vernier callipers or metre rule',
      'Balance',
      'Measuring cylinder',
      'Displacement can (Eureka can)',
      'Irregular stone or object',
      'Thread',
      'Water',
    ],
    learningObjectives: [
      'Measure mass and volume accurately',
      'Use the formula density = mass divided by volume',
      'Compare the density of different materials'
    ],
    steps: [
      {
        title: 'Measure the Regular Solid',
        description: 'Find its dimensions and mass.',
        instructions: ['Measure length, width and height with callipers.', 'Calculate volume and record the mass.', 'Compute density from both values.']
      },
      {
        title: 'Measure the Irregular Solid',
        description: 'Use water displacement to find volume.',
        instructions: ['Fill the Eureka can to the spout.', 'Lower the object on a thread.', 'Collect and measure the displaced water.']
      },
      {
        title: 'Compare Results',
        description: 'Report densities and check against known values.',
        instructions: ['Repeat readings for accuracy.', 'Compare with known material densities.', 'State conclusions with correct units.']
      }
    ]
  },
  'plasmolysis-in-plant-cells': {
    slug: 'plasmolysis-in-plant-cells',
    title: 'Plasmolysis in Plant Cells',
    subject: 'biology',
    level: 'alevel',
    description: 'Use concentrated sucrose to pull water out of onion cells and observe the cell membrane pulling away.',
    difficulty: 'Advanced',
    duration: '55 min',
    icon: 'Onion epidermis slide',
    materials: [
      'Onion bulb or Rheo leaves',
      'Compound microscope',
      'Scalpel and forceps',
      'Watch glass',
      'Sucrose solutions (0 to 1 mol/dm³)',
      'Distilled water',
      'Slides and cover slips',
      'Mounted needle',
      'Paper towel',
    ],
    relatedTopics: ['Cell Transport', 'Osmosis', 'Water Potential'],
    learningObjectives: [
      'Define plasmolysis and turgor',
      'Relate osmosis to water potential gradients',
      'Estimate the water potential of plant cells'
    ],
    steps: [
      {
        title: 'Prepare the Peel',
        description: 'Mount a thin layer of onion epidermis.',
        instructions: ['Peel a thin layer with forceps.', 'Place it on a slide with distilled water.', 'Add a cover slip and view under the microscope.']
      },
      {
        title: 'Apply Solutions',
        description: 'Bathe the tissue in sucrose solutions of different strengths.',
        instructions: ['Draw distilled water through with paper towel.', 'Replace with the sucrose solution.', 'Observe the cells immediately and after a few minutes.']
      },
      {
        title: 'Record and Interpret',
        description: 'Describe where plasmolysis first appears.',
        instructions: ['Compare cell appearance across concentrations.', 'Estimate the concentration where plasmolysis begins.', 'Explain the role of the semi-permeable membrane.']
      }
    ]
  },
  'respiration-in-germinating-seeds': {
    slug: 'respiration-in-germinating-seeds',
    title: 'Respiration in Germinating Seeds',
    subject: 'biology',
    level: 'alevel',
    description: 'Measure carbon dioxide and heat produced by respiring bean seeds.',
    difficulty: 'Advanced',
    duration: '60 min',
    icon: 'Dakin tube and flask',
    materials: [
      'Germinating bean or grass seeds',
      'Vacuum flask (for heat experiment)',
      'Thermometer',
      'Conical flask and delivery tube',
      'Dakin tube or U-tube manometer',
      'Potassium hydroxide solution (CO₂ absorber)',
      'Cotton wool and vaseline',
      'Limewater',
      'Stopwatch',
      'Coloured water',
    ],
    relatedTopics: ['Respiration', 'Energy in Cells', 'Enzymes'],
    learningObjectives: [
      'Show that germinating seeds respire aerobically',
      'Use indicators to detect carbon dioxide and heat',
      'Design a controlled comparison with boiled (dead) seeds'
    ],
    steps: [
      {
        title: 'Set Up the Flasks',
        description: 'Prepare live and dead seed sets.',
        instructions: ['Soak and drain beans until they germinate.', 'Boil a second set to kill the seeds as a control.', 'Seal each in a flask with a delivery tube.']
      },
      {
        title: 'Detect Gases and Heat',
        description: 'Using indicators, observe respiration products.',
        instructions: ['Bubble flask air through limewater.', 'Watch the manometer liquid move.', 'Record the temperature change in the vacuum flask.']
      },
      {
        title: 'Analyze the Evidence',
        description: 'Compare live and dead seeds.',
        instructions: ['Note which set clouded limewater.', 'Relate results to aerobic respiration.', 'Write an evidence-based conclusion.']
      }
    ]
  },
  'water-of-crystallisation': {
    slug: 'water-of-crystallisation',
    title: 'Water of Crystallisation in Oxalic Acid',
    subject: 'chemistry',
    level: 'alevel',
    description: 'Titrate oxalic acid with standard sodium hydroxide to find the value of n in its formula.',
    difficulty: 'Advanced',
    duration: '60 min',
    icon: 'Volumetric flask and burette',
    materials: [
      'Oxalic acid crystals',
      'Standard sodium hydroxide solution',
      'Burette',
      '25 cm³ pipette and pipette filler',
      'Conical flask',
      '250 cm³ volumetric flask',
      'Phenolphthalein indicator',
      'Balance',
      'Beakers',
      'White tile and wash bottle',
      'Clamp stand with clamp',
    ],
    learningObjectives: [
      'Prepare a standard solution precisely',
      'Carry out an accurate acid-base titration',
      'Use titration data to calculate water of crystallisation (n)'
    ],
    steps: [
      {
        title: 'Prepare the Oxalic Acid Solution',
        description: 'Weigh and dissolve a known mass in a volumetric flask.',
        instructions: ['Weigh a precise mass of oxalic acid.', 'Dissolve and make up to the 250 cm³ mark.', 'Mix the solution thoroughly.']
      },
      {
        title: 'Titrate with Sodium Hydroxide',
        description: 'Find the exact volume of NaOH that neutralises the acid.',
        instructions: ['Pipette 25 cm³ of oxalic acid into a flask.', 'Add phenolphthalein indicator.', 'Titrate to the pink endpoint and repeat three times.']
      },
      {
        title: 'Calculate n',
        description: 'Use the mole ratio to solve for water of crystallisation.',
        instructions: ['Calculate moles of acid used.', 'Relate moles of acid to moles of NaOH from the ratio.', 'Solve for n in the hydrate formula.']
      }
    ]
  },
  'enthalpy-of-neutralisation': {
    slug: 'enthalpy-of-neutralisation',
    title: 'Enthalpy of Neutralisation',
    subject: 'chemistry',
    level: 'alevel',
    description: 'Measure the heat evolved when an acid neutralises a base using temperature-time data.',
    difficulty: 'Advanced',
    duration: '55 min',
    icon: 'Polystyrene cup and thermometer',
    materials: [
      'Polystyrene cup calorimeter with lid',
      'Thermometer reading to 0.1 °C',
      'Measuring cylinders',
      'Dilute hydrochloric acid',
      'Sodium hydroxide solution',
      'Stirring rod',
      'Stopwatch',
      'Beakers',
    ],
    learningObjectives: [
      'Measure temperature change during neutralisation',
      'Use temperature-time data to correct for heat loss',
      'Calculate the molar enthalpy of neutralisation'
    ],
    steps: [
      {
        title: 'Measure Initial Temperatures',
        description: 'Record the temperature of the acid and base.',
        instructions: ['Measure equal volumes of acid and base.', 'Note their starting temperatures.', 'Place the acid in the insulated cup.']
      },
      {
        title: 'React and Record',
        description: 'Track temperature at fixed time intervals.',
        instructions: ['Add the base and start the stopwatch.', 'Stir and record temperature every 30 seconds.', 'Continue until temperature falls steadily.']
      },
      {
        title: 'Analyze the Data',
        description: 'Find the corrected temperature rise and compute the enthalpy.',
        instructions: ['Plot temperature against time.', 'Extrapolate back to the mixing time.', 'Calculate the molar enthalpy of neutralisation.']
      }
    ]
  },
  'redox-titration': {
    slug: 'redox-titration',
    title: 'Redox Titration with Potassium Manganate(VII)',
    subject: 'chemistry',
    level: 'alevel',
    description: 'Titrate iron(II) ions with acidified potassium manganate(VII) using the self-indicating purple endpoint.',
    difficulty: 'Advanced',
    duration: '60 min',
    icon: 'Burette with purple solution',
    materials: [
      'Potassium manganate(VII) solution (standardised)',
      'Iron(II) sulphate solution',
      'Dilute sulphuric acid',
      'Burette',
      '25 cm³ pipette and pipette filler',
      'Conical flask',
      'Beakers',
      'White tile',
      'Wash bottle',
      'Clamp stand',
    ],
    learningObjectives: [
      'Explain oxidation and reduction (redox) in ionic terms',
      'Recognise the self-indicating endpoint of manganate(VII)',
      'Use titration data to find the concentration of iron(II) ions'
    ],
    steps: [
      {
        title: 'Prepare the Solutions',
        description: 'Acidify the iron(II) sample to keep the reaction stable.',
        instructions: ['Pipette a known volume of iron(II) solution.', 'Add dilute sulphuric acid in excess.', 'Place the flask on a white tile.']
      },
      {
        title: 'Titrate to the Endpoint',
        description: 'Run manganate(VII) in until a permanent pink appears.',
        instructions: ['Fill and set the burette to zero.', 'Add manganate(VII) while swirling.', 'Stop at the first permanent pink colour and record the reading.']
      },
      {
        title: 'Calculate the Result',
        description: 'Use the 5:1 mole ratio to find the iron(II) concentration.',
        instructions: ['Write the balanced redox equation.', 'Convert volumes to moles of manganate(VII).', 'Calculate the concentration of iron(II) ions.']
      }
    ]
  },
  'simple-pendulum': {
    slug: 'simple-pendulum',
    title: 'Acceleration Due to Gravity (Simple Pendulum)',
    subject: 'physics',
    level: 'alevel',
    description: 'Time a swinging bob at different lengths and find the acceleration due to gravity (g).',
    difficulty: 'Advanced',
    duration: '55 min',
    icon: 'Pendulum and stopwatch',
    materials: [
      'Small metal bob',
      'Thread or string',
      'Clamp stand with clamp and split cork',
      'Stopwatch',
      'Metre rule',
      'Protractor',
      'Balance (optional)',
    ],
    learningObjectives: [
      'Explain simple harmonic motion of a pendulum',
      'Measure the period accurately',
      'Determine g from a graph of T² against length'
    ],
    steps: [
      {
        title: 'Set Up the Pendulum',
        description: 'Hang the bob and measure its length.',
        instructions: ['Clamp the thread in a split cork.', 'Measure the length from the pivot to the bob centre.', 'Displace the bob a small angle (about 10°).']
      },
      {
        title: 'Time the Oscillations',
        description: 'Measure the period for several lengths.',
        instructions: ['Time 20 complete oscillations.', 'Repeat each length to improve accuracy.', 'Change the length and repeat.']
      },
      {
        title: 'Find g',
        description: 'Use the graph of T² against length.',
        instructions: ['Plot T² on the y-axis against length on the x-axis.', 'Measure the gradient of the best-fit line.', 'Calculate g from the formula g = 4π² divided by gradient.']
      }
    ]
  },
  'emf-and-internal-resistance': {
    slug: 'emf-and-internal-resistance',
    title: 'Electromotive Force and Internal Resistance',
    subject: 'physics',
    level: 'alevel',
    description: 'Find the EMF and internal resistance of a dry cell from voltmeter and ammeter readings.',
    difficulty: 'Advanced',
    duration: '60 min',
    icon: 'Dry cell and meters',
    materials: [
      'Dry cell or low-voltage battery',
      'Voltmeter',
      'Ammeter',
      'Rheostat (variable resistor)',
      'Resistance box',
      'Connecting wires',
      'Switch',
      'Crocodile clips',
    ],
    learningObjectives: [
      'Distinguish between EMF and terminal potential difference',
      'Measure current and voltage for different loads',
      'Determine internal resistance from a graph of V against I'
    ],
    steps: [
      {
        title: 'Build the Circuit',
        description: 'Connect the cell, meters, and variable resistor in one loop.',
        instructions: ['Connect the ammeter in series with the cell.', 'Connect the voltmeter across the cell terminals.', 'Include a resistor or rheostat as the load.']
      },
      {
        title: 'Collect Readings',
        description: 'Vary the load and record pairs of V and I.',
        instructions: ['Start with the maximum resistance.', 'Change the resistance step by step.', 'Record terminal voltage and current each time.']
      },
      {
        title: 'Analyze the Graph',
        description: 'Use V against I to find EMF and internal resistance.',
        instructions: ['Plot V on the y-axis against I on the x-axis.', 'Read the intercept as the EMF.', 'Use the gradient (with a negative sign) as internal resistance.']
      }
    ]
  },
  'soil-texture-test': {
    slug: 'soil-texture-test',
    title: 'Soil Texture Test',
    subject: 'agriculture',
    level: 'olevel',
    description: 'Compare sand, silt, and clay to understand soil structure and water behavior.',
    difficulty: 'Beginner',
    duration: '45 min',
    icon: 'Soil sample jars',
    materials: [
      'Soil samples',
      'Clear jars with lids',
      'Water',
      'Measuring cylinder',
      'Sieve',
      'Hand lens',
      'White tile',
      'Mixing rod',
      'Labels',
      'Recording sheet',
    ],
    learningObjectives: [
      'Classify soil by texture',
      'Explain how soil structure affects drainage',
      'Relate soil type to plant growth and irrigation'
    ],
    steps: [
      {
        title: 'Collect Soil Samples',
        description: 'Gather samples from different areas or mixtures.',
        instructions: ['Label each sample clearly.', 'Measure equal amounts of soil.', 'Observe texture and colour before testing.']
      },
      {
        title: 'Test Texture',
        description: 'Feel the soil and compare particle size and cohesion.',
        instructions: ['Rub the soil between your fingers.', 'Estimate sand, silt and clay proportions.', 'Record observations.']
      },
      {
        title: 'Conclude',
        description: 'Explain how texture affects water movement and root development.',
        instructions: ['Link the texture to soil function.', 'Describe which sample may drain faster.', 'Summarise the agricultural importance.']
      }
    ]
  },
  'water-retention': {
    slug: 'water-retention',
    title: 'Water Retention',
    subject: 'agriculture',
    level: 'olevel',
    description: 'Measure how different soils hold water and affect plant growth.',
    difficulty: 'Intermediate',
    duration: '50 min',
    icon: 'Funnel and measuring cylinder',
    materials: [
      'Soil samples (sand, loam, clay)',
      'Measuring cylinders',
      'Filter funnels and filter paper',
      'Beakers',
      'Water',
      'Balance',
      'Timer',
      'Labels',
    ],
    learningObjectives: [
      'Measure water-holding capacity',
      'Compare different soil types',
      'Explain why retention matters for irrigation'
    ],
    steps: [
      {
        title: 'Prepare Soil Samples',
        description: 'Add equal amounts of dry soil to multiple containers.',
        instructions: ['Label the samples.', 'Add measured quantities of water.', 'Allow water to drain or soak in.']
      },
      {
        title: 'Measure Water Held',
        description: 'Determine how much moisture remains after draining.',
        instructions: ['Measure the water added and retained.', 'Record differences across samples.', 'Compare the findings.']
      },
      {
        title: 'Apply to Farming',
        description: 'Relate the data to irrigation and crop performance.',
        instructions: ['Discuss the role of soil structure.', 'Explain crop stress risk under poor retention.', 'State a conclusion.']
      }
    ]
  },
  'irrigation-planning': {
    slug: 'irrigation-planning',
    title: 'Irrigation Planning',
    subject: 'agriculture',
    level: 'olevel',
    description: 'Design efficient watering schedules that match crop needs and conserve water.',
    difficulty: 'Intermediate',
    duration: '55 min',
    icon: 'Rain gauge and plan sheet',
    materials: [
      'Soil moisture data sheet',
      'Crop water requirement chart',
      'Rain gauge',
      'Measuring cylinder',
      'Stopwatch',
      'Plan sheet and pencil',
      'Calculator',
      'Local climate records',
    ],
    learningObjectives: [
      'Design an irrigation plan',
      'Match water needs with crop requirements',
      'Recognize water conservation practices'
    ],
    steps: [
      {
        title: 'Assess Crop Need',
        description: 'Review crop type, climate, and soil characteristics.',
        instructions: ['Choose a crop scenario.', 'Record the expected water requirement.', 'Identify the soil moisture condition.']
      },
      {
        title: 'Plan Water Delivery',
        description: 'Create a schedule that meets the crop needs without excess waste.',
        instructions: ['Select an irrigation method.', 'Set the amount and timing.', 'Consider weather and soil conditions.']
      },
      {
        title: 'Evaluate the Plan',
        description: 'Explain how the irrigation plan supports sustainable farming.',
        instructions: ['Compare to a no-water or over-water scenario.', 'State the benefits of the plan.', 'Summarise the final recommendation.']
      }
    ]
  },
  'crop-yield-analysis': {
    slug: 'crop-yield-analysis',
    title: 'Crop Yield Analysis',
    subject: 'agriculture',
    level: 'olevel',
    description: 'Compare growth conditions to see which management practices produce the best harvest.',
    difficulty: 'Beginner',
    duration: '40 min',
    icon: 'Field plot and ruler',
    materials: [
      'Crop plots or potted plants',
      'Metre rule and measuring tape',
      'Balance',
      'Notebook and pen',
      'Labels',
      'Seeds and fertiliser samples',
      'Watering can',
    ],
    learningObjectives: [
      'Measure and compare crop output',
      'Identify factors affecting yield',
      'Explain why management decisions matter'
    ],
    steps: [
      {
        title: 'Set Up Comparison',
        description: 'Choose plots or conditions to compare.',
        instructions: ['Select variables to compare.', 'Keep the control conditions consistent.', 'Record the starting conditions.']
      },
      {
        title: 'Collect Growth Data',
        description: 'Measure plant height, health, or harvested weight.',
        instructions: ['Use the same method for each plot.', 'Record observations over time.', 'Note differences in growth.']
      },
      {
        title: 'Interpret Yield',
        description: 'Use the evidence to decide which treatment worked best.',
        instructions: ['Review the data trends.', 'Link the outcome to management practice.', 'Present an evidence-based conclusion.']
      }
    ]
  },
  'flame-tests': {
    slug: 'flame-tests',
    title: 'Flame Tests for Metal Ions',
    subject: 'chemistry',
    level: 'olevel',
    classLevel: 'S3',
    theme: 'Acids, Bases and Salts',
    description: 'Identify metal ions by the characteristic colours they produce in a non-luminous flame.',
    difficulty: 'Beginner',
    duration: '35 min',
    icon: 'flame',
    aim: 'To identify metal ions in salts using flame tests.',
    theory: 'When a metal salt is heated in a flame, electrons are excited to higher energy levels. As they return to lower levels they emit light of a characteristic wavelength, giving each metal ion a distinctive flame colour.',
    materials: [
      'Nichrome wire loop',
      'Concentrated hydrochloric acid',
      'Unknown metal salt samples',
      'Bunsen burner',
      'Heat-proof mat',
      'White tile',
      'Safety goggles',
    ],
    relatedTopics: ['Acids, Bases and Salts', 'Atomic Structure', 'Qualitative Analysis'],
    learningObjectives: [
      'Recall characteristic flame colours for common metal ions',
      'Explain why the wire is cleaned between tests',
      'Use flame test results to identify an unknown salt',
    ],
    precautions: [
      'Wear goggles and tie back long hair',
      'Keep flammable materials away from the flame',
      'Clean the nichrome wire in acid and rinse before each test',
      'Do not taste or inhale the salt samples',
    ],
    observationsTemplate: [
      'Colour of the flame for each salt',
      'Any difficulty in observing a weak flame colour',
      'Identity of the unknown salt from its flame colour',
    ],
    resultsGuidance: 'Lithium gives crimson red, sodium golden yellow, potassium lilac, calcium brick red and copper blue-green.',
    evaluation: [
      'Flame tests identify the metal ion, not the anion in the salt',
      'A clean wire prevents contamination from previous samples',
    ],
    steps: [
      {
        title: 'Clean the wire',
        description: 'Prepare a clean nichrome wire for the first sample.',
        instructions: [
          'Dip the nichrome wire loop in concentrated hydrochloric acid.',
          'Heat it in the non-luminous Bunsen flame until no colour is seen.',
          'Allow the wire to cool before the next sample.',
        ],
      },
      {
        title: 'Test each salt',
        description: 'Carry each salt into the flame and observe the colour.',
        instructions: [
          'Pick up a small sample on the clean wire loop.',
          'Hold the loop in the hottest part of the flame.',
          'Record the flame colour for each salt in a results table.',
        ],
      },
      {
        title: 'Identify the unknown',
        description: 'Compare the unknown salt with your reference results.',
        instructions: [
          'Test the unknown salt using the same method.',
          'Compare its flame colour with the known salts.',
          'Write a conclusion identifying the metal ion.',
        ],
      },
    ],
  }
};

export const experimentCatalog: Record<string, ExperimentEntry> = Object.fromEntries(
  Object.entries(baseExperimentCatalog).map(([slug, experiment]) => {
    const details = experimentDetails[slug];
    return [
      slug,
      {
        ...experiment,
        aim: experiment.aim ?? details?.aim ?? experiment.description,
        theory:
          experiment.theory ??
          details?.theory ??
          'This practical develops the scientific knowledge, measurement skills and evidence-based reasoning needed to explain the observed results.',
        precautions:
          experiment.precautions ??
          details?.precautions ?? [
            'Wear appropriate eye protection and follow the teacher’s safety instructions.',
            'Keep the bench tidy and handle all apparatus carefully.',
            'Report spills, breakages or injuries immediately.',
          ],
      },
    ];
  }),
);

export const availableExperimentSlugs = Object.keys(experimentCatalog);