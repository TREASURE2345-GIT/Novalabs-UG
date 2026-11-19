import type { ExperimentEntry } from './experimentCatalog';

export type SimulationTrial = {
  x: number;
  y: number;
};

export type SimulationConfig = {
  title: string;
  prompt: string;
  independent: {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    decimals?: number;
  };
  dependent: {
    label: string;
    unit: string;
    decimals?: number;
  };
  model: (x: number) => number;
  trend: string;
  interpretation: string;
  safety?: string;
};

const round = (value: number, decimals = 1) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const subjectDefaults: Record<ExperimentEntry['subject'], SimulationConfig> = {
  biology: {
    title: 'Light and photosynthesis',
    prompt: 'Change the light intensity and record the oxygen bubbles produced by pondweed.',
    independent: { label: 'Light intensity', unit: '%', min: 0, max: 100, step: 5, defaultValue: 40 },
    dependent: { label: 'Oxygen bubbles', unit: 'bubbles/min', decimals: 0 },
    model: (x) => round(34 * (1 - Math.exp(-x / 28)), 0),
    trend: 'As light intensity rises, the rate of photosynthesis rises quickly and then levels off.',
    interpretation:
      'Light supplies the energy for photosynthesis. At low light the rate is limited by light; at high light another factor such as carbon dioxide becomes limiting.',
  },
  chemistry: {
    title: 'Titration curve',
    prompt: 'Add acid from the burette and watch the pH change as the neutralisation endpoint approaches.',
    independent: { label: 'Acid added', unit: 'cm³', min: 0, max: 50, step: 0.5, defaultValue: 10 },
    dependent: { label: 'pH', unit: 'pH', decimals: 2 },
    model: (x) => round(1.5 + 12 / (1 + Math.exp(-(x - 25) / 1.8)), 2),
    trend: 'The pH changes slowly at first, then jumps sharply near the endpoint before flattening out.',
    interpretation:
      'Near the equivalence point a very small volume of acid changes the pH dramatically. The steepest part of the curve marks the endpoint.',
  },
  physics: {
    title: 'Load and extension',
    prompt: 'Add masses to the spring and measure how far it extends.',
    independent: { label: 'Load', unit: 'g', min: 0, max: 500, step: 10, defaultValue: 100 },
    dependent: { label: 'Extension', unit: 'mm', decimals: 1 },
    model: (x) => round(x <= 300 ? 0.045 * x : 13.5 + 0.02 * (x - 300), 1),
    trend: 'Extension is proportional to load until the elastic limit, after which the spring stretches more easily.',
    interpretation:
      "Hooke's law holds in the straight-line region. Beyond the elastic limit the spring is permanently deformed.",
  },
  agriculture: {
    title: 'Soil water retention',
    prompt: 'Change the clay content of a soil sample and measure how much water it retains.',
    independent: { label: 'Clay content', unit: '%', min: 0, max: 100, step: 5, defaultValue: 30 },
    dependent: { label: 'Water retained', unit: 'ml', decimals: 1 },
    model: (x) => round(18 + 0.58 * x, 1),
    trend: 'Soils with more clay retain more water, while sandy soils drain quickly.',
    interpretation:
      'Clay particles are small with a large surface area, so they hold more water. Loam balances retention and drainage for healthy crop growth.',
  },
};

const overrides: Record<string, SimulationConfig> = {
  'dna-extraction': {
    title: 'Ethanol temperature and DNA yield',
    prompt: 'Change the temperature of the ethanol and measure how much DNA precipitates from the filtrate.',
    independent: { label: 'Ethanol temperature', unit: '°C', min: -20, max: 30, step: 5, defaultValue: -5, decimals: 0 },
    dependent: { label: 'DNA yield', unit: 'mg', decimals: 1 },
    model: (x) => round(2 + 30 * Math.exp(-(((x + 5) / 16) ** 2)), 1),
    trend: 'DNA yield is highest with ice-cold ethanol and falls as the ethanol warms.',
    interpretation:
      'Cold ethanol lowers DNA solubility so the DNA precipitates out of solution. Warm ethanol dissolves DNA more readily and gives a much lower yield.',
    safety: 'Ethanol is flammable. Keep it away from flames and work in a ventilated area.',
  },
  'photosynthesis-lab': {
    title: 'Pondweed and light distance',
    prompt: 'Move the lamp further from the pondweed and count the oxygen bubbles released per minute.',
    independent: { label: 'Lamp distance', unit: 'cm', min: 5, max: 50, step: 5, defaultValue: 10 },
    dependent: { label: 'Oxygen bubbles', unit: 'bubbles/min', decimals: 0 },
    model: (x) => round(44 / (1 + x / 12), 0),
    trend: 'Bubble count falls as the lamp is moved further away.',
    interpretation:
      'Light intensity obeys an inverse-square relationship with distance, so moving the lamp away reduces the energy reaching the pondweed and slows photosynthesis.',
  },
  'enzyme-activity-temperature': {
    title: 'Catalase and temperature',
    prompt: 'Set the water bath temperature and measure the volume of oxygen released by catalase.',
    independent: { label: 'Temperature', unit: '°C', min: 0, max: 90, step: 5, defaultValue: 35 },
    dependent: { label: 'Gas released', unit: 'cm³/min', decimals: 1 },
    model: (x) => round(22 * Math.exp(-(((x - 37) / 16) ** 2)), 1),
    trend: 'Activity is low when cold, peaks near 37 °C, then falls sharply as the enzyme denatures.',
    interpretation:
      'Enzymes have an optimum temperature. Above the optimum the enzyme active site changes shape and activity is lost irreversibly.',
  },
  'osmosis-in-potato-cells': {
    title: 'Potato mass in sucrose',
    prompt: 'Choose a sucrose concentration and measure the percentage change in potato mass.',
    independent: { label: 'Sucrose concentration', unit: 'mol/dm³', min: 0, max: 1, step: 0.1, defaultValue: 0.3, decimals: 1 },
    dependent: { label: 'Mass change', unit: '%', decimals: 1 },
    model: (x) => round(18 * (1 - 1.8 * x), 1),
    trend: 'Potato mass increases in dilute solutions and decreases in concentrated sucrose.',
    interpretation:
      'In dilute solutions water enters the cells by osmosis. In concentrated sucrose water leaves the cells, so the tissue loses mass and becomes flaccid.',
  },
  'testing-leaf-for-starch': {
    title: 'Light hours and starch',
    prompt: 'Vary how long the leaf was in the light and measure the iodine colour intensity.',
    independent: { label: 'Time in light', unit: 'hours', min: 0, max: 12, step: 1, defaultValue: 4 },
    dependent: { label: 'Starch index', unit: '0-10', decimals: 1 },
    model: (x) => round(10 * (1 - Math.exp(-x / 3)), 1),
    trend: 'More time in light produces more starch until the leaf reaches its maximum.',
    interpretation:
      'Photosynthesis makes glucose, which is stored as starch. Iodine turns blue-black when starch is present, so a darker result means more starch.',
  },
  'acid-base-titration': {
    title: 'Acid-base titration',
    prompt: 'Run acid into the alkali and watch the pH curve. The sharp jump marks the endpoint.',
    independent: { label: 'Acid added', unit: 'cm³', min: 0, max: 50, step: 0.5, defaultValue: 20 },
    dependent: { label: 'pH', unit: 'pH', decimals: 2 },
    model: (x) => round(1.5 + 12 / (1 + Math.exp(-(x - 24.5) / 1.6)), 2),
    trend: 'The pH stays nearly flat, then rises steeply at about 24.5 cm³ before levelling off.',
    interpretation:
      'The steepest part of the curve is the endpoint. Concordant titres are averaged to calculate the unknown concentration.',
  },
  'reaction-rates': {
    title: 'Temperature and reaction time',
    prompt: 'Heat the reaction mixture and time how long the cross takes to disappear.',
    independent: { label: 'Temperature', unit: '°C', min: 10, max: 60, step: 5, defaultValue: 25 },
    dependent: { label: 'Reaction time', unit: 's', decimals: 0 },
    model: (x) => round(140 * Math.exp(-(x - 10) / 14), 0),
    trend: 'The reaction time falls rapidly as temperature increases.',
    interpretation:
      'Higher temperature gives particles more kinetic energy, so collisions are more frequent and energetic. The rate therefore increases and the reaction finishes sooner.',
  },
  'thermochemistry': {
    title: 'Temperature-time graph',
    prompt: 'Record the temperature as the neutralisation reaction proceeds.',
    independent: { label: 'Time', unit: 's', min: 0, max: 300, step: 15, defaultValue: 60 },
    dependent: { label: 'Temperature', unit: '°C', decimals: 1 },
    model: (x) => round(22 + 6.5 * (1 - Math.exp(-x / 40)), 1),
    trend: 'Temperature rises quickly at first, then levels off as the reaction finishes.',
    interpretation:
      'The reaction releases heat to the surroundings, so temperature rises. The total temperature change is used to calculate the enthalpy change.',
  },
  'crystallization': {
    title: 'Cooling and crystal yield',
    prompt: 'Cool a saturated solution and measure the mass of crystals formed.',
    independent: { label: 'Cooling temperature', unit: '°C', min: 0, max: 80, step: 5, defaultValue: 30 },
    dependent: { label: 'Crystal mass', unit: 'g', decimals: 1 },
    model: (x) => round(68 - 0.62 * x, 1),
    trend: 'Crystal yield increases as the solution is cooled to lower temperatures.',
    interpretation:
      'Solubility falls as the solution cools, so dissolved solute comes out of solution and forms an ordered crystal lattice.',
  },
  'hookes-law': {
    title: "Hooke's law spring",
    prompt: 'Hang weights on the spring and measure the extension.',
    independent: { label: 'Load', unit: 'g', min: 0, max: 500, step: 10, defaultValue: 100 },
    dependent: { label: 'Extension', unit: 'mm', decimals: 1 },
    model: (x) => round(x <= 300 ? 0.045 * x : 13.5 + 0.02 * (x - 300), 1),
    trend: 'Extension is proportional to load up to about 300 g, then the graph curves.',
    interpretation:
      "The straight line through the origin confirms Hooke's law. The point where the line curves is the elastic limit.",
  },
  'simple-circuits': {
    title: 'Resistance and current',
    prompt: 'Change the resistance and measure the current in the circuit.',
    independent: { label: 'Resistance', unit: 'Ω', min: 1, max: 20, step: 1, defaultValue: 5 },
    dependent: { label: 'Current', unit: 'A', decimals: 2 },
    model: (x) => round(12 / (x + 2), 2),
    trend: 'Current falls as resistance increases.',
    interpretation:
      "Ohm's law states V = IR. With a fixed supply voltage, increasing resistance reduces the current.",
  },
  'simple-pendulum': {
    title: 'Pendulum length and period',
    prompt: 'Change the length of the pendulum and measure its period.',
    independent: { label: 'Length', unit: 'm', min: 0.2, max: 1, step: 0.05, defaultValue: 0.6, decimals: 2 },
    dependent: { label: 'Period', unit: 's', decimals: 2 },
    model: (x) => round(2 * Math.PI * Math.sqrt(x / 9.81), 2),
    trend: 'The period increases as the pendulum gets longer.',
    interpretation:
      'For a simple pendulum, T = 2π√(l/g). A graph of T² against l has gradient 4π²/g, which allows g to be determined.',
  },
  'density-of-solids': {
    title: 'Volume and mass',
    prompt: 'Change the volume of the metal sample and measure its mass.',
    independent: { label: 'Volume', unit: 'cm³', min: 5, max: 100, step: 5, defaultValue: 20 },
    dependent: { label: 'Mass', unit: 'g', decimals: 1 },
    model: (x) => round(2.7 * x, 1),
    trend: 'Mass increases in direct proportion to volume.',
    interpretation:
      'The gradient of a mass-volume graph equals the density. For aluminium the density is about 2.7 g/cm³.',
  },
  'wave-properties': {
    title: 'Frequency and wavelength',
    prompt: 'Change the wave frequency on the ripple tank and measure the wavelength.',
    independent: { label: 'Frequency', unit: 'Hz', min: 1, max: 20, step: 1, defaultValue: 8 },
    dependent: { label: 'Wavelength', unit: 'm', decimals: 2 },
    model: (x) => round(0.6 / x, 2),
    trend: 'Wavelength decreases as frequency increases.',
    interpretation:
      'Wave speed = frequency × wavelength. If the speed is constant, increasing frequency shortens the wavelength.',
  },
  'friction-and-motion': {
    title: 'Slope angle and friction',
    prompt: 'Tilt the ramp and measure the force needed to keep the block moving.',
    independent: { label: 'Slope angle', unit: '°', min: 0, max: 45, step: 5, defaultValue: 15 },
    dependent: { label: 'Friction force', unit: 'N', decimals: 2 },
    model: (x) => round(3.2 * Math.cos((x * Math.PI) / 180), 2),
    trend: 'The friction force falls as the slope becomes steeper.',
    interpretation:
      'Friction depends on the normal reaction. On a steeper slope the normal reaction is smaller, so friction is reduced.',
  },
  'velocity-and-acceleration': {
    title: 'Ticker-tape motion',
    prompt: 'Run the trolley and measure its velocity at different times.',
    independent: { label: 'Time', unit: 's', min: 0, max: 5, step: 0.5, defaultValue: 1, decimals: 1 },
    dependent: { label: 'Velocity', unit: 'm/s', decimals: 2 },
    model: (x) => round(1.8 * x, 2),
    trend: 'Velocity increases steadily with time, showing constant acceleration.',
    interpretation:
      'The gradient of a velocity-time graph is acceleration. A straight line through the origin means uniform acceleration.',
  },
  'microscopy-basics': {
    title: 'Magnification and field of view',
    prompt: 'Change the magnification and measure the diameter of the field of view.',
    independent: { label: 'Magnification', unit: '×', min: 40, max: 1000, step: 20, defaultValue: 100 },
    dependent: { label: 'Field of view', unit: 'µm', decimals: 0 },
    model: (x) => round(180000 / x, 0),
    trend: 'The field of view gets smaller as magnification increases.',
    interpretation:
      'Higher magnification shows more detail but covers a smaller area, so fewer cells are visible at once.',
  },
  'water-retention': {
    title: 'Soil water retention',
    prompt: 'Change the clay content and measure how much water the soil retains.',
    independent: { label: 'Clay content', unit: '%', min: 0, max: 100, step: 5, defaultValue: 30 },
    dependent: { label: 'Water retained', unit: 'ml', decimals: 1 },
    model: (x) => round(18 + 0.58 * x, 1),
    trend: 'Water retention increases with clay content.',
    interpretation:
      'Clay has tiny particles and a large surface area, so it holds more water than sand. Loam gives a balance for crop roots.',
  },
  'soil-texture-test': {
    title: 'Soil settling test',
    prompt: 'Leave the soil suspension to settle and measure the height of settled soil.',
    independent: { label: 'Settling time', unit: 'min', min: 0, max: 120, step: 10, defaultValue: 30 },
    dependent: { label: 'Settled height', unit: 'mm', decimals: 1 },
    model: (x) => round(40 + 0.45 * x, 1),
    trend: 'Settled soil height rises quickly at first and then slowly levels off.',
    interpretation:
      'Sand settles first, silt next and clay last. The layers and settling rate reveal the soil texture.',
  },
  'irrigation-planning': {
    title: 'Irrigation interval',
    prompt: 'Change the number of days between watering and measure the water needed.',
    independent: { label: 'Interval', unit: 'days', min: 1, max: 10, step: 1, defaultValue: 4 },
    dependent: { label: 'Water required', unit: 'mm', decimals: 1 },
    model: (x) => round(15 + 4 * x, 1),
    trend: 'Longer intervals require more water per application.',
    interpretation:
      'Matching the irrigation interval to crop water demand saves water and reduces runoff. Frequent light watering can waste water through evaporation.',
  },
  'crop-yield-analysis': {
    title: 'Fertiliser and crop yield',
    prompt: 'Add fertiliser to a trial plot and measure the grain yield.',
    independent: { label: 'Fertiliser', unit: 'kg/ha', min: 0, max: 120, step: 10, defaultValue: 40 },
    dependent: { label: 'Grain yield', unit: 't/ha', decimals: 2 },
    model: (x) => round(1.5 + 0.05 * x - 0.00018 * x * x, 2),
    trend: 'Yield rises with fertiliser, reaches a peak, then slowly declines with excess.',
    interpretation:
      'Moderate fertiliser supplies limiting nutrients, but too much can damage roots and reduce yield. The data supports evidence-based application rates.',
  },
  'emf-and-internal-resistance': {
    title: 'Terminal voltage and current',
    prompt: 'Change the current drawn from the cell and measure the terminal voltage.',
    independent: { label: 'Current', unit: 'A', min: 0.1, max: 1.5, step: 0.1, defaultValue: 0.5 },
    dependent: { label: 'Terminal voltage', unit: 'V', decimals: 2 },
    model: (x) => round(1.5 - 0.6 * x, 2),
    trend: 'Terminal voltage falls linearly as current increases.',
    interpretation:
      'The intercept of a V-I graph is the EMF and the negative gradient is the internal resistance.',
  },
  'rusting-of-iron': {
    title: 'Rusting over time',
    prompt: 'Record how much of the iron surface rusts each day in tap water.',
    independent: { label: 'Time', unit: 'days', min: 0, max: 10, step: 1, defaultValue: 3 },
    dependent: { label: 'Rust coverage', unit: '%', decimals: 0 },
    model: (x) => round(100 * (1 - Math.exp(-x / 3)), 0),
    trend: 'Rust coverage rises quickly at first and then levels off.',
    interpretation:
      'Iron needs both oxygen and water to rust. Covering the nail with oil or keeping it dry prevents rusting.',
  },
  'cell-division': {
    title: 'Mitotic index in a root tip',
    prompt: 'Sample cells from the onion root tip at different times and measure how many are actively dividing.',
    independent: { label: 'Root growth time', unit: 'hours', min: 0, max: 24, step: 1, defaultValue: 8 },
    dependent: { label: 'Mitotic index', unit: '%', decimals: 1 },
    model: (x) => round(2 + 10 * (1 - Math.exp(-x / 6)), 1),
    trend: 'The mitotic index rises quickly in young, actively growing tissue and then levels off.',
    interpretation:
      'Cells divide most frequently in the meristem behind the root tip. Counting cells in each stage shows that mitosis is a continuous cycle rather than a single event.',
    safety: 'Handle the scalpel and stain with care. Acetocarmine can stain skin and clothing.',
  },
  'genetics-simulation': {
    title: 'Allele frequency and phenotype',
    prompt: 'Change the frequency of the recessive allele and predict the proportion of recessive offspring.',
    independent: { label: 'Recessive allele frequency', unit: '%', min: 0, max: 100, step: 5, defaultValue: 50 },
    dependent: { label: 'Recessive phenotype', unit: '%', decimals: 1 },
    model: (x) => round(((x / 100) ** 2) * 100, 1),
    trend: 'The recessive phenotype stays rare until the recessive allele becomes common.',
    interpretation:
      'With random mating, a recessive phenotype needs two recessive alleles, so its frequency is q squared. This is why a rare recessive allele produces very few affected offspring.',
  },
  'food-tests-and-nutrition': {
    title: 'Benedict test colour scale',
    prompt: 'Change the reducing-sugar concentration and observe the colour produced after heating with Benedict\'s solution.',
    independent: { label: 'Glucose concentration', unit: 'g/dm3', min: 0, max: 10, step: 0.5, defaultValue: 3 },
    dependent: { label: 'Colour intensity', unit: 'score /5', decimals: 1 },
    model: (x) => round(Math.min(5, 0.55 * x), 1),
    trend: 'The colour changes from blue through green and yellow to brick-red as sugar concentration rises.',
    interpretation:
      'Reducing sugars reduce blue copper(II) ions to red copper(I) oxide. A higher sugar concentration produces more precipitate and a stronger colour change.',
    safety: 'Benedict\'s solution is irritant and the water bath is hot. Wear goggles and handle hot tubes with tongs.',
  },
  'paper-chromatography': {
    title: 'Dye separation on chromatography paper',
    prompt: 'Allow the solvent to rise up the paper and measure how far the dye travels.',
    independent: { label: 'Solvent front', unit: 'cm', min: 0, max: 10, step: 0.5, defaultValue: 6 },
    dependent: { label: 'Dye distance', unit: 'cm', decimals: 1 },
    model: (x) => round(0.65 * x, 1),
    trend: 'The dye front moves in proportion to the solvent front, giving a constant Rf value.',
    interpretation:
      'The Rf value compares the distance moved by the dye with the distance moved by the solvent. A pure dye gives one spot, while a mixture separates into several spots with different Rf values.',
    safety: 'Keep the solvent away from flames and avoid breathing solvent vapour.',
  },
  'preparing-a-salt': {
    title: 'Acid volume and salt yield',
    prompt: 'React copper(II) oxide with dilute acid and measure the mass of salt formed after crystallisation.',
    independent: { label: 'Acid volume', unit: 'cm3', min: 0, max: 50, step: 5, defaultValue: 25 },
    dependent: { label: 'Salt yield', unit: 'g', decimals: 1 },
    model: (x) => round(0.32 * x, 1),
    trend: 'Salt yield increases steadily as more acid reacts, until the acid is used up.',
    interpretation:
      'The acid is the limiting reactant in this procedure. Adding excess base ensures all the acid reacts; filtering removes the unused base before the solution is evaporated to crystallise the salt.',
    safety: 'Acids are corrosive and the base is harmful. Wear goggles and a lab coat, and add the base in small portions.',
  },
  'plasmolysis-in-plant-cells': {
    title: 'Sucrose concentration and plasmolysis',
    prompt: 'Place onion epidermis in sucrose solutions and count the cells whose membrane has pulled away from the wall.',
    independent: { label: 'Sucrose concentration', unit: 'mol/dm3', min: 0, max: 1, step: 0.05, defaultValue: 0.35 },
    dependent: { label: 'Plasmolysed cells', unit: '%', decimals: 0 },
    model: (x) => round(100 / (1 + Math.exp(-(x - 0.35) / 0.12)), 0),
    trend: 'Above a threshold concentration, the percentage of plasmolysed cells rises sharply.',
    interpretation:
      'Water leaves the vacuole by osmosis when the external solution has a lower water potential. The membrane shrinks away from the cell wall, but the cell wall keeps its shape.',
    safety: 'Handle slides and cover slips carefully, and wash sucrose solution off the microscope stage.',
  },
  'respiration-in-germinating-seeds': {
    title: 'Carbon dioxide from germinating seeds',
    prompt: 'Record the volume of gas collected as germinating beans respire over time.',
    independent: { label: 'Time', unit: 'min', min: 0, max: 30, step: 2, defaultValue: 12 },
    dependent: { label: 'Carbon dioxide collected', unit: 'cm3', decimals: 1 },
    model: (x) => round(1.6 * x, 1),
    trend: 'Carbon dioxide volume increases steadily while the seeds are actively respiring.',
    interpretation:
      'Germinating seeds respire aerobically, using oxygen and releasing carbon dioxide. The steady increase in gas volume shows the rate of respiration under the test conditions.',
    safety: 'Potassium hydroxide is corrosive. Wear goggles and avoid contact with skin and eyes.',
  },
  'water-of-crystallisation': {
    title: 'Titration of hydrated oxalic acid',
    prompt: 'Titrate a known mass of hydrated oxalic acid with standard sodium hydroxide to find the water of crystallisation.',
    independent: { label: 'Mass of hydrated oxalic acid', unit: 'g', min: 0.5, max: 3, step: 0.1, defaultValue: 1.5 },
    dependent: { label: 'Sodium hydroxide titre', unit: 'cm3', decimals: 1 },
    model: (x) => round(14 * x, 1),
    trend: 'The titre increases in direct proportion to the mass of oxalic acid used.',
    interpretation:
      'The titre gives the amount of acid in the sample. Comparing the moles of acid with the mass of the hydrated solid allows n in H2C2O4.nH2O to be calculated.',
    safety: 'Sodium hydroxide is corrosive and oxalic acid is harmful. Wear goggles and pipette filler.',
  },
  'enthalpy-of-neutralisation': {
    title: 'Temperature rise during neutralisation',
    prompt: 'Add sodium hydroxide to hydrochloric acid and measure the maximum temperature rise.',
    independent: { label: 'Sodium hydroxide volume', unit: 'cm3', min: 0, max: 50, step: 5, defaultValue: 25 },
    dependent: { label: 'Temperature rise', unit: 'C', decimals: 1 },
    model: (x) => round(x <= 25 ? 0.18 * x : 4.5 + 0.02 * (x - 25), 1),
    trend: 'The temperature rises until the acid is neutralised, then changes only slowly with excess base.',
    interpretation:
      'The reaction is exothermic. The maximum temperature rise occurs at the equivalence point, and the heat released can be used with the mole ratio to calculate the enthalpy change.',
    safety: 'Acid and alkali are corrosive. Use a polystyrene cup and goggles, and stir gently to limit heat loss.',
  },
  'redox-titration': {
    title: 'Iron(II) remaining during a redox titration',
    prompt: 'Add potassium manganate(VII) from the burette and track how much iron(II) remains in the flask.',
    independent: { label: 'Permanganate added', unit: 'cm3', min: 0, max: 30, step: 0.5, defaultValue: 12 },
    dependent: { label: 'Iron(II) remaining', unit: '%', decimals: 0 },
    model: (x) => round(Math.max(0, 100 - (x / 24) * 100), 0),
    trend: 'Iron(II) falls steadily and reaches zero at the endpoint near 24 cm3.',
    interpretation:
      'Manganate(VII) oxidises iron(II) to iron(III). The first permanent purple colour marks the endpoint, when all the iron(II) has been used up.',
    safety: 'Potassium manganate(VII) stains and is harmful. Wear goggles and use a pipette filler.',
  },
};

export function getSimulationConfig(experiment: Pick<ExperimentEntry, 'slug' | 'subject' | 'title'>): SimulationConfig {
  const override = overrides[experiment.slug];
  if (override) return override;

  const base = subjectDefaults[experiment.subject];
  return {
    ...base,
    title: `${experiment.title}: active simulation`,
    prompt: `Use the controls to run ${experiment.title.toLowerCase()} and collect evidence.`,
  };
}

export const simulationOverrides = overrides;
