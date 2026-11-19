export type ApparatusCategory =
  | 'Glassware'
  | 'Measuring'
  | 'Heating'
  | 'Separation'
  | 'Observation'
  | 'Handling'
  | 'Electrical'
  | 'Data'
  | 'Sample'
  | 'Chemical'
  | 'Biological';

export type ApparatusVisual =
  | 'beaker'
  | 'blender'
  | 'measuring-cylinder'
  | 'test-tube'
  | 'test-tube-rack'
  | 'conical-flask'
  | 'volumetric-flask'
  | 'burette'
  | 'pipette'
  | 'funnel'
  | 'glass-rod'
  | 'dropper'
  | 'wash-bottle'
  | 'reagent-bottle'
  | 'retort-stand'
  | 'watch-glass'
  | 'evaporating-dish'
  | 'crystallising-dish'
  | 'white-tile'
  | 'mortar-pestle'
  | 'balance'
  | 'thermometer'
  | 'stopwatch'
  | 'ruler'
  | 'vernier-callipers'
  | 'bunsen-burner'
  | 'tripod-gauze'
  | 'water-bath'
  | 'calorimeter'
  | 'vacuum-flask'
  | 'lamp'
  | 'screen'
  | 'cheesecloth'
  | 'filter-paper'
  | 'chromatography-paper'
  | 'capillary-tube'
  | 'sieve'
  | 'eureka-can'
  | 'microscope'
  | 'glass-slide'
  | 'hand-lens'
  | 'stroboscope'
  | 'ripple-tank'
  | 'forceps'
  | 'scalpel'
  | 'mounted-needle'
  | 'cork-borer'
  | 'spatula'
  | 'weighing-boat'
  | 'syringe'
  | 'delivery-tube'
  | 'thread'
  | 'cotton-wool'
  | 'rubber-bung'
  | 'labels'
  | 'pen'
  | 'calculator'
  | 'potato'
  | 'onion'
  | 'leaf'
  | 'pondweed'
  | 'germinating-seeds'
  | 'potted-plant'
  | 'food-sample'
  | 'soil-sample'
  | 'crop-plot'
  | 'prepared-slide'
  | 'sucrose-solutions'
  | 'iron-nails'
  | 'ticker-timer'
  | 'ticker-tape'
  | 'carbon-disc'
  | 'trolley'
  | 'runway'
  | 'adhesive-tape'
  | 'graph-paper'
  | 'power-supply'
  | 'connecting-wires'
  | 'ammeter'
  | 'voltmeter'
  | 'resistor'
  | 'bulb'
  | 'switch'
  | 'rheostat'
  | 'resistance-wire'
  | 'vibrator'
  | 'slinky'
  | 'rope'
  | 'wooden-block'
  | 'slotted-weights'
  | 'surfaces'
  | 'spring-balance'
  | 'spiral-spring'
  | 'weight-hanger'
  | 'irregular-solid'
  | 'pendulum-bob'
  | 'protractor'
  | 'dry-cell'
  | 'clear-jar'
  | 'rain-gauge'
  | 'record-sheet'
  | 'punnett-square'
  | 'coloured-beads'
  | 'coin'
  | 'dice'
  | 'gamete-container'
  | 'paper-clip'
  | 'watering-can'
  | 'seeds-fertiliser';

export type ApparatusItem = {
  id: string;
  name: string;
  scientificName: string;
  visual: ApparatusVisual;
  category: ApparatusCategory;
  purpose: string;
  usage: string[];
  safety: string[];
  specification: string;
  simulatedResult: string;
  examTip: string;
  accent?: string;
  label?: string;
};

type Extra = Partial<
  Pick<ApparatusItem, 'scientificName' | 'usage' | 'safety' | 'examTip' | 'accent' | 'label'>
>;

function make(
  id: string,
  name: string,
  visual: ApparatusVisual,
  category: ApparatusCategory,
  purpose: string,
  specification: string,
  simulatedResult: string,
  extra: Extra = {}
): ApparatusItem {
  return {
    id,
    name,
    visual,
    category,
    purpose,
    specification,
    simulatedResult,
    scientificName: extra.scientificName ?? name,
    usage:
      extra.usage ?? [
        'Inspect the apparatus for cleanliness, cracks and loose fittings before use.',
        'Set it up on a level, heat-resistant bench mat in the order shown in the procedure.',
        'Read the scale at eye level and record the observation with its unit.',
      ],
    safety:
      extra.safety ?? [
        'Handle glassware and sharp items carefully; report chips or cracks immediately.',
        'Keep the bench clear and return the apparatus to its correct place after use.',
      ],
    examTip: extra.examTip ?? 'State the apparatus, the reading and its unit when writing your practical report.',
    accent: extra.accent,
    label: extra.label,
  };
}

function reagent(
  id: string,
  name: string,
  label: string,
  accent: string,
  purpose: string,
  simulatedResult: string,
  safety = 'Wear eye protection and avoid contact with skin, eyes or clothing.'
): ApparatusItem {
  return make(id, name, 'reagent-bottle', 'Chemical', purpose, '50 cm³ reagent bottle with a drop dispenser', simulatedResult, {
    label,
    accent,
    scientificName: name,
    usage: [
      'Read the label and hazard symbol before opening the bottle.',
      `Measure ${name} with a clean measuring cylinder or dropping pipette.`,
      'Replace the cap immediately after dispensing and wipe any drips.',
    ],
    safety: [safety, 'Never return excess reagent to the stock bottle.'],
    examTip: 'Name the reagent, its concentration and the exact volume used in your method.',
  });
}

const apparatusLibrary = {
  'blender': make(
    'blender',
    'Laboratory blender',
    'blender',
    'Handling',
    'Breaks open plant or animal cells to release DNA into solution.',
    '250 W blender with a 1 dm³ sealed jug and pulse control',
    'The sample is homogenised into a smooth, frothy mixture after 15 seconds.',
    {
      scientificName: 'Electric laboratory homogeniser (blender)',
      usage: [
        'Cut the sample into small pieces and place it in the blender jug.',
        'Add the extraction buffer or distilled water, then fit the lid securely.',
        'Blend in short pulses for 10-15 seconds to avoid overheating and excessive foaming.',
      ],
      safety: [
        'Keep hands and utensils out of the jug while the blender is running.',
        'Unplug the blender before opening the lid or cleaning the blades.',
      ],
      examTip: 'Explain that blending physically breaks the cell walls and membranes without destroying the DNA.',
    }
  ),
  'beaker': make(
    'beaker',
    'Glass beaker',
    'beaker',
    'Glassware',
    'Holds, mixes and heats solutions up to about 250 cm³.',
    '250 cm³ borosilicate beaker graduated every 25 cm³',
    'The solution settles with a concave meniscus at the graduation.',
    {
      scientificName: 'Borosilicate glass beaker',
      usage: [
        'Check the beaker for cracks and rinse with distilled water.',
        'Add the solution through the spout to avoid splashing.',
        'Read the approximate volume with the beaker on a level bench.',
      ],
      safety: ['Use tongs or a heat-proof mat when the beaker is hot.', 'Never heat a cracked beaker.'],
    }
  ),
  'measuring-cylinder': make(
    'measuring-cylinder',
    'Measuring cylinder',
    'measuring-cylinder',
    'Measuring',
    'Measures a liquid volume more accurately than a beaker.',
    '100 cm³ measuring cylinder with 1 cm³ graduations',
    'The liquid level reads 50 cm³ at the bottom of the meniscus.',
    {
      usage: [
        'Stand the cylinder on a level bench and pour the liquid slowly.',
        'Bring your eye level with the meniscus before reading.',
        'Read the bottom of the concave meniscus for water-based solutions.',
      ],
      safety: ['Do not use a measuring cylinder for heating or mixing.', 'Rinse and drain it before storing.'],
      examTip: 'Always record the volume to the nearest 1 cm³ and include the unit.',
    }
  ),
  'test-tube': make(
    'test-tube',
    'Test tube',
    'test-tube',
    'Glassware',
    'Holds small volumes for reactions, tests and heating.',
    '150 mm × 16 mm borosilicate test tube',
    'The reagent and sample form a visible layer in the tube.',
    {
      usage: [
        'Add no more than one-third of the tube volume of liquid.',
        'Use a test-tube holder when heating over a Bunsen flame.',
        'Tap the tube gently to mix instead of covering the mouth with your thumb.',
      ],
      safety: ['Point the tube away from yourself and others when heating.', 'Never heat a chipped tube.'],
    }
  ),
  'boiling-tube': make(
    'boiling-tube',
    'Boiling tube',
    'test-tube',
    'Glassware',
    'Holds larger volumes and allows gentle boiling or gas collection.',
    '25 mm × 150 mm borosilicate boiling tube',
    'The larger tube accommodates the reaction without froth escaping.',
    {
      usage: [
        'Clamp the tube gently near the top, not at the heated end.',
        'Heat the liquid gently while moving the tube through the flame.',
        'Fit a bung and delivery tube only when the apparatus is cool enough to handle.',
      ],
      safety: ['Use a heat-proof mat and a test-tube holder or clamp.', 'Add boiling chips to prevent bumping.'],
    }
  ),
  'test-tube-rack': make(
    'test-tube-rack',
    'Test tube rack',
    'test-tube-rack',
    'Handling',
    'Keeps tubes upright, labelled and safely separated.',
    'Wooden rack for six test tubes',
    'The tubes stand vertically with their labels facing the observer.',
    {
      usage: [
        'Label each tube before placing it in the rack.',
        'Keep the rack away from the edge of the bench.',
        'Return each tube to the same position after use.',
      ],
      safety: ['Do not carry a rack of hot tubes by the wooden frame alone.'],
    }
  ),
  'conical-flask': make(
    'conical-flask',
    'Conical flask',
    'conical-flask',
    'Glassware',
    'Holds the titration mixture and allows easy swirling.',
    '250 cm³ Erlenmeyer (conical) flask',
    'The indicator colour changes sharply after the final swirl.',
    {
      usage: [
        'Rinse the flask with distilled water; do not dry it with paper.',
        'Pipette the measured solution into the flask and add the indicator.',
        'Swirl continuously with a circular wrist motion during titration.',
      ],
      safety: ['Do not heat a conical flask unless it is heat-resistant.', 'Keep the flask on a white tile for colour comparison.'],
      examTip: 'Describe the endpoint as a permanent colour change, not just a flash of colour.',
    }
  ),
  'volumetric-flask': make(
    'volumetric-flask',
    'Volumetric flask',
    'volumetric-flask',
    'Measuring',
    'Prepares a standard solution of accurately known concentration.',
    '250 cm³ Class B volumetric flask',
    'The solution is made up exactly to the calibration mark.',
    {
      usage: [
        'Dissolve the weighed solid in a small volume of distilled water first.',
        'Transfer the solution with a funnel and rinse the beaker into the flask.',
        'Add distilled water dropwise until the meniscus touches the mark.',
      ],
      safety: ['Never heat a volumetric flask.', 'Hold the neck, not the bulb, when stoppering and inverting.'],
      examTip: 'State the mass weighed and the final volume when calculating concentration.',
    }
  ),
  'burette': make(
    'burette',
    'Burette',
    'burette',
    'Measuring',
    'Delivers a variable, accurately measured volume during a titration.',
    '50 cm³ burette with 0.1 cm³ graduations and a glass stopcock',
    'The titre is read from the difference between the initial and final readings.',
    {
      usage: [
        'Rinse the burette with a little of the solution, then fill it above the zero mark.',
        'Remove the air bubble by opening the stopcock briefly.',
        'Read the bottom of the meniscus at eye level and record to 0.05 cm³.',
      ],
      safety: ['Clamp the burette vertically and place a white tile under the flask.', 'Close the stopcock when the endpoint is reached.'],
      examTip: 'Record burette readings to two decimal places and calculate the average of concordant titres.',
    }
  ),
  'pipette': make(
    'pipette',
    'Pipette',
    'pipette',
    'Measuring',
    'Delivers one fixed, accurate volume of solution.',
    '25 cm³ bulb pipette',
    'Exactly 25.00 cm³ of solution is delivered into the flask.',
    {
      scientificName: 'Bulb pipette',
      usage: [
        'Rinse the pipette with the solution it will deliver.',
        'Fill it above the mark, then release the liquid to the graduation.',
        'Let the liquid drain freely; touch the tip to the flask wall.',
      ],
      safety: ['Never pipette by mouth.', 'Do not use a pipette with a chipped tip.'],
      examTip: 'A pipette measures one fixed volume; a measuring cylinder measures a range.',
    }
  ),
  'pipette-filler': make(
    'pipette-filler',
    'Pipette filler',
    'pipette',
    'Handling',
    'Draws liquid into a pipette safely without mouth contact.',
    'Rubber three-valve pipette filler',
    'The pipette fills smoothly and is held at the graduation.',
    {
      usage: [
        'Push the filler firmly onto the pipette neck.',
        'Use the top valve to draw liquid, the side valve to release it.',
        'Remove the filler before laying the pipette down.',
      ],
      safety: ['Squeeze the valves gently to avoid drawing liquid into the filler.'],
    }
  ),
  'funnel': make(
    'funnel',
    'Filter funnel',
    'funnel',
    'Separation',
    'Supports filter paper and directs filtrate into a container.',
    '75 mm glass filter funnel',
    'Filtrate passes through the paper while the residue remains on top.',
    {
      usage: [
        'Fold the filter paper and place it in the funnel.',
        'Wet the paper with distilled water so it seals to the funnel.',
        'Keep the funnel stem touching the beaker wall to prevent splashing.',
      ],
      safety: ['Support the funnel in a ring or clamp; do not hold it by hand during filtering.'],
    }
  ),
  'glass-rod': make(
    'glass-rod',
    'Glass stirring rod',
    'glass-rod',
    'Handling',
    'Stirs solutions gently and guides liquid when pouring.',
    '150 mm borosilicate glass rod with rounded ends',
    'The solution mixes without splashing or scratching the beaker.',
    {
      usage: [
        'Stir with a gentle circular motion, keeping the rod in the liquid.',
        'Use the rod to guide the mixture when pouring into a funnel.',
        'Rinse the rod into the receiving vessel to avoid losing solution.',
      ],
      safety: ['Do not use a glass rod to crush solids; it may break.'],
    }
  ),
  'dropper': make(
    'dropper',
    'Dropping pipette',
    'dropper',
    'Measuring',
    'Adds small, controlled drops of reagent.',
    '1 cm³ dropper with a rubber teat',
    'A single drop falls cleanly into the tube.',
    {
      scientificName: 'Dropping pipette',
      usage: [
        'Rinse the dropper with the reagent before use.',
        'Hold the dropper vertically above the tube and squeeze gently.',
        'Keep the dropper tip free of the tube wall.',
      ],
      safety: ['Never touch the tube or bench with the dropper tip.'],
    }
  ),
  'wash-bottle': make(
    'wash-bottle',
    'Wash bottle',
    'wash-bottle',
    'Handling',
    'Dispenses distilled water for rinsing and making up solutions.',
    '500 cm³ squeeze wash bottle containing distilled water',
    'A fine stream of distilled water rinses the apparatus.',
    {
      usage: [
        'Hold the bottle with the delivery tube over the vessel.',
        'Squeeze gently to produce a fine stream of water.',
        'Rinse the walls and the tip of every stirring rod into the vessel.',
      ],
      safety: ['Label the bottle clearly and use only distilled water.'],
    }
  ),
  'reagent-bottle': make(
    'reagent-bottle',
    'Reagent bottle',
    'reagent-bottle',
    'Chemical',
    'Stores a reagent safely and allows controlled dispensing.',
    '50 cm³ amber glass reagent bottle with a drop dispenser',
    'The reagent is dispensed cleanly with no contamination.',
    {
      usage: [
        'Keep the bottle upright and read the label before use.',
        'Dispense only the amount needed into a clean container.',
        'Replace the cap immediately and store the bottle in the correct cabinet.',
      ],
      safety: ['Wear eye protection and never taste or smell a reagent directly.'],
      examTip: 'Record the reagent name and concentration, not just the colour of the bottle.',
    }
  ),
  'retort-stand': make(
    'retort-stand',
    'Retort stand, boss and clamp',
    'retort-stand',
    'Handling',
    'Holds equipment securely above the bench.',
    'Cast-iron base with 60 cm rod, boss head and clamp',
    'The apparatus is held firmly and remains vertical.',
    {
      usage: [
        'Place the base flat and toward the back of the bench.',
        'Attach the boss head and clamp, then tighten both screws.',
        'Clamp glassware gently to avoid crushing or scratching it.',
      ],
      safety: ['Keep the heavy base away from the bench edge.', 'Check that the clamp is tight before letting go.'],
    }
  ),
  'watch-glass': make(
    'watch-glass',
    'Watch glass',
    'watch-glass',
    'Glassware',
    'Covers a beaker or holds a small solid for observation.',
    '75 mm watch glass',
    'The solid or condensate is visible without contamination.',
    {
      usage: [
        'Hold the watch glass by the rim to avoid fingerprints.',
        'Use it to cover a beaker during gentle heating.',
        'Place solids on the curved surface for inspection.',
      ],
      safety: ['Handle with care; thin glass chips easily.'],
    }
  ),
  'evaporating-dish': make(
    'evaporating-dish',
    'Evaporating dish',
    'evaporating-dish',
    'Heating',
    'Evaporates a solvent gently to concentrate a solution.',
    '100 mm porcelain evaporating dish',
    'The solution volume falls and crystals begin to appear at the edge.',
    {
      usage: [
        'Pour the solution to no more than one-third of the dish depth.',
        'Heat gently through a gauze or water bath.',
        'Remove the dish from the heat before it becomes completely dry.',
      ],
      safety: ['Use tongs; the dish stays hot for a long time.', 'Do not evaporate flammable solvents over a naked flame.'],
    }
  ),
  'crystallising-dish': make(
    'crystallising-dish',
    'Crystallising dish',
    'crystallising-dish',
    'Separation',
    'Allows a concentrated solution to cool slowly and form large crystals.',
    '90 mm glass crystallising dish',
    'Well-formed crystals grow on the base and sides overnight.',
    {
      usage: [
        'Pour the warm saturated solution into the dish.',
        'Cover with a watch glass and leave it undisturbed to cool.',
        'Decant the mother liquor before drying the crystals.',
      ],
      safety: ['Do not move the dish while crystals are forming.', 'Use a warm water bath if the solution needs gentle warming.'],
    }
  ),
  'white-tile': make(
    'white-tile',
    'White tile',
    'white-tile',
    'Observation',
    'Provides a white background for judging colour changes.',
    '150 mm white glazed ceramic tile',
    'The colour change and precipitate are seen clearly against white.',
    {
      usage: [
        'Clean and dry the tile before each test.',
        'Place the test tube or filter paper on the tile.',
        'View the colour against the white background in good light.',
      ],
      safety: ['Handle the tile by the edges and report any cracks.'],
    }
  ),
  'mortar-pestle': make(
    'mortar-pestle',
    'Mortar and pestle',
    'mortar-pestle',
    'Handling',
    'Crushes and homogenises plant tissue or solid samples.',
    '150 mm porcelain mortar and pestle',
    'The tissue becomes a smooth paste without excessive foaming.',
    {
      usage: [
        'Cut the sample into small pieces and place them in the mortar.',
        'Press and twist the pestle to grind the tissue against the bowl.',
        'Add a small volume of extraction buffer to keep the sample workable.',
      ],
      safety: ['Grind gently; do not strike the mortar.', 'Wash the mortar immediately after use.'],
    }
  ),
  'balance': make(
    'balance',
    'Electronic balance',
    'balance',
    'Measuring',
    'Measures mass accurately to two decimal places.',
    'Electronic balance with 0.01 g resolution and a draft shield',
    'The display stabilises and shows the mass of the sample.',
    {
      usage: [
        'Switch on the balance and tare it with an empty weighing boat.',
        'Place the sample in the centre of the pan and close the draft shield.',
        'Read the mass when the display is stable.',
      ],
      safety: ['Never place hot or wet samples directly on the pan.', 'Clean any spillage immediately.'],
      examTip: 'Record mass to the balance resolution and include the unit (g).',
    }
  ),
  'thermometer': make(
    'thermometer',
    'Thermometer',
    'thermometer',
    'Measuring',
    'Measures temperature changes during reactions or heating.',
    '−10 to 110 °C laboratory thermometer with 1 °C graduations',
    'The liquid column rises and settles at the new temperature.',
    {
      usage: [
        'Check the liquid column is continuous before use.',
        'Immerse the bulb fully in the liquid without touching the container.',
        'Read the scale at eye level while the bulb remains in the liquid.',
      ],
      safety: ['Do not use a thermometer as a stirrer.', 'Handle mercury-free thermometers carefully.'],
      examTip: 'Read and record the temperature before and after the change, not just the final value.',
    }
  ),
  'stopwatch': make(
    'stopwatch',
    'Stopwatch',
    'stopwatch',
    'Measuring',
    'Measures time intervals for rate and motion experiments.',
    'Digital stopwatch with 0.01 s resolution',
    'The display shows the elapsed time for the trial.',
    {
      usage: [
        'Reset the stopwatch to zero before starting.',
        'Start and stop the watch at the same point in each repeat.',
        'Record the time to the nearest 0.01 s and repeat for accuracy.',
      ],
      safety: ['Keep the stopwatch dry and away from water baths.'],
      examTip: 'Time multiple oscillations or bubbles and divide to reduce reaction-time error.',
    }
  ),
  'ruler': make(
    'ruler',
    'Metre rule',
    'ruler',
    'Measuring',
    'Measures length, distance and extension in centimetres and millimetres.',
    '1 m wooden or steel rule with 1 mm graduations',
    'The length reads accurately with the eye directly above the mark.',
    {
      usage: [
        'Place the rule parallel to the object and align the zero mark.',
        'Read with the eye directly above the scale to avoid parallax.',
        'Record the length to the nearest millimetre.',
      ],
      safety: ['Do not use a ruler as a lever or a stirring rod.'],
      examTip: 'Repeat readings at different positions and take the average.',
    }
  ),
  'vernier-callipers': make(
    'vernier-callipers',
    'Vernier callipers',
    'vernier-callipers',
    'Measuring',
    'Measures internal, external and depth dimensions precisely.',
    'Vernier callipers with 0.1 mm resolution',
    'The main scale and vernier scale give the dimension to 0.1 mm.',
    {
      usage: [
        'Close the jaws and check the zero reading before use.',
        'Grip the object gently between the jaws without compressing it.',
        'Read the main scale and add the vernier coincidence value.',
      ],
      safety: ['Do not force the jaws; they are precision ground.'],
      examTip: 'Record the zero error and subtract it from each reading.',
    }
  ),
  'bunsen-burner': make(
    'bunsen-burner',
    'Bunsen burner',
    'bunsen-burner',
    'Heating',
    'Provides a controllable flame for heating and sterilising.',
    'Bunsen burner with air-hole collar and gas tubing',
    'A blue, non-luminous flame heats the apparatus steadily.',
    {
      usage: [
        'Connect the tubing and check for leaks before lighting.',
        'Light the burner with the air hole closed, then open it for a blue flame.',
        'Heat the apparatus in the hot part of the flame, not the tip.',
      ],
      safety: ['Tie back hair and keep flammable liquids away from the flame.', 'Turn off the gas at the tap after use.'],
    }
  ),
  'tripod-gauze': make(
    'tripod-gauze',
    'Tripod and gauze',
    'tripod-gauze',
    'Heating',
    'Supports a vessel over a Bunsen flame and spreads the heat.',
    'Tripod stand with a 100 mm wire gauze',
    'The vessel heats evenly without direct contact with the flame.',
    {
      usage: [
        'Place the tripod on a heat-proof mat over the burner.',
        'Centre the gauze on the tripod and put the vessel on the gauze.',
        'Leave the apparatus to cool before moving it.',
      ],
      safety: ['Use tongs to move hot apparatus.', 'Check that the gauze is not torn.'],
    }
  ),
  'water-bath': make(
    'water-bath',
    'Water bath',
    'water-bath',
    'Heating',
    'Heats samples gently and keeps them at a steady temperature.',
    '250 cm³ water bath with a thermometer clip',
    'The sample reaches the set temperature without direct flame contact.',
    {
      usage: [
        'Half-fill the bath with water and heat to the required temperature.',
        'Stand the sample tube in the bath and monitor with a thermometer.',
        'Top up with hot water to maintain the temperature.',
      ],
      safety: ['Do not let the bath boil dry.', 'Use tongs to remove hot tubes.'],
    }
  ),
  'calorimeter': make(
    'calorimeter',
    'Polystyrene calorimeter',
    'calorimeter',
    'Heating',
    'Measures heat energy changes while limiting heat loss.',
    'Polystyrene cup with lid and thermometer hole',
    'The temperature rise is recorded with minimal heat loss.',
    {
      usage: [
        'Place the nested cups in a beaker for stability.',
        'Measure the starting temperature of the solution.',
        'Stir gently and record the temperature at fixed intervals.',
      ],
      safety: ['Wear goggles when using acids and alkalis.', 'Do not use the calorimeter for flames or hot solids.'],
      examTip: 'Plot temperature against time and extrapolate to the mixing time.',
    }
  ),
  'vacuum-flask': make(
    'vacuum-flask',
    'Vacuum flask',
    'vacuum-flask',
    'Heating',
    'Conserves heat produced by respiring seeds.',
    '500 cm³ vacuum flask with a rubber stopper and thermometer',
    'The temperature rises slowly and steadily above room temperature.',
    {
      usage: [
        'Place the germinating seeds in the flask and insert the thermometer.',
        'Seal the flask with the stopper and record the starting temperature.',
        'Read the temperature at intervals without opening the flask.',
      ],
      safety: ['Handle the glass liner carefully; it is fragile.', 'Do not over-tighten the stopper.'],
    }
  ),
  'lamp': make(
    'lamp',
    'Bench lamp',
    'lamp',
    'Heating',
    'Provides a controlled light source for photosynthesis experiments.',
    '40 W bench lamp with adjustable arm',
    'The pondweed produces bubbles at a rate that changes with distance.',
    {
      usage: [
        'Place the lamp at a measured distance from the pondweed.',
        'Switch on and allow the filament to warm for one minute.',
        'Keep the lamp fixed while counting bubbles for a set time.',
      ],
      safety: ['Do not touch the hot lamp bulb.', 'Keep water away from the electrical fitting.'],
    }
  ),
  'screen': make(
    'screen',
    'White screen',
    'screen',
    'Observation',
    'Receives light or wave patterns so they can be measured.',
    'A3 white card screen on a stand',
    'The ripple pattern or light image is sharp and easy to measure.',
    {
      usage: [
        'Stand the screen vertically at the same height as the source.',
        'Adjust the distance until the pattern is sharp.',
        'Measure the pattern against the screen with a rule.',
      ],
      safety: ['Keep the screen away from water and flames.'],
    }
  ),
  'cheesecloth': make(
    'cheesecloth',
    'Cheesecloth',
    'cheesecloth',
    'Separation',
    'Filters coarse cell debris while letting the DNA-rich filtrate through.',
    '30 cm square, four-ply cotton cheesecloth',
    'The pulp remains in the cloth and a cloudy filtrate passes through.',
    {
      usage: [
        'Fold the cloth into four layers and place it over a clean beaker.',
        'Pour the homogenate slowly into the centre of the cloth.',
        'Squeeze gently with gloved hands to recover more filtrate.',
      ],
      safety: ['Wear gloves when handling biological material.', 'Wash the cloth or dispose of it as biological waste.'],
    }
  ),
  'filter-paper': make(
    'filter-paper',
    'Filter paper',
    'filter-paper',
    'Separation',
    'Separates a solid residue from a liquid filtrate.',
    '110 mm qualitative filter paper',
    'The solid is trapped on the paper and clear filtrate passes through.',
    {
      usage: [
        'Fold the paper in half, then in half again to form a cone.',
        'Open it into the funnel and wet it with distilled water.',
        'Pour the mixture down a stirring rod into the funnel.',
      ],
      safety: ['Discard the wet paper in the waste bin, not the sink.'],
    }
  ),
  'chromatography-paper': make(
    'chromatography-paper',
    'Chromatography paper',
    'chromatography-paper',
    'Separation',
    'Separates dissolved dyes as the solvent moves up the paper.',
    '20 cm × 2 cm chromatography paper strip',
    'Separate coloured spots appear at different heights on the strip.',
    {
      usage: [
        'Draw a pencil start line 1 cm from the bottom of the strip.',
        'Spot the sample on the line and let it dry completely.',
        'Keep the start line above the solvent surface when running the chromatogram.',
      ],
      safety: ['Use the solvent in a well-ventilated area away from flames.'],
      examTip: 'Measure the distance moved by each spot and by the solvent front.',
    }
  ),
  'capillary-tube': make(
    'capillary-tube',
    'Capillary tube',
    'capillary-tube',
    'Measuring',
    'Applies a very small, concentrated spot of sample to chromatography paper.',
    '10 cm glass capillary tube',
    'A compact, circular sample spot is applied to the start line.',
    {
      usage: [
        'Dip the tube into the sample and touch it lightly to the pencil line.',
        'Let the spot dry and repeat to make it more concentrated.',
        'Handle the strip only by the edges after spotting.',
      ],
      safety: ['Capillary tubes are fragile; dispose of broken pieces safely.'],
    }
  ),
  'sieve': make(
    'sieve',
    'Soil sieve',
    'sieve',
    'Separation',
    'Separates stones and coarse particles from fine soil.',
    '2 mm mesh sieve with a wooden frame',
    'Fine soil passes through and stones remain on the mesh.',
    {
      usage: [
        'Dry the soil sample before sieving.',
        'Shake the sieve gently over a clean tray.',
        'Weigh the fractions to compare particle sizes.',
      ],
      safety: ['Wear a dust mask if the soil is very dry and dusty.'],
    }
  ),
  'eureka-can': make(
    'eureka-can',
    'Displacement can',
    'eureka-can',
    'Measuring',
    'Measures the volume of an irregular solid by water displacement.',
    '500 cm³ displacement can with a side spout',
    'Water equal in volume to the solid flows out of the spout.',
    {
      scientificName: 'Eureka can (displacement can)',
      usage: [
        'Fill the can until water just reaches the spout and let it settle.',
        'Lower the solid slowly on a thread into the water.',
        'Collect the displaced water in a measuring cylinder.',
      ],
      safety: ['Do not drop the solid; splashing loses displaced water.'],
      examTip: 'The volume of displaced water equals the volume of the solid.',
    }
  ),
  'microscope': make(
    'microscope',
    'Compound microscope',
    'microscope',
    'Observation',
    'Magnifies cells and small structures for detailed observation.',
    'Compound light microscope with 4×, 10× and 40× objectives',
    'The specimen is focused and cell structures become visible.',
    {
      usage: [
        'Start on the lowest power and focus with the coarse adjustment.',
        'Centre the specimen, then change to a higher objective.',
        'Use the fine adjustment only on high power.',
      ],
      safety: ['Carry the microscope with both hands.', 'Never use coarse focus on high power.'],
      examTip: 'Record magnification as objective × eyepiece, e.g. 40 × 10 = 400×.',
    }
  ),
  'glass-slide': make(
    'glass-slide',
    'Microscope slide',
    'glass-slide',
    'Observation',
    'Holds the specimen for viewing under a microscope.',
    '76 mm × 26 mm glass slide',
    'The specimen sits in a drop of water beneath a cover slip.',
    {
      usage: [
        'Hold the slide by the edges and place it on a clean surface.',
        'Place the specimen in a drop of water or stain.',
        'Lower the cover slip at an angle to avoid air bubbles.',
      ],
      safety: ['Dispose of broken slides in a sharps container.'],
    }
  ),
  'hand-lens': make(
    'hand-lens',
    'Hand lens',
    'hand-lens',
    'Observation',
    'Magnifies soil, plants and specimens in the field.',
    '10× hand lens with a protective case',
    'Texture and small structures are seen clearly.',
    {
      usage: [
        'Hold the lens close to the eye and move the specimen into focus.',
        'Use daylight or a lamp for the best image.',
        'Keep the lens clean with a soft cloth.',
      ],
      safety: ['Do not leave the lens in direct sunlight; it can start a fire.'],
    }
  ),
  'stroboscope': make(
    'stroboscope',
    'Stroboscope',
    'stroboscope',
    'Observation',
    'Makes a moving wave pattern appear stationary for measurement.',
    'Adjustable stroboscope with a slotted disc',
    'The wave appears frozen, allowing wavelength measurement.',
    {
      usage: [
        'Adjust the flash rate until the pattern appears stationary.',
        'Record the stroboscope frequency.',
        'Measure the wavelength from the frozen pattern.',
      ],
      safety: ['Do not look directly at the stroboscope lamp for long periods.'],
    }
  ),
  'ripple-tank': make(
    'ripple-tank',
    'Ripple tank',
    'ripple-tank',
    'Observation',
    'Generates water waves for studying reflection, refraction and interference.',
    'Ripple tank with glass base, lamp and screen',
    'Bright and dark wave bands are projected onto the screen.',
    {
      usage: [
        'Fill the tank to a depth of about 5 mm and let the water settle.',
        'Switch on the vibrator and adjust the frequency.',
        'Measure wavelength from the projected pattern.',
      ],
      safety: ['Keep electrical parts dry and switch off before emptying the tank.'],
    }
  ),
  'forceps': make(
    'forceps',
    'Forceps',
    'forceps',
    'Handling',
    'Picks up small or delicate specimens without contamination.',
    '150 mm stainless steel forceps',
    'The specimen is transferred without crushing or touching it.',
    {
      usage: [
        'Hold the forceps near the middle and squeeze gently.',
        'Pick up the specimen by an edge, not the centre.',
        'Clean the tips with alcohol before and after use.',
      ],
      safety: ['Point the tips away from yourself and others.'],
    }
  ),
  'scalpel': make(
    'scalpel',
    'Scalpel',
    'scalpel',
    'Handling',
    'Cuts thin sections of tissue or trims specimens.',
    'Stainless steel scalpel with a size 10 blade',
    'A clean, thin section is cut without crushing the tissue.',
    {
      usage: [
        'Cut on a clean white tile or cutting mat.',
        'Draw the blade across the tissue in one smooth movement.',
        'Replace the blade cover immediately after use.',
      ],
      safety: ['Cut away from your body and keep your fingers behind the blade.', 'Dispose of used blades in a sharps container.'],
    }
  ),
  'mounted-needle': make(
    'mounted-needle',
    'Mounted needle',
    'mounted-needle',
    'Handling',
    'Positions specimens and lowers cover slips on microscope slides.',
    'Mounted needle with a wooden handle',
    'The cover slip is lowered evenly without trapping air.',
    {
      usage: [
        'Hold the handle like a pencil and keep the tip low.',
        'Use the tip to tease out the specimen.',
        'Lower the cover slip slowly from one edge.',
      ],
      safety: ['Keep the needle point covered when not in use.'],
    }
  ),
  'cork-borer': make(
    'cork-borer',
    'Cork borer',
    'cork-borer',
    'Handling',
    'Cuts cylindrical samples of potato or other soft tissue.',
    'Stainless steel cork borer set, 10 mm diameter',
    'A uniform cylinder of tissue is cut with clean edges.',
    {
      usage: [
        'Press the borer vertically into the tissue with a steady twist.',
        'Push the cylinder out with the supplied rod.',
        'Cut the cylinder to equal lengths with a scalpel.',
      ],
      safety: ['Keep fingers away from the cutting edge.', 'Cut on a stable board, not in your hand.'],
      examTip: 'Use the same borer diameter and length for every sample to control surface area.',
    }
  ),
  'spatula': make(
    'spatula',
    'Spatula',
    'spatula',
    'Handling',
    'Transfers small amounts of solid chemicals.',
    '150 mm stainless steel spatula',
    'The solid is transferred cleanly into the weighing boat or beaker.',
    {
      usage: [
        'Use a clean, dry spatula for each chemical.',
        'Take only the amount needed from the stock container.',
        'Tap the spatula gently to release the solid.',
      ],
      safety: ['Do not use the same spatula for different chemicals without cleaning.'],
    }
  ),
  'weighing-boat': make(
    'weighing-boat',
    'Weighing boat',
    'weighing-boat',
    'Measuring',
    'Holds a solid sample on the balance and prevents spillage.',
    '80 mm polystyrene weighing boat',
    'The sample sits in the boat and the balance reads its mass.',
    {
      usage: [
        'Place the empty boat on the balance and tare it to zero.',
        'Add the solid with a spatula until the required mass is reached.',
        'Transfer the solid into the reaction vessel and rinse the boat.',
      ],
      safety: ['Do not use a wet or hot weighing boat.'],
    }
  ),
  'syringe': make(
    'syringe',
    'Gas syringe',
    'syringe',
    'Measuring',
    'Collects and measures the volume of gas produced in a reaction.',
    '100 cm³ gas syringe with 1 cm³ graduations',
    'The plunger moves out as gas is collected.',
    {
      usage: [
        'Check that the syringe plunger moves freely before connecting it.',
        'Connect the delivery tube to the syringe nozzle.',
        'Record the gas volume at fixed time intervals.',
      ],
      safety: ['Clamp the syringe so it cannot fall.', 'Do not push the plunger against a blocked tube.'],
    }
  ),
  'delivery-tube': make(
    'delivery-tube',
    'Delivery tube',
    'delivery-tube',
    'Handling',
    'Carries gas from a reaction tube or flask to the collection vessel.',
    'Bendable glass or rubber delivery tube with a bung',
    'Gas bubbles travel steadily through the tube and collect in the receiver.',
    {
      scientificName: 'Gas delivery tube',
      usage: [
        'Fit the bung loosely, then push the delivery tube through until it is secure.',
        'Keep the open end below the surface of the collection liquid.',
        'Remove the delivery tube before stopping heating to prevent suck-back.',
      ],
      safety: [
        'Check the tube for cracks or blockages before use.',
        'Do not touch a hot delivery tube; allow it to cool under a clamp.',
      ],
      examTip: 'A delivery tube must be removed before the heat source is withdrawn to avoid water being sucked back.',
    }
  ),
  'thread': make(
    'thread',
    'Thread',
    'thread',
    'Handling',
    'Suspends solids in water or hangs a pendulum bob.',
    '1 m length of fine cotton or nylon thread',
    'The solid hangs freely without touching the container walls.',
    {
      usage: [
        'Tie the thread securely around the solid.',
        'Lower the solid slowly into the liquid.',
        'Keep the thread clear of the balance or metre rule.',
      ],
      safety: ['Use enough thread to keep your fingers away from the liquid.'],
    }
  ),
  'cotton-wool': make(
    'cotton-wool',
    'Cotton wool',
    'cotton-wool',
    'Handling',
    'Plugs tubes and absorbs moisture or carbon dioxide in setups.',
    'Absorbent cotton wool',
    'The tube is sealed while gases can still diffuse slowly.',
    {
      usage: [
        'Tear off a small plug and push it into the tube mouth.',
        'Do not compress the plug so tightly that gas cannot pass.',
        'Use fresh cotton wool for each experiment.',
      ],
      safety: ['Keep cotton wool away from flames.'],
    }
  ),
  'rubber-bung': make(
    'rubber-bung',
    'Rubber bung',
    'rubber-bung',
    'Handling',
    'Seals a tube or flask and holds a delivery tube.',
    'Size 6 rubber bung with one hole',
    'The apparatus is sealed and gas escapes only through the delivery tube.',
    {
      usage: [
        'Choose a bung that fits the tube neck snugly.',
        'Moisten the bung slightly before inserting it with a twisting motion.',
        'Hold the tube near the neck, not by the bung.',
      ],
      safety: ['Do not force a bung into a cracked tube.'],
    }
  ),
  'labels': make(
    'labels',
    'Labels',
    'labels',
    'Data',
    'Identifies samples, tubes and setups to prevent mix-ups.',
    'Water-resistant laboratory labels',
    'Each sample is clearly identified and traceable.',
    {
      usage: [
        'Write the label in pencil or permanent marker before attaching it.',
        'Include the sample name, concentration and date.',
        'Attach the label to the tube above the liquid level.',
      ],
      safety: ['Do not rely on a label that has become wet and illegible.'],
    }
  ),
  'pen': make(
    'pen',
    'Coloured ink pen',
    'pen',
    'Sample',
    'Provides the dye mixture used in paper chromatography.',
    'Water-soluble coloured felt-tip pen',
    'The ink separates into its component dyes on the paper.',
    {
      usage: [
        'Draw a small spot on the pencil start line.',
        'Let the spot dry completely before running the solvent.',
        'Use a fresh pen for each colour to avoid contamination.',
      ],
      safety: ['Do not ingest ink or draw on your skin.'],
    }
  ),
  'calculator': make(
    'calculator',
    'Calculator',
    'calculator',
    'Data',
    'Performs the calculations needed for ratios, moles and gradients.',
    'Scientific calculator',
    'The calculated value is displayed with the correct units.',
    {
      usage: [
        'Write down the values before entering them.',
        'Use brackets to keep the order of operations correct.',
        'Round only at the final answer.',
      ],
      safety: ['Keep the calculator away from water and chemical spills.'],
    }
  ),
  'potato': make(
    'potato',
    'Fresh potato',
    'potato',
    'Biological',
    'Provides living plant tissue for osmosis and enzyme experiments.',
    'Fresh, firm potato tuber',
    'The potato strip changes length or mass in the sucrose solution.',
    {
      usage: [
        'Cut uniform strips or cylinders with a cork borer.',
        'Blot the strips dry before measuring mass.',
        'Use the same potato and size for every trial.',
      ],
      safety: ['Wash hands after handling raw potato.', 'Do not eat laboratory samples.'],
    }
  ),
  'onion': make(
    'onion',
    'Onion bulb',
    'onion',
    'Biological',
    'Provides a thin epidermal layer for microscopy and plasmolysis.',
    'Fresh white or red onion bulb',
    'The epidermal cells are visible and respond to the sucrose solution.',
    {
      usage: [
        'Cut a small piece of onion and peel a thin epidermal layer.',
        'Mount the layer in water or stain on a slide.',
        'View under low power before changing the solution.',
      ],
      safety: ['The onion may irritate eyes; rinse with water if needed.'],
    }
  ),
  'leaf': make(
    'leaf',
    'Destarched leaf',
    'leaf',
    'Biological',
    'Shows whether starch was made in the presence of light.',
    'Fresh leaf from a plant kept in light or darkness',
    'The iodine-stained leaf shows blue-black where starch is present.',
    {
      usage: [
        'Boil the leaf in water to kill the tissue.',
        'Heat it in ethanol in a water bath to remove chlorophyll.',
        'Rinse and add iodine solution on a white tile.',
      ],
      safety: ['Heat ethanol only in a water bath, never over a naked flame.'],
    }
  ),
  'pondweed': make(
    'pondweed',
    'Pondweed',
    'pondweed',
    'Biological',
    'Releases oxygen bubbles during photosynthesis for counting.',
    'Fresh Elodea or Ceratophyllum sprig',
    'Bubbles rise steadily from the cut stem when light is present.',
    {
      usage: [
        'Cut the stem cleanly and place it in sodium hydrogencarbonate solution.',
        'Keep the cut end upward so bubbles are easy to count.',
        'Count bubbles for a fixed time at each light distance.',
      ],
      safety: ['Handle the pondweed gently to avoid damaging the stem.'],
    }
  ),
  'germinating-seeds': make(
    'germinating-seeds',
    'Germinating bean seeds',
    'germinating-seeds',
    'Biological',
    'Provide actively respiring tissue for carbon dioxide and heat production.',
    'Freshly germinated bean seeds (48–72 h)',
    'The live seeds produce carbon dioxide and a small temperature rise.',
    {
      usage: [
        'Soak the seeds and keep them moist until the radicle appears.',
        'Divide into live and boiled control sets.',
        'Seal each set in the respirometer setup immediately.',
      ],
      safety: ['Boil the control seeds and cool them before sealing the flask.'],
    }
  ),
  'potted-plant': make(
    'potted-plant',
    'Potted plant',
    'potted-plant',
    'Biological',
    'Supplies leaves for starch and photosynthesis investigations.',
    'Healthy potted plant kept in the dark for 48 hours',
    'The destarched plant allows a fair test of light and starch production.',
    {
      usage: [
        'Keep the plant in the dark for 48 hours to destarch the leaves.',
        'Cover part of a leaf if you need a light/dark comparison.',
        'Pick leaves with forceps and test them immediately.',
      ],
      safety: ['Water the plant before the dark period to reduce stress.'],
    }
  ),
  'food-sample': make(
    'food-sample',
    'Food samples',
    'food-sample',
    'Sample',
    'Provide known nutrients for food tests.',
    'Small samples of bread, egg white, oil and fruit juice',
    'Different samples give different colour changes with the reagents.',
    {
      usage: [
        'Prepare small, equal samples and place each in a labelled tube.',
        'Add the same volume of reagent to each sample.',
        'Compare the colour with a control tube.',
      ],
      safety: ['Do not taste any laboratory food sample.'],
    }
  ),
  'soil-sample': make(
    'soil-sample',
    'Soil samples',
    'soil-sample',
    'Sample',
    'Compare texture, drainage and water retention of sand, loam and clay.',
    'Fresh samples of sand, loam and clay soil',
    'The samples settle into different layers and retain different amounts of water.',
    {
      usage: [
        'Label each sample and remove stones and roots.',
        'Measure equal masses of dry soil for each test.',
        'Use the same volume of water for every sample.',
      ],
      safety: ['Wear gloves and wash hands after handling soil.'],
    }
  ),
  'crop-plot': make(
    'crop-plot',
    'Crop plots',
    'crop-plot',
    'Sample',
    'Compare growth and yield under different management practices.',
    'Four equal plots or potted plants with the same crop',
    'Plant height and harvested mass differ between treatments.',
    {
      usage: [
        'Keep plot size, plant spacing and watering the same.',
        'Change only the variable under test, such as fertiliser.',
        'Measure height and harvest mass with the same method.',
      ],
      safety: ['Wash hands after handling soil, fertiliser or crops.'],
    }
  ),
  'prepared-slide': make(
    'prepared-slide',
    'Prepared slide',
    'prepared-slide',
    'Observation',
    'Shows known cells or mitotic stages for microscope study.',
    'Prepared onion root tip slide',
    'Cells at different stages of mitosis are visible.',
    {
      usage: [
        'Place the slide on the stage with the coverslip upward.',
        'Start on low power and locate the root tip cells.',
        'Move to high power only after centring the cells.',
      ],
      safety: ['Handle prepared slides by the edges.'],
    }
  ),
  'sucrose-solutions': make(
    'sucrose-solutions',
    'Sucrose solutions',
    'sucrose-solutions',
    'Sample',
    'Provide a concentration gradient for osmosis experiments.',
    'Labelled sucrose solutions from 0 to 1.0 mol/dm³',
    'The potato or onion cells respond differently to each concentration.',
    {
      usage: [
        'Label each tube with its concentration before use.',
        'Use the same volume of solution in every tube.',
        'Measure the starting and final mass or length of each sample.',
      ],
      safety: ['Label clearly and do not confuse the concentrations.'],
    }
  ),
  'iron-nails': make(
    'iron-nails',
    'Iron nails',
    'iron-nails',
    'Sample',
    'Provide iron for investigating the conditions needed for rusting.',
    'Four clean, grease-free iron nails',
    'The nails in air and water develop orange-brown rust.',
    {
      usage: [
        'Clean the nails with sandpaper and degrease them.',
        'Place one nail in each labelled tube.',
        'Check for rust at the same time each day.',
      ],
      safety: ['Handle sharp nails carefully and dispose of them safely.'],
    }
  ),
  'ticker-timer': make(
    'ticker-timer',
    'Ticker-tape timer',
    'ticker-timer',
    'Measuring',
    'Marks regular time intervals on tape attached to a moving trolley.',
    '50 Hz ticker-tape timer with carbon disc',
    'A row of dots is printed at 0.02 s intervals on the tape.',
    {
      usage: [
        'Thread the tape through the timer and attach it to the trolley.',
        'Switch on the timer and release the trolley.',
        'Measure the distance between successive dots to find speed.',
      ],
      safety: ['Keep fingers clear of the vibrating arm.'],
    }
  ),
  'ticker-tape': make(
    'ticker-tape',
    'Ticker tape',
    'ticker-tape',
    'Measuring',
    'Records the motion of a trolley as a series of dots.',
    '15 mm paper ticker tape, 1 m long',
    'The spacing between dots increases as the trolley accelerates.',
    {
      usage: [
        'Attach one end of the tape to the trolley.',
        'Keep the tape straight and free of twists.',
        'Mark every fifth dot to simplify the analysis.',
      ],
      safety: ['Do not pull the tape through the timer by force.'],
    }
  ),
  'carbon-disc': make(
    'carbon-disc',
    'Carbon disc',
    'carbon-disc',
    'Measuring',
    'Transfers carbon marks onto the ticker tape.',
    'Carbon paper disc for a 50 Hz ticker timer',
    'A clear dot is printed each time the timer arm strikes.',
    {
      usage: [
        'Place the carbon disc under the timer arm.',
        'Check that the disc is clean and not torn.',
        'Replace the disc if the dots become faint.',
      ],
      safety: ['Avoid touching the carbon surface with wet fingers.'],
    }
  ),
  'trolley': make(
    'trolley',
    'Trolley',
    'trolley',
    'Measuring',
    'Moves along a runway so its motion can be recorded.',
    'Low-friction laboratory trolley with four wheels',
    'The trolley accelerates down the runway and the tape records its motion.',
    {
      usage: [
        'Check that all four wheels turn freely.',
        'Attach the ticker tape to the rear of the trolley.',
        'Release the trolley from the same point each time.',
      ],
      safety: ['Catch the trolley at the bottom of the runway.'],
    }
  ),
  'runway': make(
    'runway',
    'Runway',
    'runway',
    'Measuring',
    'Provides a straight, slightly inclined track for motion experiments.',
    '1.5 m wooden runway with adjustable support',
    'The trolley moves with a steady acceleration down the slope.',
    {
      usage: [
        'Set the runway horizontally, then raise one end slightly.',
        'Check that the trolley runs straight without rubbing the sides.',
        'Mark the release point and the finish point.',
      ],
      safety: ['Clamp the runway support securely.'],
    }
  ),
  'adhesive-tape': make(
    'adhesive-tape',
    'Adhesive tape',
    'adhesive-tape',
    'Handling',
    'Attaches ticker tape, paper or labels to apparatus.',
    'Roll of low-tack laboratory tape',
    'The tape holds the paper securely without tearing it.',
    {
      usage: [
        'Tear off a short length and press it firmly into place.',
        'Avoid taping over moving parts or electrical contacts.',
        'Remove the tape slowly to avoid tearing the paper.',
      ],
      safety: ['Keep tape away from hot apparatus.'],
    }
  ),
  'graph-paper': make(
    'graph-paper',
    'Graph paper',
    'graph-paper',
    'Data',
    'Used to plot results and determine gradients or intercepts.',
    'A4 graph paper with 1 mm squares',
    'A straight-line graph shows the relationship between the variables.',
    {
      usage: [
        'Label each axis with the quantity and unit.',
        'Choose a scale that uses at least half the graph paper.',
        'Plot points with a sharp pencil and draw a best-fit line.',
      ],
      safety: ['Keep paper away from water and flames.'],
      examTip: 'Use a large triangle when calculating a gradient.',
    }
  ),
  'power-supply': make(
    'power-supply',
    'Low-voltage power supply',
    'power-supply',
    'Electrical',
    'Provides a safe, adjustable direct current for circuits.',
    '0–12 V DC power supply with current limit',
    'The meter shows a steady voltage and the circuit operates safely.',
    {
      usage: [
        'Set the voltage to zero before switching on.',
        'Connect the positive and negative terminals correctly.',
        'Increase the voltage slowly and watch the ammeter.',
      ],
      safety: ['Switch off before changing connections.', 'Do not exceed the rated current.'],
    }
  ),
  'connecting-wires': make(
    'connecting-wires',
    'Connecting wires',
    'connecting-wires',
    'Electrical',
    'Join circuit components and carry current.',
    'Four insulated copper leads with 4 mm plugs',
    'The circuit is complete and current flows through the load.',
    {
      usage: [
        'Check that the insulation is not cracked.',
        'Push the plugs firmly into the terminals.',
        'Keep the leads tidy and avoid crossing them over hot apparatus.',
      ],
      safety: ['Switch off the supply before connecting or disconnecting wires.'],
    }
  ),
  'ammeter': make(
    'ammeter',
    'Ammeter',
    'ammeter',
    'Electrical',
    'Measures the current flowing through a circuit.',
    '0–1 A and 0–5 A dual-range ammeter',
    'The needle gives a steady current reading in amperes.',
    {
      usage: [
        'Connect the ammeter in series with the component.',
        'Select the largest range first, then reduce it if safe.',
        'Read the scale with the eye directly above the needle.',
      ],
      safety: ['Never connect an ammeter across a battery; it has very low resistance.'],
      examTip: 'An ammeter is always in series; a voltmeter is always in parallel.',
    }
  ),
  'voltmeter': make(
    'voltmeter',
    'Voltmeter',
    'voltmeter',
    'Electrical',
    'Measures the potential difference across a component.',
    '0–3 V and 0–15 V dual-range voltmeter',
    'The needle gives the terminal potential difference in volts.',
    {
      usage: [
        'Connect the voltmeter in parallel with the component.',
        'Select a range above the expected voltage.',
        'Read the scale with the eye directly above the needle.',
      ],
      safety: ['Check the polarity before switching on.'],
    }
  ),
  'resistor': make(
    'resistor',
    'Resistor',
    'resistor',
    'Electrical',
    'Limits current and provides a known resistance in a circuit.',
    '10 Ω, 2 W carbon film resistor with colour bands',
    'The current falls when the resistor is added to the circuit.',
    {
      usage: [
        'Read the colour bands to identify the resistance.',
        'Connect the resistor in series with the component.',
        'Keep the resistor clear of heat-sensitive materials.',
      ],
      safety: ['The resistor may become warm; do not touch it during use.'],
    }
  ),
  'bulb': make(
    'bulb',
    'Lamp bulb',
    'bulb',
    'Electrical',
    'Shows that current is flowing in the circuit.',
    '2.5 V, 0.3 A filament bulb in a holder',
    'The filament glows and its brightness changes with current.',
    {
      usage: [
        'Screw the bulb firmly into the holder.',
        'Connect the holder in series with the circuit.',
        'Observe brightness changes as the resistance changes.',
      ],
      safety: ['Allow the bulb to cool before touching it.'],
    }
  ),
  'switch': make(
    'switch',
    'Switch',
    'switch',
    'Electrical',
    'Opens and closes the circuit safely.',
    'Single-pole laboratory switch',
    'The circuit is completed when the switch is closed.',
    {
      usage: [
        'Connect the switch in series with the circuit.',
        'Open the switch before making any changes.',
        'Check that the contacts are clean and tight.',
      ],
      safety: ['Never use a switch with exposed or loose contacts.'],
    }
  ),
  'rheostat': make(
    'rheostat',
    'Rheostat',
    'rheostat',
    'Electrical',
    'Varies the resistance and controls current in a circuit.',
    '0–20 Ω sliding rheostat',
    'The current changes smoothly as the slider is moved.',
    {
      usage: [
        'Connect the rheostat in series with the circuit.',
        'Start with the maximum resistance before switching on.',
        'Move the slider in small steps and record the readings.',
      ],
      safety: ['Do not touch the resistance wire; it may become hot.'],
    }
  ),
  'resistance-wire': make(
    'resistance-wire',
    'Resistance wire',
    'resistance-wire',
    'Electrical',
    'Provides a measurable length of resistance for electrical experiments.',
    '1 m constantan wire taped to a metre rule',
    'The resistance changes as the length of wire in the circuit changes.',
    {
      usage: [
        'Connect the wire at two points using crocodile clips.',
        'Measure the length of wire between the clips.',
        'Keep the wire straight and avoid kinks.',
      ],
      safety: ['Switch off before moving the clips.'],
    }
  ),
  'vibrator': make(
    'vibrator',
    'Vibrator motor',
    'vibrator',
    'Observation',
    'Produces regular water waves in a ripple tank.',
    'Low-voltage vibrator with a dipping rod',
    'A regular train of circular waves spreads across the tank.',
    {
      usage: [
        'Attach the rod so it just touches the water surface.',
        'Start at a low voltage and increase slowly.',
        'Keep the water depth constant during measurements.',
      ],
      safety: ['Keep electrical connections away from the water.'],
    }
  ),
  'slinky': make(
    'slinky',
    'Slinky spring',
    'slinky',
    'Observation',
    'Demonstrates transverse and longitudinal waves and wave speed.',
    'Metal slinky spring, 1.5 m extended',
    'A pulse travels along the spring and reflects at the end.',
    {
      usage: [
        'Stretch the spring along a smooth floor with a partner holding one end.',
        'Send a single pulse and time its travel over a measured distance.',
        'Do not overstretch the spring.',
      ],
      safety: ['Keep fingers away from the coils and do not let the spring snap back.'],
    }
  ),
  'rope': make(
    'rope',
    'Rope',
    'rope',
    'Observation',
    'Demonstrates wave motion and reflection in a flexible medium.',
    '3 m length of light rope',
    'A wave pulse travels along the rope and reflects at the fixed end.',
    {
      usage: [
        'Tie one end to a fixed point and hold the other end.',
        'Shake the rope steadily to create a transverse wave.',
        'Measure wavelength and frequency for a steady pattern.',
      ],
      safety: ['Keep the rope clear of people and breakable equipment.'],
    }
  ),
  'wooden-block': make(
    'wooden-block',
    'Wooden block',
    'wooden-block',
    'Measuring',
    'Provides a regular solid for density and friction experiments.',
    'Wooden block, 10 cm × 5 cm × 3 cm',
    'The block slides or floats according to its density and the surface.',
    {
      usage: [
        'Measure the dimensions with a rule or vernier callipers.',
        'Weigh the block on a balance to find its mass.',
        'Use the same block for every surface in the friction test.',
      ],
      safety: ['Beware of splinters; sand rough edges.'],
    }
  ),
  'slotted-weights': make(
    'slotted-weights',
    'Slotted weights',
    'slotted-weights',
    'Measuring',
    'Apply known loads in spring and friction experiments.',
    'Set of 10 g, 20 g and 50 g slotted masses',
    'The spring extends by a predictable amount for each added mass.',
    {
      usage: [
        'Add the weights gently and one at a time.',
        'Record the total mass before measuring the extension.',
        'Remove the weights before the spring is overstretched.',
      ],
      safety: ['Do not drop the weights on your feet.'],
    }
  ),
  'surfaces': make(
    'surfaces',
    'Test surfaces',
    'surfaces',
    'Measuring',
    'Compare friction on wood, sandpaper, cloth and glass.',
    'Four equal-sized surface samples',
    'The block slows down more quickly on the rougher surface.',
    {
      usage: [
        'Keep the same block and pulling force for each surface.',
        'Place the surface flat on the bench.',
        'Measure the force needed to start and keep the block moving.',
      ],
      safety: ['Handle glass samples by the edges.'],
    }
  ),
  'spring-balance': make(
    'spring-balance',
    'Spring balance',
    'spring-balance',
    'Measuring',
    'Measures the force needed to move or hold an object.',
    '0–10 N spring balance with 0.1 N graduations',
    'The pointer gives the force in newtons on the scale.',
    {
      usage: [
        'Check the zero reading before hanging the load.',
        'Pull horizontally and read the scale when the block moves steadily.',
        'Record the force to the nearest 0.1 N.',
      ],
      safety: ['Do not exceed the maximum load of the balance.'],
      examTip: 'Friction force is read while the block moves at a steady speed.',
    }
  ),
  'spiral-spring': make(
    'spiral-spring',
    'Spiral spring',
    'spiral-spring',
    'Measuring',
    'Stretches under load to test Hooke’s law.',
    'Steel spiral spring with a hook and pointer',
    'The extension increases linearly until the elastic limit.',
    {
      usage: [
        'Hang the spring vertically from a clamp.',
        'Record the position of the pointer with no load.',
        'Add masses in equal steps and record each extension.',
      ],
      safety: ['Stop adding masses before the spring is permanently deformed.'],
      examTip: 'Plot load on the y-axis and extension on the x-axis.',
    }
  ),
  'weight-hanger': make(
    'weight-hanger',
    'Weight hanger',
    'weight-hanger',
    'Measuring',
    'Holds slotted weights and applies a steady load to a spring.',
    '50 g weight hanger with a hook',
    'The hanger keeps the weights centred and the spring vertical.',
    {
      usage: [
        'Hang the empty hanger from the spring and record the pointer position.',
        'Add slotted weights one at a time.',
        'Make sure the hanger does not swing.',
      ],
      safety: ['Do not stand under a loaded hanger.'],
    }
  ),
  'pointer': make(
    'pointer',
    'Pointer',
    'mounted-needle',
    'Measuring',
    'Marks the position of the spring on the metre rule.',
    'Thin pointer attached to the weight hanger',
    'The pointer moves down the scale as the spring extends.',
    {
      usage: [
        'Attach the pointer horizontally to the hanger.',
        'Read the position of the pointer against the metre rule.',
        'Take the reading at eye level to avoid parallax.',
      ],
      safety: ['Keep the pointer tip away from your eyes.'],
    }
  ),
  'irregular-solid': make(
    'irregular-solid',
    'Irregular solid',
    'irregular-solid',
    'Sample',
    'Provides a shape whose volume must be found by displacement.',
    'Clean, dry irregular stone or metal piece',
    'The displaced water volume equals the volume of the solid.',
    {
      usage: [
        'Weigh the solid on a balance.',
        'Tie a thread around it and lower it slowly into the displacement can.',
        'Measure the displaced water in a measuring cylinder.',
      ],
      safety: ['Do not drop the solid into the can.'],
    }
  ),
  'pendulum-bob': make(
    'pendulum-bob',
    'Pendulum bob',
    'pendulum-bob',
    'Measuring',
    'Provides a compact mass for simple pendulum experiments.',
    'Small brass pendulum bob with a hook',
    'The bob swings with a steady period for a fixed length.',
    {
      usage: [
        'Tie the bob to a thread and clamp the thread in a split cork.',
        'Displace the bob by about 10° and release it smoothly.',
        'Time 20 complete oscillations and divide by 20.',
      ],
      safety: ['Make sure the bob cannot swing into anyone.'],
    }
  ),
  'protractor': make(
    'protractor',
    'Protractor',
    'protractor',
    'Measuring',
    'Measures the angle of a pendulum or a light ray.',
    '180° protractor with 1° graduations',
    'The angle is read accurately from the scale.',
    {
      usage: [
        'Place the centre of the protractor on the pivot.',
        'Align the baseline with the vertical or the normal.',
        'Read the angle from the correct scale.',
      ],
      safety: ['Handle the protractor carefully; it may chip.'],
    }
  ),
  'dry-cell': make(
    'dry-cell',
    'Dry cell',
    'dry-cell',
    'Electrical',
    'Provides a steady EMF and internal resistance for circuit experiments.',
    '1.5 V size D dry cell in a holder',
    'The terminal voltage falls as the current increases.',
    {
      usage: [
        'Place the cell in the holder with the correct polarity.',
        'Connect the voltmeter across the cell terminals.',
        'Vary the load and record terminal voltage and current.',
      ],
      safety: ['Do not short-circuit the cell.', 'Remove the cell when the experiment is finished.'],
      examTip: 'The intercept of a V–I graph is the EMF and the negative gradient is internal resistance.',
    }
  ),
  'clear-jar': make(
    'clear-jar',
    'Clear jar with lid',
    'clear-jar',
    'Sample',
    'Shows soil layers and settling after shaking with water.',
    '500 cm³ clear glass jar with a screw lid',
    'Sand, silt and clay settle into visible layers.',
    {
      usage: [
        'Half-fill the jar with soil and add water to three-quarters full.',
        'Shake vigorously for one minute.',
        'Leave it to settle and measure the layer depths.',
      ],
      safety: ['Tighten the lid before shaking and hold the jar with both hands.'],
    }
  ),
  'rain-gauge': make(
    'rain-gauge',
    'Rain gauge',
    'rain-gauge',
    'Measuring',
    'Measures rainfall so irrigation can be planned.',
    '1 mm rain gauge with a funnel and collecting cylinder',
    'The cylinder shows the depth of rain collected in millimetres.',
    {
      usage: [
        'Place the gauge in an open area away from buildings and trees.',
        'Read the water level at eye level after each rainfall event.',
        'Empty and reset the gauge after recording.',
      ],
      safety: ['Do not drink the collected rainwater.'],
    }
  ),
  'record-sheet': make(
    'record-sheet',
    'Record sheet',
    'record-sheet',
    'Data',
    'Keeps raw observations organised and traceable.',
    'A4 ruled laboratory record sheet',
    'The results table is complete with headings, units and repeats.',
    {
      usage: [
        'Write the title, date and apparatus list before starting.',
        'Use a ruled table with units in the headings.',
        'Record raw readings first, then calculate averages.',
      ],
      safety: ['Keep the sheet dry and away from flames.'],
    }
  ),
  'punnett-square': make(
    'punnett-square',
    'Punnett square',
    'punnett-square',
    'Data',
    'Predicts the genotypes and phenotypes of offspring.',
    'Printed 2 × 2 Punnett square worksheet',
    'The four boxes show the possible allele combinations.',
    {
      usage: [
        'Write the maternal alleles across the top.',
        'Write the paternal alleles down the side.',
        'Combine the alleles in each box and count the phenotypes.',
      ],
      safety: ['Use a pencil so you can correct mistakes.'],
      examTip: 'Always state the genotype ratio separately from the phenotype ratio.',
    }
  ),
  'coloured-beads': make(
    'coloured-beads',
    'Coloured beads',
    'coloured-beads',
    'Data',
    'Model alleles and random gamete selection.',
    'Two colours of beads, 20 of each colour',
    'The bead combinations produce the expected genotype ratio.',
    {
      usage: [
        'Use one colour for the dominant allele and another for the recessive allele.',
        'Draw two beads at random without looking.',
        'Record the pair and return the beads before the next draw.',
      ],
      safety: ['Do not place beads in your mouth.'],
    }
  ),
  'coin': make(
    'coin',
    'Coin',
    'coin',
    'Data',
    'Models random fertilisation or a 50:50 chance event.',
    'Clean metal coin',
    'Heads and tails approximate a 1:1 ratio over many tosses.',
    {
      usage: [
        'Assign heads to one allele and tails to the other.',
        'Toss the coin and record the result.',
        'Repeat at least 20 times to see the ratio.',
      ],
      safety: ['Do not spin the coin near breakable apparatus.'],
    }
  ),
  'dice': make(
    'dice',
    'Dice',
    'dice',
    'Data',
    'Models random assortment in genetic crosses.',
    'Standard six-sided die',
    'Each face appears with approximately equal probability.',
    {
      usage: [
        'Assign alleles to different faces of the die.',
        'Roll the die and record the outcome.',
        'Repeat many times before comparing the ratio.',
      ],
      safety: ['Roll the die on the bench, not on the floor.'],
    }
  ),
  'gamete-container': make(
    'gamete-container',
    'Gamete containers',
    'gamete-container',
    'Data',
    'Hold the parent allele pools for a modelling activity.',
    'Two small labelled containers',
    'The containers keep the two parent pools separate.',
    {
      usage: [
        'Label one container “mother” and the other “father”.',
        'Place the correct alleles in each container.',
        'Draw one bead from each container without looking.',
      ],
      safety: ['Keep the containers closed when not in use.'],
    }
  ),
  'paper-clip': make(
    'paper-clip',
    'Paper clip',
    'paper-clip',
    'Handling',
    'Holds the chromatography strip upright in the solvent.',
    'Metal paper clip',
    'The strip hangs straight with the start line above the solvent.',
    {
      usage: [
        'Clip the top of the strip to a glass rod or the tube mouth.',
        'Adjust the length so the start line stays above the solvent.',
        'Remove the clip carefully after the run.',
      ],
      safety: ['Do not use a rusty or sharp clip.'],
    }
  ),
  'watering-can': make(
    'watering-can',
    'Watering can',
    'watering-can',
    'Sample',
    'Applies a measured, gentle amount of water to crop plots.',
    '2 L watering can with a fine rose',
    'The same volume of water is delivered to each plot.',
    {
      usage: [
        'Measure the water with a measuring cylinder before filling the can.',
        'Water each plot for the same length of time.',
        'Water at the base of the plants to reduce evaporation.',
      ],
      safety: ['Do not overwater; waterlogged soil damages roots.'],
    }
  ),
  'seeds-fertiliser': make(
    'seeds-fertiliser',
    'Seeds and fertiliser',
    'seeds-fertiliser',
    'Sample',
    'Provides the crop and treatment for a yield comparison.',
    'Certified bean seeds and NPK fertiliser sample',
    'The treated plot shows a measurable difference in growth.',
    {
      usage: [
        'Use the same seed variety and planting depth in every plot.',
        'Weigh the fertiliser accurately for each treatment.',
        'Record the application rate and date.',
      ],
      safety: ['Wear gloves when handling fertiliser and wash hands afterwards.'],
    }
  ),
  'detergent-bottle': reagent(
    'detergent-bottle',
    'Washing-up liquid',
    'Detergent',
    '#fbbf24',
    'Breaks down cell membranes and helps release DNA.',
    'A cloudy froth forms as the detergent lyses the cells.',
    'Avoid contact with eyes; rinse immediately if splashed.'
  ),
  'table-salt': make(
    'table-salt',
    'Table salt',
    'reagent-bottle',
    'Chemical',
    'Helps DNA precipitate by neutralising the phosphate backbone.',
    '5 g sodium chloride (table salt)',
    'The salt dissolves and the DNA later clumps at the ethanol layer.',
    {
      label: 'NaCl',
      accent: '#f8fafc',
      scientificName: 'Sodium chloride',
      usage: [
        'Weigh 5 g of salt and add it to the extraction mixture.',
        'Stir gently until the salt dissolves.',
        'Do not add more salt than the recipe requires.',
      ],
      safety: ['Do not taste laboratory chemicals.'],
    }
  ),
  'ethanol-bottle': reagent(
    'ethanol-bottle',
    'Ice-cold ethanol',
    'Ethanol',
    '#bae6fd',
    'Precipitates DNA at the interface because DNA is insoluble in alcohol.',
    'A white, stringy precipitate forms at the ethanol–filtrate boundary.',
    'Ethanol is flammable; keep it away from flames and work in a ventilated area.'
  ),
  'iodine-bottle': reagent(
    'iodine-bottle',
    'Iodine solution',
    'Iodine',
    '#b45309',
    'Tests for starch; starch turns blue-black with iodine.',
    'A blue-black colour appears where starch is present.',
    'Iodine stains skin and clothing; wear eye protection.'
  ),
  'benedicts-bottle': reagent(
    'benedicts-bottle',
    "Benedict's solution",
    'Benedict',
    '#2563eb',
    'Tests for reducing sugars after heating in a water bath.',
    'A brick-red precipitate forms in the presence of a reducing sugar.',
    'Benedict’s solution contains copper(II) ions; avoid ingestion.'
  ),
  'biuret-bottle': reagent(
    'biuret-bottle',
    'Biuret reagent',
    'Biuret',
    '#7c3aed',
    'Tests for proteins; the solution turns purple.',
    'A violet colour shows that protein is present.',
    'Biuret reagent is alkaline; avoid skin and eye contact.'
  ),
  'stain-bottle': reagent(
    'stain-bottle',
    'Acetocarmine stain',
    'Stain',
    '#dc2626',
    'Stains chromosomes so mitotic stages are easier to see.',
    'The chromosomes appear as dark red bodies inside the cells.',
    'Stains can stain skin and clothing; handle with care.'
  ),
  'sodium-bicarbonate': reagent(
    'sodium-bicarbonate',
    'Sodium hydrogencarbonate',
    'NaHCO3',
    '#f8fafc',
    'Supplies dissolved carbon dioxide for photosynthesis.',
    'The pondweed produces oxygen bubbles steadily in the solution.',
    'Avoid inhaling the powder; use a clean spatula.'
  ),
  'hydrogen-peroxide-bottle': reagent(
    'hydrogen-peroxide-bottle',
    'Hydrogen peroxide',
    'H2O2',
    '#a16207',
    'Supplies the substrate that catalase breaks down into water and oxygen.',
    'Oxygen bubbles are released rapidly when catalase is added.',
    'Hydrogen peroxide is an oxidiser; wear goggles and avoid skin contact.'
  ),
  'acid-bottle': reagent(
    'acid-bottle',
    'Dilute hydrochloric acid',
    'HCl',
    '#fca5a5',
    'Provides the acid for neutralisation, titration and rate experiments.',
    'The acid reacts steadily and the indicator or pH changes.',
    'Acids are corrosive; add acid to water, never water to acid.'
  ),
  'sodium-hydroxide': reagent(
    'sodium-hydroxide',
    'Sodium hydroxide solution',
    'NaOH',
    '#cbd5e1',
    'Provides the alkali for neutralisation and titration.',
    'The indicator changes colour at the endpoint.',
    'Sodium hydroxide is corrosive; rinse splashes with plenty of water.'
  ),
  'indicator-bottle': reagent(
    'indicator-bottle',
    'Acid–base indicator',
    'Indicator',
    '#f472b6',
    'Shows the endpoint of an acid–base titration by changing colour.',
    'A permanent pale pink colour marks the endpoint.',
    'Indicators are dilute solutions but still avoid contact with eyes.'
  ),
  'magnesium-ribbon': make(
    'magnesium-ribbon',
    'Magnesium ribbon',
    'reagent-bottle',
    'Chemical',
    'Reacts with acid to release hydrogen gas at a measurable rate.',
    '15 cm coil of magnesium ribbon, cleaned with emery paper',
    'Bubbles of hydrogen form quickly and the ribbon dissolves.',
    {
      label: 'Mg',
      accent: '#cbd5e1',
      scientificName: 'Magnesium ribbon',
      usage: [
        'Clean the ribbon with emery paper before use.',
        'Cut equal lengths for each trial.',
        'Add the ribbon to the acid and start the stopwatch immediately.',
      ],
      safety: ['Magnesium is flammable; keep it away from flames.'],
    }
  ),
  'marble-chips': make(
    'marble-chips',
    'Marble chips',
    'reagent-bottle',
    'Chemical',
    'React with acid to produce carbon dioxide at a measurable rate.',
    '5 g calcium carbonate chips, 5–10 mm',
    'Carbon dioxide bubbles form and the chips gradually dissolve.',
    {
      label: 'CaCO3',
      accent: '#e2e8f0',
      scientificName: 'Calcium carbonate chips',
      usage: [
        'Weigh equal masses of chips for each trial.',
        'Add the chips to the acid and start the timer.',
        'Measure the gas volume or mass loss at fixed intervals.',
      ],
      safety: ['Do not inhale the dust; handle chips with a spatula.'],
    }
  ),
  'sodium-thiosulphate': reagent(
    'sodium-thiosulphate',
    'Sodium thiosulphate',
    'Na2S2O3',
    '#e2e8f0',
    'Reacts with acid to form a sulphur precipitate used to time reaction rate.',
    'The mixture becomes cloudy and the cross beneath the flask disappears.',
    'Avoid skin contact; the solution may irritate sensitive skin.'
  ),
  'ammonium-nitrate': make(
    'ammonium-nitrate',
    'Ammonium nitrate',
    'reagent-bottle',
    'Chemical',
    'Dissolves endothermically and absorbs heat from the surroundings.',
    '10 g ammonium nitrate crystals',
    'The temperature of the solution falls below room temperature.',
    {
      label: 'NH4NO3',
      accent: '#f8fafc',
      scientificName: 'Ammonium nitrate',
      usage: [
        'Weigh 10 g of ammonium nitrate.',
        'Add it to a measured volume of water in the calorimeter.',
        'Stir gently and record the temperature every 30 seconds.',
      ],
      safety: ['Ammonium nitrate is an oxidiser; keep it away from heat and flames.'],
    }
  ),
  'copper-sulphate': make(
    'copper-sulphate',
    'Copper(II) sulphate',
    'reagent-bottle',
    'Chemical',
    'Forms blue crystals from a saturated solution.',
    '20 g copper(II) sulphate crystals',
    'Deep blue crystals grow as the solution cools.',
    {
      label: 'CuSO4',
      accent: '#2563eb',
      scientificName: 'Copper(II) sulphate pentahydrate',
      usage: [
        'Add the crystals to warm distilled water and stir.',
        'Keep adding until no more dissolves.',
        'Filter and leave the filtrate to cool slowly.',
      ],
      safety: ['Copper salts are harmful if swallowed; wash hands after use.'],
    }
  ),
  'copper-oxide': make(
    'copper-oxide',
    'Copper(II) oxide',
    'reagent-bottle',
    'Chemical',
    'Reacts with acid to form a soluble copper salt.',
    '5 g copper(II) oxide powder',
    'The black solid dissolves and the solution turns blue.',
    {
      label: 'CuO',
      accent: '#0f172a',
      scientificName: 'Copper(II) oxide',
      usage: [
        'Add the oxide in small amounts to warm acid.',
        'Stir until no more solid dissolves.',
        'Filter off the excess oxide while the mixture is warm.',
      ],
      safety: ['Avoid inhaling the powder; wear goggles.'],
    }
  ),
  'distilled-water': make(
    'distilled-water',
    'Distilled water',
    'wash-bottle',
    'Chemical',
    'Rinses apparatus and makes up solutions without added ions.',
    '500 cm³ distilled water',
    'The apparatus is rinsed and the solution is made to volume.',
    {
      label: 'H2O',
      accent: '#e0f2fe',
      scientificName: 'Distilled water',
      usage: [
        'Use distilled water for rinsing glassware and making solutions.',
        'Do not use tap water for standard solutions.',
        'Replace the bottle cap after use.',
      ],
      safety: ['Do not drink laboratory water.'],
    }
  ),
  'tap-water': make(
    'tap-water',
    'Tap water',
    'wash-bottle',
    'Sample',
    'Provides water containing dissolved air and ions for comparison.',
    '500 cm³ tap water',
    'The nail in tap water rusts faster than the nail in boiled water.',
    {
      label: 'Tap H2O',
      accent: '#7dd3fc',
      scientificName: 'Tap water',
      usage: [
        'Fill the labelled tube so the nail is partly covered.',
        'Use the same volume in each tube.',
        'Observe the nail daily for rust.',
      ],
      safety: ['Do not drink laboratory water.'],
    }
  ),
  'boiled-water': make(
    'boiled-water',
    'Boiled (deoxygenated) water',
    'wash-bottle',
    'Sample',
    'Provides water with most dissolved oxygen removed, as a rusting control.',
    '500 cm³ freshly boiled distilled water',
    'The nail in boiled water shows little or no rust.',
    {
      label: 'Boiled H2O',
      accent: '#bae6fd',
      scientificName: 'Deoxygenated water',
      usage: [
        'Boil the water and cool it under a layer of oil to exclude air.',
        'Pour it carefully into the tube without aerating it.',
        'Seal the tube immediately.',
      ],
      safety: ['Handle hot water with care and allow it to cool before pouring.'],
    }
  ),
  'oil-bottle': make(
    'oil-bottle',
    'Oil layer',
    'reagent-bottle',
    'Chemical',
    'Excludes air from boiled water so only water is present.',
    '10 cm³ cooking oil or paraffin',
    'A thin oil layer floats on the water surface and seals it from air.',
    {
      label: 'Oil',
      accent: '#facc15',
      usage: [
        'Pour a thin layer of oil carefully onto the cooled boiled water.',
        'Keep the tube upright so the layer remains unbroken.',
        'Label the tube so the control can be identified.',
      ],
      safety: ['Keep oil away from flames and clean up spills immediately.'],
    }
  ),
  'calcium-chloride': make(
    'calcium-chloride',
    'Calcium chloride',
    'reagent-bottle',
    'Chemical',
    'Absorbs water vapour to create dry air in a rusting tube.',
    '5 g anhydrous calcium chloride',
    'The drying agent keeps the air in the tube dry.',
    {
      label: 'CaCl2',
      accent: '#f1f5f9',
      scientificName: 'Anhydrous calcium chloride',
      usage: [
        'Place the drying agent in the bottom of the tube.',
        'Keep it separated from the nail with cotton wool.',
        'Seal the tube with a bung.',
      ],
      safety: ['Calcium chloride is an irritant; avoid contact with skin and eyes.'],
    }
  ),
  'solvent-bottle': reagent(
    'solvent-bottle',
    'Chromatography solvent',
    'Solvent',
    '#93c5fd',
    'Carries the dye mixture up the paper during chromatography.',
    'The solvent front rises and the dyes separate into spots.',
    'The solvent is flammable; keep it away from flames and work in a ventilated area.'
  ),
  'oxalic-acid': make(
    'oxalic-acid',
    'Oxalic acid crystals',
    'reagent-bottle',
    'Chemical',
    'Provides the acid whose water of crystallisation is determined by titration.',
    '6.3 g oxalic acid crystals',
    'The standard solution is titrated to a pale pink endpoint.',
    {
      label: 'H2C2O4',
      accent: '#e2e8f0',
      scientificName: 'Oxalic acid dihydrate',
      usage: [
        'Weigh the crystals accurately in a weighing boat.',
        'Dissolve them in distilled water in a beaker.',
        'Transfer to a volumetric flask and make up to the mark.',
      ],
      safety: ['Oxalic acid is toxic; wear gloves and goggles.'],
    }
  ),
  'potassium-manganate': reagent(
    'potassium-manganate',
    'Potassium manganate(VII)',
    'KMnO4',
    '#7e22ce',
    'Oxidises iron(II) ions and acts as its own indicator.',
    'The purple solution decolourises and then turns permanently pink.',
    'Potassium manganate(VII) stains skin and clothing; handle with care.'
  ),
  'iron-sulphate': reagent(
    'iron-sulphate',
    'Iron(II) sulphate solution',
    'FeSO4',
    '#22c55e',
    'Provides iron(II) ions for a redox titration.',
    'The green solution is oxidised to iron(III) by manganate(VII).',
    'Iron(II) sulphate solution oxidises in air; use it fresh.'
  ),
  'sulphuric-acid': reagent(
    'sulphuric-acid',
    'Dilute sulphuric acid',
    'H2SO4',
    '#fca5a5',
    'Acidifies the iron(II) solution so the redox reaction proceeds cleanly.',
    'The acidified solution gives a sharp manganate(VII) endpoint.',
    'Sulphuric acid is corrosive; add acid to water, never water to acid.'
  ),
  'potassium-hydroxide': reagent(
    'potassium-hydroxide',
    'Potassium hydroxide',
    'KOH',
    '#f8fafc',
    'Absorbs carbon dioxide produced by respiring seeds.',
    'The carbon dioxide is removed and the manometer liquid moves.',
    'Potassium hydroxide is corrosive; wear goggles and avoid skin contact.'
  ),
  'limewater-bottle': reagent(
    'limewater-bottle',
    'Limewater',
    'Limewater',
    '#e2e8f0',
    'Tests for carbon dioxide; limewater turns milky.',
    'The limewater becomes cloudy when carbon dioxide bubbles through it.',
    'Limewater is alkaline; avoid contact with eyes.'
  ),
  'sodium-hydroxide-titration': reagent(
    'sodium-hydroxide-titration',
    'Standard sodium hydroxide',
    'NaOH',
    '#cbd5e1',
    'Neutralises the acid during a volumetric titration.',
    'The titre volume is used to calculate the acid concentration.',
    'Sodium hydroxide is corrosive; rinse splashes immediately.'
  ),
  'copper-oxide-excess': make(
    'copper-oxide-excess',
    'Excess copper(II) oxide',
    'reagent-bottle',
    'Chemical',
    'Ensures all the acid reacts and is then filtered off.',
    '10 g copper(II) oxide powder',
    'Some black solid remains undissolved after the acid is neutralised.',
    {
      label: 'CuO',
      accent: '#0f172a',
      scientificName: 'Copper(II) oxide (excess)',
      usage: [
        'Add the oxide in small portions to the warm acid.',
        'Stir after each addition until no more dissolves.',
        'Filter off the excess solid while the solution is warm.',
      ],
      safety: ['Avoid inhaling the powder; wear goggles.'],
    }
  ),
  'water': make(
    'water',
    'Water',
    'wash-bottle',
    'Sample',
    'Adds water for dissolving, diluting and soil tests.',
    '500 cm³ distilled water',
    'The water dissolves the solute or separates the soil layers.',
    {
      label: 'H2O',
      accent: '#e0f2fe',
      scientificName: 'Distilled water',
      usage: [
        'Measure the required volume with a measuring cylinder.',
        'Add the water slowly while stirring.',
        'Use distilled water for quantitative work.',
      ],
      safety: ['Do not drink laboratory water.'],
    }
  ),
  'copper-sulphate-solution': reagent(
    'copper-sulphate-solution',
    'Copper(II) sulphate solution',
    'CuSO4',
    '#2563eb',
    'Provides a coloured solution for crystal growth.',
    'Blue crystals form as the saturated solution cools.',
    'Copper salts are harmful if swallowed; wash hands after use.'
  ),
  'acid-solution': reagent(
    'acid-solution',
    'Dilute acid',
    'Acid',
    '#fca5a5',
    'Reacts with the base or metal to form a salt.',
    'The acid is neutralised and the salt solution is formed.',
    'Acids are corrosive; add acid to water, never water to acid.'
  ),
  'hydrochloric-acid': reagent(
    'hydrochloric-acid',
    'Dilute hydrochloric acid',
    'HCl',
    '#fca5a5',
    'Provides chloride ions for salt preparation and acid for reactions.',
    'The acid reacts with the base and the salt crystallises on cooling.',
    'Hydrochloric acid is corrosive; work in a ventilated area.'
  ),
  'sulphuric-acid-salt': reagent(
    'sulphuric-acid-salt',
    'Dilute sulphuric acid',
    'H2SO4',
    '#fca5a5',
    'Reacts with copper(II) oxide to form copper(II) sulphate.',
    'The blue salt solution is filtered and crystallised.',
    'Sulphuric acid is corrosive; add acid to water, never water to acid.'
  ),
  'sodium-hydroxide-alkali': reagent(
    'sodium-hydroxide-alkali',
    'Sodium hydroxide solution',
    'NaOH',
    '#cbd5e1',
    'Provides the alkali for neutralisation and titration.',
    'The indicator changes colour at the endpoint.',
    'Sodium hydroxide is corrosive; rinse splashes with plenty of water.'
  ),
} satisfies Record<string, ApparatusItem>;

export type ApparatusId = keyof typeof apparatusLibrary;

export const experimentApparatus: Record<string, ApparatusId[]> = {
  'dna-extraction': [
    'mortar-pestle',
    'blender',
    'beaker',
    'measuring-cylinder',
    'glass-rod',
    'detergent-bottle',
    'table-salt',
    'cheesecloth',
    'funnel',
    'ethanol-bottle',
    'test-tube',
    'test-tube-rack',
    'water-bath',
    'pipette',
    'stopwatch',
  ],
  'cell-division': [
    'microscope',
    'prepared-slide',
    'glass-slide',
    'scalpel',
    'forceps',
    'mounted-needle',
    'stain-bottle',
    'dropper',
    'white-tile',
    'ruler',
    'record-sheet',
  ],
  'genetics-simulation': [
    'punnett-square',
    'coloured-beads',
    'coin',
    'dice',
    'gamete-container',
    'record-sheet',
    'calculator',
  ],
  'photosynthesis-lab': [
    'pondweed',
    'beaker',
    'boiling-tube',
    'test-tube-rack',
    'sodium-bicarbonate',
    'lamp',
    'ruler',
    'thermometer',
    'stopwatch',
    'forceps',
  ],
  'microscopy-basics': [
    'microscope',
    'prepared-slide',
    'glass-slide',
    'dropper',
    'mounted-needle',
    'scalpel',
    'forceps',
    'hand-lens',
    'white-tile',
  ],
  'osmosis-in-potato-cells': [
    'potato',
    'cork-borer',
    'scalpel',
    'ruler',
    'balance',
    'sucrose-solutions',
    'beaker',
    'boiling-tube',
    'test-tube-rack',
    'stopwatch',
  ],
  'food-tests-and-nutrition': [
    'food-sample',
    'test-tube',
    'test-tube-rack',
    'iodine-bottle',
    'benedicts-bottle',
    'biuret-bottle',
    'ethanol-bottle',
    'water-bath',
    'dropper',
    'white-tile',
    'mortar-pestle',
  ],
  'enzyme-activity-temperature': [
    'potato',
    'cork-borer',
    'scalpel',
    'ruler',
    'hydrogen-peroxide-bottle',
    'test-tube',
    'test-tube-rack',
    'measuring-cylinder',
    'water-bath',
    'thermometer',
    'stopwatch',
    'syringe',
    'delivery-tube',
  ],
  'testing-leaf-for-starch': [
    'potted-plant',
    'leaf',
    'beaker',
    'boiling-tube',
    'bunsen-burner',
    'tripod-gauze',
    'ethanol-bottle',
    'iodine-bottle',
    'water-bath',
    'white-tile',
    'forceps',
    'dropper',
  ],
  'acid-base-titration': [
    'burette',
    'retort-stand',
    'pipette',
    'pipette-filler',
    'conical-flask',
    'white-tile',
    'funnel',
    'acid-bottle',
    'sodium-hydroxide',
    'indicator-bottle',
    'beaker',
    'measuring-cylinder',
    'wash-bottle',
  ],
  'flame-tests': [
    'bunsen-burner',
    'white-tile',
    'forceps',
    'test-tube-rack',
    'acid-bottle',
  ],
  'reaction-rates': [
    'acid-bottle',
    'magnesium-ribbon',
    'marble-chips',
    'sodium-thiosulphate',
    'conical-flask',
    'measuring-cylinder',
    'stopwatch',
    'thermometer',
    'bunsen-burner',
    'beaker',
    'balance',
  ],
  'thermochemistry': [
    'calorimeter',
    'thermometer',
    'measuring-cylinder',
    'acid-bottle',
    'sodium-hydroxide',
    'ammonium-nitrate',
    'balance',
    'glass-rod',
    'beaker',
    'stopwatch',
  ],
  'crystallization': [
    'copper-sulphate',
    'wash-bottle',
    'beaker',
    'bunsen-burner',
    'tripod-gauze',
    'glass-rod',
    'evaporating-dish',
    'watch-glass',
    'thermometer',
    'filter-paper',
    'funnel',
    'thread',
  ],
  'paper-chromatography': [
    'chromatography-paper',
    'pen',
    'boiling-tube',
    'paper-clip',
    'ruler',
    'solvent-bottle',
    'glass-rod',
    'capillary-tube',
  ],
  'preparing-a-salt': [
    'acid-bottle',
    'copper-oxide',
    'beaker',
    'measuring-cylinder',
    'bunsen-burner',
    'tripod-gauze',
    'glass-rod',
    'funnel',
    'filter-paper',
    'evaporating-dish',
    'crystallising-dish',
    'balance',
    'thermometer',
  ],
  'rusting-of-iron': [
    'iron-nails',
    'boiling-tube',
    'rubber-bung',
    'distilled-water',
    'tap-water',
    'boiled-water',
    'oil-bottle',
    'calcium-chloride',
    'cotton-wool',
    'labels',
  ],
  'velocity-and-acceleration': [
    'ticker-timer',
    'ticker-tape',
    'carbon-disc',
    'trolley',
    'runway',
    'stopwatch',
    'ruler',
    'retort-stand',
    'adhesive-tape',
    'graph-paper',
  ],
  'simple-circuits': [
    'power-supply',
    'connecting-wires',
    'ammeter',
    'voltmeter',
    'resistor',
    'bulb',
    'switch',
    'rheostat',
    'resistance-wire',
    'ruler',
  ],
  'wave-properties': [
    'ripple-tank',
    'vibrator',
    'lamp',
    'screen',
    'ruler',
    'stopwatch',
    'slinky',
    'rope',
    'stroboscope',
  ],
  'friction-and-motion': [
    'wooden-block',
    'slotted-weights',
    'surfaces',
    'spring-balance',
    'ruler',
    'stopwatch',
    'runway',
    'thread',
  ],
  'hookes-law': [
    'spiral-spring',
    'retort-stand',
    'ruler',
    'slotted-weights',
    'weight-hanger',
    'pointer',
    'balance',
    'graph-paper',
  ],
  'density-of-solids': [
    'wooden-block',
    'vernier-callipers',
    'balance',
    'measuring-cylinder',
    'eureka-can',
    'irregular-solid',
    'thread',
    'wash-bottle',
    'ruler',
  ],
  'plasmolysis-in-plant-cells': [
    'onion',
    'microscope',
    'scalpel',
    'forceps',
    'watch-glass',
    'sucrose-solutions',
    'wash-bottle',
    'glass-slide',
    'mounted-needle',
    'hand-lens',
  ],
  'respiration-in-germinating-seeds': [
    'germinating-seeds',
    'vacuum-flask',
    'thermometer',
    'conical-flask',
    'delivery-tube',
    'syringe',
    'potassium-hydroxide',
    'cotton-wool',
    'rubber-bung',
    'limewater-bottle',
    'stopwatch',
  ],
  'water-of-crystallisation': [
    'oxalic-acid',
    'sodium-hydroxide',
    'burette',
    'pipette',
    'pipette-filler',
    'conical-flask',
    'volumetric-flask',
    'indicator-bottle',
    'balance',
    'beaker',
    'white-tile',
    'wash-bottle',
    'retort-stand',
  ],
  'enthalpy-of-neutralisation': [
    'calorimeter',
    'thermometer',
    'measuring-cylinder',
    'acid-bottle',
    'sodium-hydroxide',
    'glass-rod',
    'stopwatch',
    'beaker',
  ],
  'redox-titration': [
    'potassium-manganate',
    'iron-sulphate',
    'sulphuric-acid',
    'burette',
    'pipette',
    'pipette-filler',
    'conical-flask',
    'beaker',
    'white-tile',
    'wash-bottle',
    'retort-stand',
  ],
  'simple-pendulum': [
    'pendulum-bob',
    'thread',
    'retort-stand',
    'rubber-bung',
    'stopwatch',
    'ruler',
    'protractor',
    'balance',
  ],
  'emf-and-internal-resistance': [
    'dry-cell',
    'voltmeter',
    'ammeter',
    'rheostat',
    'resistor',
    'connecting-wires',
    'switch',
  ],
  'soil-texture-test': [
    'soil-sample',
    'clear-jar',
    'wash-bottle',
    'measuring-cylinder',
    'sieve',
    'hand-lens',
    'white-tile',
    'glass-rod',
    'labels',
    'record-sheet',
  ],
  'water-retention': [
    'soil-sample',
    'measuring-cylinder',
    'funnel',
    'filter-paper',
    'beaker',
    'wash-bottle',
    'balance',
    'stopwatch',
    'labels',
  ],
  'irrigation-planning': [
    'record-sheet',
    'graph-paper',
    'rain-gauge',
    'measuring-cylinder',
    'stopwatch',
    'calculator',
    'labels',
  ],
  'crop-yield-analysis': [
    'crop-plot',
    'ruler',
    'balance',
    'record-sheet',
    'labels',
    'seeds-fertiliser',
    'watering-can',
  ],
};

export type CurriculumAlignment = {
  stages: ('S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6')[];
  ncdc: string;
  uneb: string;
  note?: string;
};

export const experimentCurriculum: Record<string, CurriculumAlignment> = {
  'dna-extraction': {
    stages: ['S4', 'S5', 'S6'],
    ncdc: 'S4 Genetics (inheritance); S5 Cell Biology (chemicals of life); S6 Nucleic acids and gene technology.',
    uneb: 'UNEB UCE Biology 553/2 practical skills; UACE Biology practical project work.',
    note: 'Models the cell lysis, filtration and alcohol precipitation steps used in school DNA projects.',
  },
  'cell-division': {
    stages: ['S1', 'S4', 'S5'],
    ncdc: 'S1 Cells; S4 Reproduction; S5 Cell Biology (ultrastructure and tissues).',
    uneb: 'UNEB UCE Biology 553/2 microscope observation and drawing.',
  },
  'genetics-simulation': {
    stages: ['S4', 'S6'],
    ncdc: 'S4 Genetics (inheritance and variation); S6 Mendelian and non-Mendelian inheritance.',
    uneb: 'UNEB UCE Biology 553/2 data handling; UACE Biology genetics questions.',
  },
  'photosynthesis-lab': {
    stages: ['S2', 'S5'],
    ncdc: 'S2 Nutrition in green plants; S5 Nutrition in plants (C3 and C4 photosynthesis).',
    uneb: 'UNEB UCE Biology 553/2 practical on factors affecting photosynthesis.',
  },
  'microscopy-basics': {
    stages: ['S1', 'S5'],
    ncdc: 'S1 Cells; S5 Cell Biology (microscopy).',
    uneb: 'UNEB UCE Biology 553/2 microscope use and biological drawing.',
  },
  'osmosis-in-potato-cells': {
    stages: ['S2', 'S5'],
    ncdc: 'S2 Transport in plants; S5 Homoeostasis and osmoregulation.',
    uneb: 'UNEB UCE Biology 553/2 osmosis practical.',
  },
  'food-tests-and-nutrition': {
    stages: ['S2', 'S5'],
    ncdc: 'S2 Nutrition types and nutrient compounds; S5 Chemicals of life.',
    uneb: 'UNEB UCE Biology 553/2 food tests practical.',
  },
  'enzyme-activity-temperature': {
    stages: ['S3', 'S5'],
    ncdc: 'S3 Respiration; S5 Enzymes and respiration.',
    uneb: 'UNEB UCE Biology 553/2 enzyme activity practical.',
  },
  'testing-leaf-for-starch': {
    stages: ['S2', 'S5'],
    ncdc: 'S2 Nutrition in green plants; S5 Photosynthesis.',
    uneb: 'UNEB UCE Biology 553/2 photosynthesis practical.',
  },
  'acid-base-titration': {
    stages: ['S3', 'S4', 'S5'],
    ncdc: 'S3/S4 Acids, bases and salts; S5 Volumetric analysis.',
    uneb: 'UNEB UCE Chemistry 545/3 practical; UACE Chemistry titration practical.',
  },
  'flame-tests': {
    stages: ['S2', 'S3', 'S4'],
    ncdc: 'S2/S3 Introduction to chemistry; S4 Acids, bases and salts (qualitative analysis).',
    uneb: 'UNEB UCE Chemistry 545/3 practical: identification of metal ions by flame tests.',
    note: 'The nichrome wire must be cleaned in concentrated acid between samples to avoid false colours.',
  },
  'reaction-rates': {
    stages: ['S4', 'S6'],
    ncdc: 'S4 Rates of reaction; S6 Chemical kinetics.',
    uneb: 'UNEB UCE Chemistry 545/3 rates practical.',
  },
  'thermochemistry': {
    stages: ['S3', 'S4', 'S5'],
    ncdc: 'S3/S4 Energy changes; S5 Thermodynamics.',
    uneb: 'UNEB UCE Chemistry 545/3 calorimetry practical.',
  },
  'crystallization': {
    stages: ['S2', 'S3', 'S4'],
    ncdc: 'S2 Separation of mixtures; S3/S4 Acids, bases and salts.',
    uneb: 'UNEB UCE Chemistry 545/3 salt preparation and crystallisation.',
  },
  'paper-chromatography': {
    stages: ['S2', 'S4'],
    ncdc: 'S2 Separation of mixtures; S4 Chromatography.',
    uneb: 'UNEB UCE Chemistry 545/3 separation techniques.',
  },
  'preparing-a-salt': {
    stages: ['S3', 'S4'],
    ncdc: 'S3/S4 Acids, bases and salts (preparation of soluble salts).',
    uneb: 'UNEB UCE Chemistry 545/3 salt preparation practical.',
  },
  'rusting-of-iron': {
    stages: ['S3', 'S4'],
    ncdc: 'S3 Oxidation and reduction; S4 Metals and corrosion.',
    uneb: 'UNEB UCE Chemistry 545/3 experimental design and observation.',
  },
  'velocity-and-acceleration': {
    stages: ['S1', 'S2', 'S5'],
    ncdc: 'S1/S2 Measurement and motion; S5 Linear motion.',
    uneb: 'UNEB UCE Physics 535/3 ticker-tape practical.',
  },
  'simple-circuits': {
    stages: ['S3', 'S4', 'S5'],
    ncdc: 'S3/S4 Electric circuits; S5 Current electricity.',
    uneb: 'UNEB UCE Physics 535/3 circuit practical.',
  },
  'wave-properties': {
    stages: ['S3', 'S4', 'S6'],
    ncdc: 'S3/S4 Waves; S6 Progressive and stationary waves.',
    uneb: 'UNEB UCE Physics 535/3 wave practical.',
  },
  'friction-and-motion': {
    stages: ['S2', 'S3', 'S5'],
    ncdc: 'S2/S3 Forces and friction; S5 Solid friction.',
    uneb: 'UNEB UCE Physics 535/3 force and motion practical.',
  },
  'hookes-law': {
    stages: ['S2', 'S3', 'S5'],
    ncdc: 'S2/S3 Elasticity; S5 Mechanical properties of matter.',
    uneb: 'UNEB UCE Physics 535/3 Hooke’s law practical.',
  },
  'density-of-solids': {
    stages: ['S1', 'S2', 'S5'],
    ncdc: 'S1/S2 Measurement; S5 Measurement and dimensions.',
    uneb: 'UNEB UCE Physics 535/3 density practical.',
  },
  'plasmolysis-in-plant-cells': {
    stages: ['S5'],
    ncdc: 'S5 Transport in plants and osmoregulation (water potential).',
    uneb: 'UACE Biology practical: plasmolysis and water potential.',
  },
  'respiration-in-germinating-seeds': {
    stages: ['S3', 'S5'],
    ncdc: 'S3 Respiration; S5 Respiration and ATP production.',
    uneb: 'UACE Biology practical: respiration in germinating seeds.',
  },
  'water-of-crystallisation': {
    stages: ['S5'],
    ncdc: 'S5 Volumetric analysis and water of crystallisation.',
    uneb: 'UACE Chemistry practical: standard solution and titration.',
  },
  'enthalpy-of-neutralisation': {
    stages: ['S5'],
    ncdc: 'S5 Thermodynamics and enthalpy changes.',
    uneb: 'UACE Chemistry practical: calorimetry.',
  },
  'redox-titration': {
    stages: ['S5'],
    ncdc: 'S5 Redox reactions and volumetric analysis.',
    uneb: 'UACE Chemistry practical: redox titration.',
  },
  'simple-pendulum': {
    stages: ['S5', 'S6'],
    ncdc: 'S5 Measurement; S6 Simple harmonic motion and gravitation.',
    uneb: 'UACE Physics practical: simple pendulum and g.',
  },
  'emf-and-internal-resistance': {
    stages: ['S6'],
    ncdc: 'S6 Current electricity (EMF and internal resistance).',
    uneb: 'UACE Physics practical: EMF and internal resistance.',
  },
  'soil-texture-test': {
    stages: ['S2', 'S5'],
    ncdc: 'S2 Physical and chemical properties of soil.',
    uneb: 'UNEB UCE Agriculture practical: soil texture and structure.',
  },
  'water-retention': {
    stages: ['S2', 'S5'],
    ncdc: 'S2 Soil water retention, drainage and capillarity.',
    uneb: 'UNEB UCE Agriculture practical: soil water retention.',
  },
  'irrigation-planning': {
    stages: ['S3', 'S4'],
    ncdc: 'S3/S4 Soil and water management; irrigation planning.',
    uneb: 'UNEB UCE Agriculture practical: irrigation and water conservation.',
  },
  'crop-yield-analysis': {
    stages: ['S3', 'S4'],
    ncdc: 'S3/S4 Crop production and management.',
    uneb: 'UNEB UCE Agriculture practical: crop yield and treatment comparison.',
  },
};

export const experimentReadings: Record<string, string> = {
  'dna-extraction': 'A white, stringy precipitate forms at the ethanol boundary; DNA can be spooled onto the glass rod.',
  'cell-division': 'Cells at prophase, metaphase, anaphase and telophase are visible; chromosomes are stained dark red.',
  'genetics-simulation': 'The 3:1 phenotype ratio appears in the model cross; genotype ratio is 1 AA : 2 Aa : 1 aa.',
  'photosynthesis-lab': 'Bubble count falls from 32 to 8 per minute as the lamp is moved from 10 cm to 40 cm.',
  'microscopy-basics': 'Onion cells show a cell wall, nucleus and cytoplasm at 100× magnification.',
  'osmosis-in-potato-cells': 'Potato mass increases in distilled water and decreases in 1.0 mol/dm³ sucrose.',
  'food-tests-and-nutrition': 'Bread gives blue-black with iodine; egg white gives violet with biuret; oil gives a white emulsion.',
  'enzyme-activity-temperature': 'Gas production peaks near 35 °C and falls sharply above 60 °C as catalase denatures.',
  'testing-leaf-for-starch': 'The light leaf turns blue-black with iodine; the dark leaf stays brown-yellow.',
  'acid-base-titration': 'Concordant titres: 24.50, 24.45 and 24.50 cm³; mean titre = 24.48 cm³.',
  'flame-tests': 'Sodium burns golden yellow, potassium lilac, lithium crimson and copper blue-green.',
  'reaction-rates': 'The cross disappears faster at higher temperature and higher acid concentration.',
  'thermochemistry': 'The temperature rises by 6.4 °C in the acid–alkali reaction and falls by 3.1 °C in ammonium nitrate.',
  'crystallization': 'Deep blue copper(II) sulphate crystals form as the saturated solution cools.',
  'paper-chromatography': 'The ink separates into three spots; the solvent front moved 7.8 cm in 20 minutes.',
  'preparing-a-salt': 'The blue filtrate yields needle-shaped copper(II) sulphate crystals after slow cooling.',
  'rusting-of-iron': 'The nail in tap water rusts first; the nail in dry air and the oil-sealed nail do not rust.',
  'velocity-and-acceleration': 'Ticker-tape dots widen steadily; acceleration is approximately 1.8 m/s².',
  'simple-circuits': 'Current is 0.24 A and voltage across the resistor is 2.4 V; R = V/I = 10 Ω.',
  'wave-properties': 'Wavelength is 2.4 cm at 12 Hz; wave speed = frequency × wavelength = 0.29 m/s.',
  'friction-and-motion': 'The block needs 2.4 N on sandpaper but only 0.8 N on glass.',
  'hookes-law': 'Extension is proportional to load up to 250 g; the line curves beyond the elastic limit.',
  'density-of-solids': 'The regular block has a density of 0.72 g/cm³; the stone has a density of 2.65 g/cm³.',
  'plasmolysis-in-plant-cells': 'At 0.6 mol/dm³ the cytoplasm pulls away from the cell wall; plasmolysis begins near 0.4 mol/dm³.',
  'respiration-in-germinating-seeds': 'Live seeds cloud limewater and raise the flask temperature by 2.8 °C; boiled seeds do not.',
  'water-of-crystallisation': 'Mean titre = 24.80 cm³; calculation gives n ≈ 2, so the formula is H₂C₂O₄·2H₂O.',
  'enthalpy-of-neutralisation': 'Corrected temperature rise = 6.5 °C; ΔHneutralisation ≈ −54 kJ/mol.',
  'redox-titration': 'The purple manganate(VII) decolourises and a permanent pale pink appears at 24.70 cm³.',
  'simple-pendulum': 'A graph of T² against l gives a gradient of 4.04 s²/m; g = 4π²/gradient ≈ 9.77 m/s².',
  'emf-and-internal-resistance': 'The V–I graph has an intercept of 1.52 V and a gradient of −0.48 Ω.',
  'soil-texture-test': 'Sand settles fastest, clay stays cloudy longest; loam shows intermediate layers.',
  'water-retention': 'Clay retains the most water, sand drains fastest and loam holds a moderate amount.',
  'irrigation-planning': 'A 25 mm irrigation every 4 days matches the crop water requirement and reduces runoff.',
  'crop-yield-analysis': 'The treated plot yields 18% more grain than the untreated control plot.',
};

export { apparatusLibrary };

const apparatusAliasMap: Record<string, ApparatusId> = {
  'sodium-hydroxide-titration': 'sodium-hydroxide',
  'copper-oxide-excess': 'copper-oxide',
  'copper-sulphate-solution': 'copper-sulphate',
  'acid-solution': 'acid-bottle',
  'hydrochloric-acid': 'acid-bottle',
  'sulphuric-acid-salt': 'sulphuric-acid',
  'sodium-hydroxide-alkali': 'sodium-hydroxide',
  'water': 'distilled-water',
};

export function getApparatus(id: string): ApparatusItem | undefined {
  const alias = apparatusAliasMap[id];
  if (alias) {
    return apparatusLibrary[alias];
  }
  return (apparatusLibrary as Record<string, ApparatusItem>)[id];
}
