// ClaritIQ Syllabus Config
// Structure: board → subject → chapters → topics
// Easily extendable — just add new entries

export const SYLLABUS = {
  CBSE: {
    "Class 10": {
      Mathematics: {
        "Real Numbers": ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrational Numbers", "Decimal Expansions"],
        "Polynomials": ["Zeros of a Polynomial", "Relationship between Zeros and Coefficients", "Division Algorithm"],
        "Linear Equations": ["Graphical Method", "Substitution Method", "Elimination Method", "Cross-Multiplication Method"],
        "Quadratic Equations": ["Standard Form", "Solving by Factorisation", "Completing the Square", "Quadratic Formula", "Nature of Roots"],
        "Arithmetic Progressions": ["General Term", "Sum of n Terms", "Applications"],
        "Triangles": ["Similar Triangles", "Basic Proportionality Theorem", "Pythagoras Theorem", "Criteria for Similarity"],
        "Coordinate Geometry": ["Distance Formula", "Section Formula", "Area of Triangle", "Midpoint Formula"],
        "Trigonometry": ["Trigonometric Ratios", "Trigonometric Identities", "Heights and Distances"],
        "Circles": ["Tangent to a Circle", "Number of Tangents from a Point", "Chord Properties"],
        "Statistics": ["Mean", "Median", "Mode", "Cumulative Frequency"],
        "Probability": ["Classical Definition", "Simple Events", "Complementary Events"],
      },
      Science: {
        "Chemical Reactions": ["Types of Chemical Reactions", "Combination Reaction", "Decomposition Reaction", "Displacement Reaction", "Double Displacement", "Oxidation and Reduction"],
        "Acids Bases and Salts": ["Properties of Acids and Bases", "pH Scale", "Salts and their Properties", "Bleaching Powder", "Baking Soda", "Washing Soda"],
        "Metals and Non-metals": ["Physical Properties", "Chemical Properties", "Reactivity Series", "Ionic Bond Formation", "Extraction of Metals", "Corrosion"],
        "Carbon Compounds": ["Covalent Bond", "Versatile Nature of Carbon", "Homologous Series", "Functional Groups", "Ethanol and Ethanoic Acid", "Soaps and Detergents"],
        "Periodic Classification": ["Early Attempts", "Mendeleev's Table", "Modern Periodic Table", "Trends in Periodic Table"],
        "Life Processes": ["Nutrition", "Respiration", "Transportation", "Excretion"],
        "Control and Coordination": ["Nervous System", "Reflex Action", "Human Brain", "Hormones", "Tropic Movements"],
        "Reproduction": ["Asexual Reproduction", "Sexual Reproduction in Plants", "Human Reproductive System", "Contraception"],
        "Heredity and Evolution": ["Mendel's Laws", "Dominant and Recessive Traits", "Evolution", "Natural Selection", "Human Evolution"],
        "Light": ["Reflection", "Spherical Mirrors", "Refraction", "Lenses", "Human Eye", "Prism and Dispersion"],
        "Electricity": ["Electric Current", "Ohm's Law", "Resistance", "Series and Parallel Circuits", "Electric Power", "Heating Effect"],
        "Magnetic Effects": ["Magnetic Field", "Electromagnet", "Electric Motor", "Electromagnetic Induction", "Electric Generator"],
        "Environment": ["Ecosystem", "Food Chains", "Ozone Layer", "Waste Management"],
      },
      "Social Science": {
        "Resources and Development": ["Types of Resources", "Land Resources", "Soil Types", "Conservation of Resources"],
        "Forest and Wildlife": ["Types of Vegetation", "Wildlife", "Conservation Projects"],
        "Water Resources": ["Freshwater Resources", "Multipurpose River Projects", "Rainwater Harvesting"],
        "Agriculture": ["Types of Farming", "Major Crops", "Food Security", "Green Revolution"],
        "Nationalism in India": ["First World War Impact", "Rowlatt Act", "Non-Cooperation Movement", "Civil Disobedience", "Quit India"],
        "Federalism": ["What is Federalism", "Indian Federal System", "Decentralisation"],
        "Democracy": ["Features of Democracy", "Democratic Rights", "Political Parties"],
        "Money and Credit": ["Barter System", "Money as Medium", "Formal and Informal Credit", "Self Help Groups"],
        "Globalisation": ["Production Across Countries", "Foreign Trade", "Impact of Globalisation"],
      },
    },
    "Class 11": {
      Physics: {
        "Units and Measurements": ["SI Units", "Significant Figures", "Dimensional Analysis", "Errors in Measurement"],
        "Motion in a Straight Line": ["Displacement and Velocity", "Acceleration", "Equations of Motion", "Relative Motion"],
        "Motion in a Plane": ["Vectors", "Projectile Motion", "Circular Motion", "Relative Velocity"],
        "Laws of Motion": ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Friction", "Circular Motion Dynamics"],
        "Work Energy Power": ["Work Done by a Force", "Kinetic Energy", "Potential Energy", "Conservation of Energy", "Power"],
        "System of Particles": ["Centre of Mass", "Linear Momentum", "Angular Momentum", "Torque", "Moment of Inertia"],
        "Gravitation": ["Universal Law of Gravitation", "Gravitational Field", "Escape Velocity", "Orbital Velocity", "Satellites", "Kepler's Laws"],
        "Mechanical Properties of Solids": ["Stress and Strain", "Young's Modulus", "Bulk Modulus", "Shear Modulus"],
        "Mechanical Properties of Fluids": ["Pressure", "Bernoulli's Theorem", "Surface Tension", "Viscosity"],
        "Thermal Properties": ["Temperature Scales", "Thermal Expansion", "Specific Heat", "Latent Heat", "Heat Transfer"],
        "Thermodynamics": ["Zeroth Law", "First Law", "Second Law", "Carnot Engine"],
        "Kinetic Theory": ["Kinetic Theory of Gases", "RMS Speed", "Degrees of Freedom", "Specific Heats of Gases"],
        "Oscillations": ["Simple Harmonic Motion", "Energy in SHM", "Simple Pendulum", "Damped Oscillations"],
        "Waves": ["Wave Motion", "Speed of Sound", "Superposition", "Beats", "Doppler Effect"],
      },
      Chemistry: {
        "Basic Concepts": ["Mole Concept", "Stoichiometry", "Empirical Formula", "Limiting Reagent"],
        "Atomic Structure": ["Bohr's Model", "Quantum Numbers", "Orbitals", "Electronic Configuration"],
        "Periodic Table": ["Periodic Trends", "Atomic Radius", "Ionisation Energy", "Electronegativity"],
        "Chemical Bonding": ["Ionic Bond", "Covalent Bond", "VSEPR Theory", "Hybridisation", "Hydrogen Bond"],
        "States of Matter": ["Ideal Gas Law", "Kinetic Theory", "Liquefaction", "Properties of Liquids"],
        "Thermodynamics": ["Enthalpy", "Entropy", "Gibbs Free Energy", "Hess's Law"],
        "Equilibrium": ["Law of Mass Action", "Le Chatelier's Principle", "Ionic Equilibrium", "pH and Buffers"],
        "Redox Reactions": ["Oxidation State", "Balancing Redox Equations", "Electrochemical Series"],
        "Hydrogen": ["Isotopes of Hydrogen", "Water", "Hydrogen Peroxide"],
        "s-Block Elements": ["Alkali Metals", "Alkaline Earth Metals", "Compounds and Uses"],
        "p-Block Elements (11)": ["Group 13 Elements", "Group 14 Elements", "Allotropes of Carbon"],
        "Organic Chemistry Basics": ["Classification", "IUPAC Nomenclature", "Reaction Mechanisms", "Isomerism"],
        "Hydrocarbons": ["Alkanes", "Alkenes", "Alkynes", "Aromatic Compounds", "Combustion and Reactions"],
      },
      Mathematics: {
        "Sets": ["Types of Sets", "Set Operations", "Venn Diagrams", "Cartesian Product"],
        "Relations and Functions": ["Domain and Range", "Types of Relations", "Types of Functions"],
        "Trigonometry": ["Radian Measure", "Trigonometric Functions", "Identities", "Graphs", "Inverse Trig"],
        "Complex Numbers": ["Algebraic Operations", "Modulus and Argument", "Argand Plane", "Polar Form"],
        "Quadratic Equations": ["Nature of Roots", "Relationship between Roots", "Equations Reducible to Quadratic"],
        "Linear Inequalities": ["Algebraic Solutions", "Graphical Solutions", "System of Inequalities"],
        "Permutations and Combinations": ["Fundamental Principle", "Permutations", "Combinations", "Applications"],
        "Binomial Theorem": ["Expansion", "General Term", "Middle Term", "Properties"],
        "Sequences and Series": ["AP", "GP", "Special Series", "Infinite GP"],
        "Straight Lines": ["Slope", "Equations of Line", "Distance from a Point", "Angle between Lines"],
        "Conic Sections": ["Circle", "Parabola", "Ellipse", "Hyperbola"],
        "Limits and Derivatives": ["Concept of Limit", "Algebra of Limits", "Derivatives", "Rules of Differentiation"],
        "Statistics": ["Measures of Dispersion", "Variance", "Standard Deviation", "Analysis of Frequency Distributions"],
        "Probability": ["Random Experiment", "Classical Definition", "Conditional Probability", "Bayes' Theorem"],
      },
    },
    "Class 12": {
      Physics: {
        "Electric Charges and Fields": ["Coulomb's Law", "Electric Field", "Gauss's Law", "Electric Dipole"],
        "Electrostatic Potential": ["Potential", "Capacitors", "Energy Stored", "Dielectrics"],
        "Current Electricity": ["Ohm's Law", "Kirchhoff's Laws", "Wheatstone Bridge", "Potentiometer"],
        "Moving Charges": ["Magnetic Force", "Biot-Savart Law", "Ampere's Law", "Moving Coil Galvanometer"],
        "Magnetism": ["Magnetism and Matter", "Earth's Magnetism", "Electromagnetic Induction"],
        "Electromagnetic Induction": ["Faraday's Law", "Lenz's Law", "Self and Mutual Inductance", "AC Generator"],
        "Alternating Current": ["AC Circuits", "LC Oscillations", "Resonance", "Power in AC", "Transformers"],
        "EM Waves": ["Electromagnetic Spectrum", "Properties of EM Waves"],
        "Ray Optics": ["Reflection", "Refraction", "Total Internal Reflection", "Lenses", "Microscope", "Telescope"],
        "Wave Optics": ["Huygens Principle", "Interference", "Diffraction", "Polarisation"],
        "Dual Nature of Radiation": ["Photoelectric Effect", "Einstein's Equation", "De Broglie Wavelength"],
        "Atoms": ["Bohr's Model", "Hydrogen Spectrum", "Energy Levels"],
        "Nuclei": ["Nuclear Binding Energy", "Radioactivity", "Nuclear Fission", "Nuclear Fusion"],
        "Semiconductor Electronics": ["p-n Junction", "Diode", "Transistor", "Logic Gates"],
      },
      Chemistry: {
        "Solutions": ["Concentration Terms", "Raoult's Law", "Colligative Properties", "Van't Hoff Factor"],
        "Electrochemistry": ["Galvanic Cells", "Nernst Equation", "Conductance", "Faraday's Laws", "Batteries"],
        "Chemical Kinetics": ["Rate of Reaction", "Integrated Rate Laws", "Arrhenius Equation", "Reaction Mechanism"],
        "Surface Chemistry": ["Adsorption", "Catalysis", "Colloids", "Emulsions"],
        "d and f Block Elements": ["Transition Metals", "Properties", "Important Compounds", "Lanthanides"],
        "Coordination Compounds": ["Werner's Theory", "IUPAC Nomenclature", "Isomerism", "Crystal Field Theory", "Bonding"],
        "Haloalkanes and Haloarenes": ["Preparation", "Properties", "Nucleophilic Substitution", "Elimination"],
        "Alcohols Phenols Ethers": ["Preparation", "Chemical Properties", "Uses"],
        "Aldehydes Ketones Acids": ["Nucleophilic Addition", "Oxidation Reduction", "Condensation", "Carboxylic Acids"],
        "Amines": ["Classification", "Preparation", "Properties", "Diazonium Salts"],
        "Biomolecules": ["Carbohydrates", "Proteins", "Enzymes", "Nucleic Acids", "Vitamins"],
        "Polymers": ["Classification", "Methods of Polymerisation", "Natural and Synthetic Polymers"],
        "Chemistry in Everyday Life": ["Drugs", "Chemicals in Food", "Cleansing Agents"],
      },
      Mathematics: {
        "Relations and Functions": ["Types of Functions", "Composition", "Inverse Functions", "Binary Operations"],
        "Inverse Trigonometry": ["Principal Value", "Properties", "Graphs"],
        "Matrices": ["Types", "Operations", "Transpose", "Symmetric Matrices"],
        "Determinants": ["Properties", "Cofactors", "Inverse of Matrix", "Linear Equations"],
        "Continuity and Differentiability": ["Continuity", "Differentiability", "Chain Rule", "Implicit Differentiation", "Logarithmic Differentiation"],
        "Applications of Derivatives": ["Rate of Change", "Increasing and Decreasing", "Maxima and Minima", "Tangents and Normals"],
        "Integrals": ["Indefinite Integration", "Integration by Parts", "Partial Fractions", "Definite Integrals"],
        "Applications of Integrals": ["Area under Curves", "Area between Curves"],
        "Differential Equations": ["Order and Degree", "Variable Separable", "Homogeneous", "Linear Differential Equations"],
        "Vectors": ["Vector Addition", "Dot Product", "Cross Product", "Scalar Triple Product"],
        "3D Geometry": ["Direction Cosines", "Equation of Line", "Equation of Plane", "Distance Problems"],
        "Linear Programming": ["Formulation", "Graphical Method", "Corner Point Method"],
        "Probability": ["Conditional Probability", "Multiplication Theorem", "Bayes' Theorem", "Random Variables", "Binomial Distribution"],
      },
    },
  },

  JEE: {
    "JEE Main": {
      Physics: {
        "Mechanics": ["Kinematics", "Newton's Laws", "Work Energy Power", "Rotational Motion", "Gravitation", "SHM", "Waves"],
        "Electrostatics": ["Coulomb's Law", "Electric Field and Potential", "Gauss's Law", "Capacitors"],
        "Current Electricity": ["Ohm's Law", "Kirchhoff's Laws", "Wheatstone Bridge", "RC Circuits"],
        "Magnetism": ["Biot-Savart Law", "Ampere's Law", "Magnetic Force", "Electromagnetic Induction"],
        "Optics": ["Ray Optics", "Wave Optics", "Interference", "Diffraction"],
        "Modern Physics": ["Photoelectric Effect", "Atomic Models", "Radioactivity", "Nuclear Physics"],
        "Thermodynamics": ["Laws of Thermodynamics", "Kinetic Theory", "Thermal Properties"],
        "Semiconductor": ["p-n Junction", "Transistor", "Logic Gates"],
      },
      Chemistry: {
        "Physical Chemistry": ["Mole Concept", "Atomic Structure", "Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Electrochemistry", "Kinetics"],
        "Inorganic Chemistry": ["Periodic Table", "p-Block", "d-Block", "Coordination Compounds", "Hydrogen", "s-Block"],
        "Organic Chemistry": ["Basics and Nomenclature", "Hydrocarbons", "Haloalkanes", "Alcohols Phenols Ethers", "Carbonyl Compounds", "Amines", "Biomolecules", "Polymers"],
      },
      Mathematics: {
        "Algebra": ["Complex Numbers", "Quadratic Equations", "Sequences and Series", "Permutations Combinations", "Binomial Theorem", "Matrices Determinants"],
        "Calculus": ["Limits", "Continuity", "Differentiation", "Applications of Derivatives", "Integration", "Definite Integrals", "Differential Equations"],
        "Coordinate Geometry": ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola", "3D Geometry"],
        "Trigonometry": ["Ratios and Identities", "Equations", "Inverse Trigonometry", "Properties of Triangles"],
        "Vectors and Statistics": ["Vector Algebra", "Probability", "Statistics"],
      },
    },
    "JEE Advanced": {
      Physics: {
        "General Physics": ["Dimensional Analysis", "Error Analysis", "Experimental Physics"],
        "Mechanics": ["Projectile", "Circular Motion", "COM and Collisions", "Rotational Dynamics", "Fluid Mechanics", "SHM", "Waves and Sound"],
        "Electricity and Magnetism": ["Electrostatics", "Current Electricity", "Magnetic Effects", "EMI", "AC Circuits"],
        "Optics and Modern": ["Geometrical Optics", "Physical Optics", "Quantum Physics", "Nuclear Physics"],
        "Heat": ["Thermal Expansion", "Calorimetry", "Heat Transfer", "Thermodynamics", "KTG"],
      },
      Chemistry: {
        "Physical": ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Electrochemistry", "Kinetics", "Nuclear Chemistry"],
        "Inorganic": ["Periodic Properties", "s-Block", "p-Block", "d-Block", "f-Block", "Coordination", "Qualitative Analysis"],
        "Organic": ["Structure and Reactivity", "Hydrocarbons", "Functional Groups", "Reaction Mechanisms", "Stereochemistry", "Spectroscopy Basics", "Biomolecules"],
      },
      Mathematics: {
        "Algebra": ["Number Theory", "Complex Numbers", "Quadratics", "P&C", "Binomial", "Matrices"],
        "Calculus": ["Limits and Continuity", "Differentiation", "Rolle's and MVT", "Monotonicity and Extrema", "Indefinite Integration", "Definite Integrals", "Differential Equations"],
        "Geometry": ["2D Geometry", "3D Geometry", "Vectors"],
        "Trigonometry and Misc": ["Trig Identities", "Inverse Trig", "Probability"],
      },
    },
  },

  NEET: {
    "NEET UG": {
      Physics: {
        "Mechanics": ["Physical World", "Units and Measurements", "Kinematics", "Laws of Motion", "Work Energy Power", "System of Particles", "Gravitation"],
        "Properties of Matter": ["Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties", "Thermodynamics", "Kinetic Theory"],
        "Oscillations and Waves": ["Oscillations", "Waves"],
        "Electrostatics": ["Electric Charges", "Electrostatic Potential", "Current Electricity"],
        "Magnetism": ["Moving Charges", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current"],
        "Optics and Modern": ["Ray Optics", "Wave Optics", "Dual Nature", "Atoms and Nuclei", "Semiconductor Electronics"],
      },
      Chemistry: {
        "Physical Chemistry": ["Basic Concepts", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Redox", "Electrochemistry", "Kinetics"],
        "Inorganic Chemistry": ["Periodic Table", "s-Block", "p-Block", "d-Block", "Coordination Compounds"],
        "Organic Chemistry": ["Basic Organic Chemistry", "Hydrocarbons", "Haloalkanes", "Alcohols Phenols Ethers", "Aldehydes Ketones Acids", "Amines", "Biomolecules", "Polymers"],
      },
      Biology: {
        "Diversity of Life": ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"],
        "Structural Organisation": ["Morphology of Plants", "Anatomy of Plants", "Structural Organisation in Animals"],
        "Cell Biology": ["Cell Structure and Function", "Biomolecules", "Cell Cycle and Division"],
        "Plant Physiology": ["Transport in Plants", "Mineral Nutrition", "Photosynthesis", "Respiration", "Plant Growth"],
        "Human Physiology": ["Digestion and Absorption", "Breathing and Gas Exchange", "Body Fluids", "Circulatory System", "Excretion", "Locomotion", "Neural Control", "Chemical Coordination"],
        "Reproduction": ["Reproduction in Plants", "Human Reproduction", "Reproductive Health"],
        "Genetics and Evolution": ["Heredity and Variation", "Molecular Basis of Inheritance", "Evolution"],
        "Biology in Human Welfare": ["Health and Disease", "Microbes", "Biotechnology Principles", "Biotechnology Applications"],
        "Ecology": ["Organisms and Populations", "Ecosystem", "Biodiversity", "Environmental Issues"],
      },
    },
  },

  CAT: {
    "CAT MBA": {
      "Quantitative Aptitude": {
        "Arithmetic": ["Percentages", "Profit Loss and Discount", "Simple and Compound Interest", "Time Speed Distance", "Time and Work", "Ratio and Proportion", "Mixtures and Alligation"],
        "Algebra": ["Linear and Quadratic Equations", "Polynomials", "Functions", "Inequalities", "Progressions and Series"],
        "Geometry": ["Lines and Angles", "Triangles", "Circles", "Quadrilaterals", "Coordinate Geometry", "Mensuration", "Trigonometry"],
        "Number System": ["Divisibility Rules", "HCF and LCM", "Remainders", "Factorials", "Base Systems", "Surds and Indices"],
        "Modern Mathematics": ["Permutation and Combination", "Probability", "Set Theory", "Functions", "Logarithms"],
      },
      "Verbal Ability": {
        "Reading Comprehension": ["Passage Types", "Inference Questions", "Vocabulary in Context", "Author's Tone", "Critical Reasoning"],
        "Verbal Reasoning": ["Para Jumbles", "Para Summary", "Sentence Correction", "Fill in the Blanks", "Odd Sentence Out"],
        "Grammar": ["Tenses", "Subject-Verb Agreement", "Modifiers", "Parallelism", "Pronoun Agreement"],
      },
      "Data Interpretation and LR": {
        "Data Interpretation": ["Bar Charts", "Line Graphs", "Pie Charts", "Tables", "Caselets"],
        "Logical Reasoning": ["Arrangements", "Grouping", "Grid Puzzles", "Blood Relations", "Coding Decoding", "Syllogisms", "Critical Reasoning"],
      },
    },
  },

  GATE: {
    "Computer Science": {
      "Data Structures and Algorithms": {
        "Data Structures": ["Arrays and Strings", "Linked Lists", "Stacks and Queues", "Trees", "Graphs", "Heaps", "Hash Tables"],
        "Algorithms": ["Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms", "Divide and Conquer"],
        "Complexity": ["Time Complexity", "Space Complexity", "P and NP", "Recurrence Relations"],
      },
      "Theory of Computation": {
        "Automata": ["Finite Automata", "NFA and DFA", "Regular Expressions", "Pumping Lemma"],
        "Formal Languages": ["Context Free Grammars", "Pushdown Automata", "Turing Machines", "Decidability"],
      },
      "Computer Organisation": {
        "Digital Logic": ["Boolean Algebra", "Logic Gates", "Combinational Circuits", "Sequential Circuits"],
        "Computer Architecture": ["Instruction Set Architecture", "Pipelining", "Cache Memory", "Virtual Memory", "I/O Systems"],
      },
      "Operating Systems": {
        "Processes": ["Process Management", "CPU Scheduling", "Synchronisation", "Deadlocks"],
        "Memory": ["Memory Management", "Virtual Memory", "Page Replacement Algorithms"],
        "File Systems": ["File Organisation", "Disk Scheduling"],
      },
      "DBMS": {
        "Relational Model": ["ER Diagrams", "Relational Algebra", "SQL", "Normalisation", "Functional Dependencies"],
        "Advanced": ["Transactions", "Concurrency Control", "Indexing and Hashing"],
      },
      "Networking": {
        "Basics": ["OSI Model", "TCP/IP", "Application Layer", "Transport Layer", "Network Layer", "Data Link Layer"],
        "Advanced": ["Routing Algorithms", "Error Detection", "Flow Control"],
      },
      "Discrete Mathematics": {
        "Foundations": ["Set Theory", "Relations", "Functions", "Mathematical Logic", "Propositional Logic", "Predicate Logic"],
        "Combinatorics": ["Counting Principles", "Permutations", "Combinations", "Generating Functions", "Recurrence Relations"],
        "Graph Theory": ["Types of Graphs", "Trees", "Graph Coloring", "Planarity", "Matching"],
      },
    },
  },

  CLAT: {
    "CLAT": {
      "English Language": {
        "Comprehension": ["Reading Comprehension", "Inference Drawing", "Summary Writing", "Vocabulary in Context"],
        "Grammar": ["Grammar Rules", "Error Detection", "Sentence Improvement", "Fill in the Blanks"],
      },
      "Current Affairs and GK": {
        "Current Events": ["National Events", "International Events", "Awards", "Sports", "Persons in News"],
        "Static GK": ["History", "Geography", "Polity", "Economy", "Science and Technology"],
      },
      "Legal Reasoning": {
        "Principles and Facts": ["Applying Legal Principles", "Reading Legal Passages", "Critical Reasoning in Law"],
        "Legal GK": ["Constitutional Law Basics", "Important Judgments", "Legal Terms"],
      },
      "Logical Reasoning": {
        "Analytical Reasoning": ["Arrangements", "Syllogisms", "Analogies", "Series Completion", "Coding Decoding"],
        "Critical Reasoning": ["Assumption Questions", "Argument Analysis", "Cause and Effect", "Inference"],
      },
      "Quantitative Techniques": {
        "Basic Maths": ["Number System", "Percentages", "Profit and Loss", "Simple Interest", "Average", "Ratio and Proportion"],
        "Data Interpretation": ["Tables", "Bar Graphs", "Pie Charts"],
      },
    },
  },
}

// Helper function to get subjects for a board+class
export function getSubjects(board, classYear) {
  return Object.keys(SYLLABUS[board]?.[classYear] || {})
}

// Helper function to get chapters for board+class+subject
export function getChapters(board, classYear, subject) {
  return Object.keys(SYLLABUS[board]?.[classYear]?.[subject] || {})
}

// Helper function to get topics for board+class+subject+chapter
export function getTopics(board, classYear, subject, chapter) {
  return SYLLABUS[board]?.[classYear]?.[subject]?.[chapter] || []
}

// Get class years available for a board
export function getClassYears(board) {
  return Object.keys(SYLLABUS[board] || {})
}

// Get all boards
export function getBoards() {
  return Object.keys(SYLLABUS)
}