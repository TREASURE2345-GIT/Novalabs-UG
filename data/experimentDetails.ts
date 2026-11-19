import type { ExperimentEntry } from './experimentCatalog';

type ExperimentDetails = Pick<ExperimentEntry, 'aim' | 'theory' | 'precautions'>;

export const experimentDetails: Record<string, ExperimentDetails> = {
  'cell-division': {
    aim: 'To observe and identify the stages of mitosis in a prepared root tip.',
    theory:
      'Mitosis produces two genetically identical daughter cells. Chromosomes condense, line up at the equator, separate and are enclosed in new nuclei before the cell divides.',
    precautions: [
      'Use a sharp blade and cork borer carefully, cutting away from your body.',
      'Handle the stain and clearing agents with gloves and eye protection.',
      'Dispose of glass slides and broken coverslips in the sharps bin.',
    ],
  },
  'genetics-simulation': {
    aim: 'To model inheritance and compare observed offspring ratios with expected ratios.',
    theory:
      'Alleles separate during meiosis and combine at fertilisation. A Punnett square predicts genotype and phenotype ratios, while chance causes small samples to differ from expectations.',
    precautions: [
      'Handle counters, beads or model chromosomes responsibly so none are lost.',
      'Keep the work area clear to avoid mixing different allele sets.',
      'Record every trial honestly and do not adjust results to match the expected ratio.',
    ],
  },
  'photosynthesis-lab': {
    aim: 'To investigate how light intensity affects the rate of photosynthesis in pondweed.',
    theory:
      'Photosynthesis uses light energy to convert carbon dioxide and water into glucose and oxygen. Increasing light intensity increases the rate until another limiting factor slows the process.',
    precautions: [
      'Keep the lamp away from water and switch it off before adjusting the apparatus.',
      'Do not look directly at a bright lamp.',
      'Handle the hot lamp housing carefully and keep the bench dry.',
    ],
  },
  'microscopy-basics': {
    aim: 'To prepare a specimen and use a light microscope to observe cells at different magnifications.',
    theory:
      'A light microscope uses two lenses to magnify an image. Total magnification is the eyepiece magnification multiplied by the objective magnification.',
    precautions: [
      'Carry the microscope with both hands and keep it on a stable bench.',
      'Use fine focus only with the high-power objective to avoid breaking the slide.',
      'Clean lenses with lens tissue, never with your fingers or a rough cloth.',
    ],
  },
  'osmosis-in-potato-cells': {
    aim: 'To investigate the effect of sugar concentration on mass change in potato tissue.',
    theory:
      'Osmosis is the movement of water across a partially permeable membrane from higher to lower water potential. Potato tissue gains mass in dilute solutions and loses mass in concentrated solutions.',
    precautions: [
      'Use the cork borer and knife safely, cutting on a cutting board away from your fingers.',
      'Wear goggles when preparing sugar solutions.',
      'Blot potato cylinders gently and handle them consistently so mass readings are reliable.',
    ],
  },
  'food-tests-and-nutrition': {
    aim: 'To identify reducing sugars, starch, protein and lipids in food samples.',
    theory:
      'Specific reagents react with particular food molecules: Benedict’s solution detects reducing sugars, iodine detects starch, Biuret detects protein and ethanol detects lipids.',
    precautions: [
      'Benedict’s test involves hot water; handle the water bath and test tubes with tongs.',
      'Keep ethanol away from flames because it is highly flammable.',
      'Wear goggles and gloves, and never taste laboratory food samples.',
    ],
  },
  'enzyme-activity-temperature': {
    aim: 'To investigate the effect of temperature on the activity of amylase.',
    theory:
      'Enzymes are proteins with an active site. Activity increases with temperature until the optimum, after which the enzyme denatures and the rate falls sharply.',
    precautions: [
      'Handle hot water baths and boiling tubes with tongs and heat-resistant gloves.',
      'Wear goggles when heating solutions.',
      'Use a water bath rather than a direct flame to heat the enzyme samples.',
    ],
  },
  'testing-leaf-for-starch': {
    aim: 'To test a variegated leaf for the presence of starch after exposure to light.',
    theory:
      'Photosynthesis produces glucose, which is stored as starch. Iodine solution turns blue-black where starch is present, so covered or non-green areas give a negative result.',
    precautions: [
      'Boil the leaf in ethanol using a water bath and keep the ethanol away from naked flames.',
      'Use tongs when handling hot test tubes and beakers.',
      'Wear goggles and gloves because iodine and hot ethanol can irritate the skin and eyes.',
    ],
  },
  'acid-base-titration': {
    aim: 'To determine the concentration of an acid or alkali by titration.',
    theory:
      'In a neutralisation reaction, acid and alkali react in a fixed mole ratio. The volume of standard solution needed to reach the end point allows the unknown concentration to be calculated.',
    precautions: [
      'Wear goggles and fill the burette below eye level using a funnel.',
      'Handle acids and alkalis carefully and rinse any spills with plenty of water.',
      'Read the meniscus at eye level and remove air bubbles before starting the titration.',
    ],
  },
  'reaction-rates': {
    aim: 'To investigate how reactant concentration affects the rate of a chemical reaction.',
    theory:
      'Collision theory explains reaction rate: more concentrated reactants produce more frequent collisions, so the reaction proceeds faster. The rate can be followed by timing a visual change.',
    precautions: [
      'Wear goggles and gloves when handling sodium thiosulfate and dilute acid.',
      'Keep the bench clear and put away flammable materials.',
      'Wash hands after handling chemicals and dispose of waste as instructed.',
    ],
  },
  thermochemistry: {
    aim: 'To measure the temperature change produced by a chemical reaction.',
    theory:
      'Exothermic reactions release energy to the surroundings, raising the temperature. The heat energy change can be calculated from the mass, specific heat capacity and temperature change.',
    precautions: [
      'Handle hot and cold solutions with care and use a thermometer safely.',
      'Wear goggles and avoid splashing chemicals into the eyes.',
      'Allow hot apparatus to cool before touching or dismantling it.',
    ],
  },
  crystallization: {
    aim: 'To obtain pure crystals of a soluble salt by crystallisation.',
    theory:
      'Solubility usually increases with temperature. A hot saturated solution becomes supersaturated as it cools, so dissolved solute crystallises out while soluble impurities remain in the mother liquor.',
    precautions: [
      'Handle the hot saturated solution with heat-resistant gloves and goggles.',
      'Do not touch hot evaporating basins or glassware until they have cooled.',
      'Heat gently to avoid spitting and always point test-tube openings away from people.',
    ],
  },
  'paper-chromatography': {
    aim: 'To separate and identify the pigments or dyes in a mixture using paper chromatography.',
    theory:
      'Chromatography separates substances because they have different solubilities and different attractions to the stationary phase. Each substance travels a characteristic distance, giving a distinct Rf value.',
    precautions: [
      'Keep the solvent below the starting line so the samples do not dissolve into the reservoir.',
      'Handle the solvent in a ventilated area and keep it away from flames.',
      'Avoid touching the chromatography paper with your fingers, which can contaminate the results.',
    ],
  },
  'preparing-a-salt': {
    aim: 'To prepare pure crystals of a soluble salt from an insoluble base and an acid.',
    theory:
      'An acid reacts with an insoluble base to form a soluble salt and water. Excess base is filtered off, and the salt is recovered by crystallisation.',
    precautions: [
      'Wear goggles and gloves because the acid and salt solutions can irritate skin and eyes.',
      'Add the base in small portions and stir carefully to avoid vigorous fizzing.',
      'Handle hot glassware with tongs and allow crystals to cool before filtering.',
    ],
  },
  'rusting-of-iron': {
    aim: 'To investigate the conditions required for iron to rust.',
    theory:
      'Iron rusts when it is exposed to both oxygen and water. Removing either oxygen (using a desiccant) or water (using a sealed dry tube) prevents rust formation.',
    precautions: [
      'Handle calcium chloride and other desiccants with care and keep them away from eyes.',
      'Keep water away from electrical equipment and wipe up spills immediately.',
      'Wash hands after handling nails and chemical drying agents.',
    ],
  },
  'velocity-and-acceleration': {
    aim: 'To determine the velocity and acceleration of a moving trolley.',
    theory:
      'Velocity is displacement divided by time. Acceleration is the change in velocity divided by the time taken, and can be found from the gradient of a velocity–time graph.',
    precautions: [
      'Keep feet and clothing clear of the moving trolley and runway.',
      'Secure the runway and place a stop at the end so the trolley cannot fall off.',
      'Handle ticker timers and power supplies with dry hands and switch off after use.',
    ],
  },
  'simple-circuits': {
    aim: 'To investigate the relationship between voltage, current and resistance in a simple circuit.',
    theory:
      'Ohm’s law states that current is directly proportional to voltage for a conductor at constant temperature. Resistance equals voltage divided by current.',
    precautions: [
      'Switch off the power supply before changing or connecting components.',
      'Check that wires and insulation are not damaged before use.',
      'Do not touch hot resistors or lamps and avoid short circuits.',
    ],
  },
  'wave-properties': {
    aim: 'To investigate the relationship between frequency, wavelength and wave speed.',
    theory:
      'Wave speed equals frequency multiplied by wavelength. For a given medium, changing the frequency changes the wavelength while the speed remains approximately constant.',
    precautions: [
      'Keep water away from electrical sockets and power supplies.',
      'Do not overload the ripple tank and wipe up spills immediately.',
      'Handle the signal generator and lamp carefully, switching off before adjustments.',
    ],
  },
  'friction-and-motion': {
    aim: 'To investigate how surface type and load affect the force needed to move an object.',
    theory:
      'Friction opposes relative motion between surfaces. The limiting frictional force depends on the surfaces and the normal reaction, and affects acceleration under a constant pull.',
    precautions: [
      'Place masses securely so they cannot fall on feet during the experiment.',
      'Keep the pull steady and stand clear of falling weights.',
      'Handle the spring balance within its range to avoid damaging it.',
    ],
  },
  'hookes-law': {
    aim: 'To verify Hooke’s law and determine the spring constant of a spring.',
    theory:
      'Hooke’s law states that the extension of a spring is directly proportional to the applied force, provided the elastic limit is not exceeded; the gradient of a force–extension graph gives the spring constant.',
    precautions: [
      'Clamp the spring securely and place a cushion below the masses.',
      'Do not exceed the spring’s elastic limit or add masses suddenly.',
      'Wear safety glasses and keep feet clear of the hanging masses.',
    ],
  },
  'density-of-solids': {
    aim: 'To determine the density of regular and irregular solids.',
    theory:
      'Density is mass per unit volume. The mass is measured with a balance, while the volume of an irregular solid is found from the volume of water it displaces.',
    precautions: [
      'Handle the balance carefully and place solids gently on the pan.',
      'Use the displacement can over a tray to catch overflowing water.',
      'Wear goggles when using overflow apparatus and wipe up spills immediately.',
    ],
  },
  'plasmolysis-in-plant-cells': {
    aim: 'To observe plasmolysis in plant cells placed in a concentrated salt solution.',
    theory:
      'Water leaves the cell vacuole by osmosis when the external solution has a lower water potential. The protoplast shrinks away from the cell wall, producing plasmolysis.',
    precautions: [
      'Use a sharp knife or scalpel safely and cut on a cutting board.',
      'Wear goggles and gloves when preparing salt solutions and handling stain.',
      'Dispose of glass slides carefully and clean the microscope stage after use.',
    ],
  },
  'respiration-in-germinating-seeds': {
    aim: 'To investigate respiration in germinating seeds by measuring heat and carbon dioxide production.',
    theory:
      'Germinating seeds respire aerobically, releasing energy, carbon dioxide and heat. A thermos flask or respirometer can show the temperature rise or gas exchange.',
    precautions: [
      'Handle the hot water and thermos flask carefully.',
      'Do not seal living seeds in a container for too long without adequate air.',
      'Wash hands after handling seeds and soil and clean up spilled water.',
    ],
  },
  'water-of-crystallisation': {
    aim: 'To determine the water of crystallisation in a hydrated salt.',
    theory:
      'Hydrated salts contain water chemically bound in their crystal structure. Heating drives off this water of crystallisation, and the mass loss can be used to calculate the formula.',
    precautions: [
      'Heat the crucible gently and use tongs to move hot apparatus.',
      'Wear goggles and keep your face away from the crucible opening.',
      'Allow the crucible to cool in a desiccator before weighing.',
    ],
  },
  'enthalpy-of-neutralisation': {
    aim: 'To determine the enthalpy change of neutralisation for an acid–alkali reaction.',
    theory:
      'Neutralisation releases heat energy. Using the mass of the solution, its specific heat capacity and the temperature rise, the heat released and the enthalpy change per mole can be calculated.',
    precautions: [
      'Wear goggles and gloves when handling acids and alkalis.',
      'Handle the thermometer carefully and stir gently to avoid breaking it.',
      'Allow the apparatus to cool and dispose of the neutral solution safely.',
    ],
  },
  'redox-titration': {
    aim: 'To determine the concentration of a reducing agent using a redox titration.',
    theory:
      'Potassium manganate(VII) is a purple oxidising agent that is reduced to colourless manganese(II) ions. The first permanent pink colour marks the end point and allows mole calculations.',
    precautions: [
      'Wear goggles and gloves because potassium manganate(VII) stains and oxidises skin.',
      'Handle dilute sulfuric acid carefully and clean up spills immediately.',
      'Rinse the burette and read the meniscus at eye level.',
    ],
  },
  'simple-pendulum': {
    aim: 'To investigate how the length of a pendulum affects its period.',
    theory:
      'For small oscillations, the period of a simple pendulum depends on its length and gravitational field strength, not on its mass or amplitude: T = 2π√(l/g).',
    precautions: [
      'Clamp the pendulum securely so the support cannot topple.',
      'Keep the swing small and stand clear of the moving bob.',
      'Measure from the pivot to the centre of the bob and use a stopwatch carefully.',
    ],
  },
  'emf-and-internal-resistance': {
    aim: 'To determine the electromotive force and internal resistance of a cell.',
    theory:
      'The terminal voltage of a cell falls as current increases because of its internal resistance. A graph of terminal voltage against current has intercept equal to the emf and gradient equal to −r.',
    precautions: [
      'Do not short-circuit the cell and keep the current within its safe rating.',
      'Switch off the circuit between readings to prevent overheating.',
      'Check the polarity of the cell, meter and leads before connecting.',
    ],
  },
  'soil-texture-test': {
    aim: 'To determine soil texture by sedimentation and feel tests.',
    theory:
      'Soil particles settle at different rates in water because of their size. Sand settles first, followed by silt and then clay, allowing the proportions to be estimated.',
    precautions: [
      'Wash hands after handling soil and avoid ingesting soil dust.',
      'Use a sturdy jar and place it where it cannot be knocked over.',
      'Clean up spills and dispose of soil samples responsibly.',
    ],
  },
  'water-retention': {
    aim: 'To compare the water retention of different soil samples.',
    theory:
      'Soils with more small pores, especially clay-rich soils, retain more water than sandy soils with large pores. The amount of water retained can be measured by drainage and mass change.',
    precautions: [
      'Wipe up water spills immediately to prevent slips.',
      'Support the filter funnel and collecting vessel securely.',
      'Wash hands after handling soil and dispose of wet soil safely.',
    ],
  },
  'irrigation-planning': {
    aim: 'To compare irrigation methods and decide how much water a crop needs.',
    theory:
      'Water is lost from soil by evaporation and drainage and used by plants through transpiration. Irrigation should replace losses without causing waterlogging or runoff.',
    precautions: [
      'Keep water away from electrical equipment and power points.',
      'Wipe up spills and avoid lifting heavy water containers incorrectly.',
      'Wash hands after handling soil and plant material.',
    ],
  },
  'crop-yield-analysis': {
    aim: 'To analyse how selected growth factors affect crop yield.',
    theory:
      'Crop yield depends on factors such as water, light, nutrients and spacing. Comparing treatments allows the effect of each factor to be identified, while fair tests require all other variables to be controlled.',
    precautions: [
      'Wash hands after handling soil, plants or harvested crop material.',
      'Use clean, undamaged tools and handle them carefully.',
      'Record raw measurements honestly and do not exclude valid outliers without justification.',
    ],
  },
};
