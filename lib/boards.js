export const BOARDS = {
  board: {
    label: 'Board Exams',
    emoji: '🏫',
    options: [
      {
        id: 'cbse', name: 'CBSE',
        classes: ['6','7','8','9','10','11 (Science)','11 (Commerce)','11 (Arts)','12 (Science)','12 (Commerce)','12 (Arts)'],
        subjects: {
          '6': ['Mathematics','Science','Social Science','English','Hindi'],
          '7': ['Mathematics','Science','Social Science','English','Hindi'],
          '8': ['Mathematics','Science','Social Science','English','Hindi'],
          '9': ['Mathematics','Science','Social Science','English','Hindi'],
          '10': ['Mathematics','Science','Social Science','English','Hindi'],
          '11 (Science)': ['Physics','Chemistry','Mathematics','Biology','English'],
          '11 (Commerce)': ['Accountancy','Business Studies','Economics','Mathematics','English'],
          '11 (Arts)': ['History','Political Science','Geography','Economics','English'],
          '12 (Science)': ['Physics','Chemistry','Mathematics','Biology','English'],
          '12 (Commerce)': ['Accountancy','Business Studies','Economics','Mathematics','English'],
          '12 (Arts)': ['History','Political Science','Geography','Economics','English'],
        }
      },
      {
        id: 'icse', name: 'ICSE',
        classes: ['6','7','8','9','10'],
        subjects: {
          '6': ['Mathematics','Physics','Chemistry','Biology','History','Geography','English'],
          '7': ['Mathematics','Physics','Chemistry','Biology','History','Geography','English'],
          '8': ['Mathematics','Physics','Chemistry','Biology','History','Geography','English'],
          '9': ['Mathematics','Physics','Chemistry','Biology','History','Geography','English'],
          '10': ['Mathematics','Physics','Chemistry','Biology','History','Geography','English'],
        }
      },
      {
        id: 'isc', name: 'ISC (Class 11-12)',
        classes: ['11 (Science)','11 (Commerce)','12 (Science)','12 (Commerce)'],
        subjects: {
          '11 (Science)': ['Physics','Chemistry','Mathematics','Biology','English'],
          '11 (Commerce)': ['Accountancy','Commerce','Economics','Mathematics','English'],
          '12 (Science)': ['Physics','Chemistry','Mathematics','Biology','English'],
          '12 (Commerce)': ['Accountancy','Commerce','Economics','Mathematics','English'],
        }
      },
      {
        id: 'ib', name: 'IB (International Baccalaureate)',
        classes: ['MYP 1','MYP 2','MYP 3','MYP 4','MYP 5','DP Year 1','DP Year 2'],
        subjects: {
          'MYP 1': ['Mathematics','Sciences','Language & Literature','Individuals & Societies'],
          'MYP 2': ['Mathematics','Sciences','Language & Literature','Individuals & Societies'],
          'MYP 3': ['Mathematics','Sciences','Language & Literature','Individuals & Societies'],
          'MYP 4': ['Mathematics','Sciences','Language & Literature','Individuals & Societies','Design'],
          'MYP 5': ['Mathematics','Sciences','Language & Literature','Individuals & Societies','Design'],
          'DP Year 1': ['Mathematics','Physics','Chemistry','Biology','Economics','History','English Literature'],
          'DP Year 2': ['Mathematics','Physics','Chemistry','Biology','Economics','History','English Literature'],
        }
      },
    ]
  },
  entrance: {
    label: 'Entrance Exams',
    emoji: '🎯',
    options: [
      { id: 'jee', name: 'JEE (Main + Advanced)', subjects: ['Physics','Chemistry','Mathematics'] },
      { id: 'neet', name: 'NEET', subjects: ['Physics','Chemistry','Biology'] },
      { id: 'cat', name: 'CAT', subjects: ['Quantitative Aptitude','Verbal Ability & RC','Data Interpretation & LR'] },
      { id: 'gate_cs', name: 'GATE (CS)', subjects: ['Data Structures','Algorithms','OS','DBMS','Computer Networks','Theory of Computation','Engineering Mathematics'] },
      { id: 'gate_ee', name: 'GATE (Electrical)', subjects: ['Electric Circuits','Signals & Systems','Control Systems','Electromagnetic Fields','Power Systems','Engineering Mathematics'] },
      { id: 'clat', name: 'CLAT', subjects: ['English','Current Affairs & GK','Legal Reasoning','Logical Reasoning','Quantitative Techniques'] },
      { id: 'ipmat', name: 'IPMAT', subjects: ['Quantitative Aptitude','Verbal Ability','Logical Reasoning'] },
      { id: 'gmat', name: 'GMAT', subjects: ['Quantitative Reasoning','Verbal Reasoning','Data Insights','Analytical Writing'] },
      { id: 'xat', name: 'XAT', subjects: ['Verbal & Logical Ability','Decision Making','Quantitative Ability','General Knowledge'] },
      { id: 'snap', name: 'SNAP', subjects: ['General English','Analytical & Logical Reasoning','Quantitative Aptitude'] },
      { id: 'nmat', name: 'NMAT', subjects: ['Language Skills','Quantitative Skills','Logical Reasoning'] },
      { id: 'cuet', name: 'CUET', subjects: ['English','Domain Subject','General Test'] },
    ]
  },
  university: {
    label: 'University / Degree',
    emoji: '🎓',
    options: [
      {
        id: 'btech', name: 'B.Tech / B.E.',
        classes: ['1st Year','2nd Year','3rd Year','4th Year'],
        subjects: {
          '1st Year': ['Engineering Mathematics','Engineering Physics','Engineering Chemistry','Basic Electrical Engineering','Programming in C'],
          '2nd Year': ['Data Structures','Object Oriented Programming','Digital Electronics','Discrete Mathematics','Probability & Statistics'],
          '3rd Year': ['Algorithms','Operating Systems','DBMS','Computer Networks','Software Engineering'],
          '4th Year': ['Machine Learning','Compiler Design','Cloud Computing','Distributed Systems','Electives'],
        }
      },
      {
        id: 'bsc', name: 'B.Sc',
        classes: ['1st Year','2nd Year','3rd Year'],
        subjects: {
          '1st Year': ['Mathematics','Physics','Chemistry','Statistics','Computer Science'],
          '2nd Year': ['Mathematics','Physics','Chemistry','Statistics','Computer Science'],
          '3rd Year': ['Advanced Mathematics','Advanced Physics','Advanced Chemistry','Research Methods'],
        }
      },
      {
        id: 'bcom', name: 'B.Com',
        classes: ['1st Year','2nd Year','3rd Year'],
        subjects: {
          '1st Year': ['Financial Accounting','Business Economics','Business Law','Business Communication'],
          '2nd Year': ['Cost Accounting','Income Tax','Corporate Law','Management Accounting'],
          '3rd Year': ['Auditing','Financial Management','Strategic Management','E-Commerce'],
        }
      },
      {
        id: 'bba', name: 'BBA / BMS',
        classes: ['1st Year','2nd Year','3rd Year'],
        subjects: {
          '1st Year': ['Principles of Management','Business Economics','Financial Accounting','Business Communication'],
          '2nd Year': ['Marketing Management','HR Management','Finance Management','Operations Management'],
          '3rd Year': ['Strategic Management','Entrepreneurship','Business Ethics','International Business'],
        }
      },
      {
        id: 'mba', name: 'MBA',
        classes: ['1st Year','2nd Year'],
        subjects: {
          '1st Year': ['Marketing Management','Financial Management','Operations Management','HR Management','Business Statistics'],
          '2nd Year': ['Strategic Management','Entrepreneurship','Business Analytics','Leadership','Specialisation Electives'],
        }
      },
      {
        id: 'ca', name: 'CA (Foundation / Inter / Final)',
        classes: ['Foundation','Intermediate','Final'],
        subjects: {
          'Foundation': ['Accounting','Business Laws','Business Mathematics','Business Economics'],
          'Intermediate': ['Advanced Accounting','Corporate Laws','Taxation','Cost & Management Accounting','Auditing'],
          'Final': ['Financial Reporting','Strategic Financial Management','Advanced Auditing','Direct Tax','Indirect Tax'],
        }
      },
      {
        id: 'llb', name: 'LLB / BA LLB',
        classes: ['1st Year','2nd Year','3rd Year'],
        subjects: {
          '1st Year': ['Law of Contract','Constitutional Law','Law of Torts','Legal Methods'],
          '2nd Year': ['Criminal Law','Family Law','Property Law','Administrative Law'],
          '3rd Year': ['Corporate Law','International Law','Environmental Law','Alternative Dispute Resolution'],
        }
      },
    ]
  }
}