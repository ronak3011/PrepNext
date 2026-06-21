export const SUBJECTS = [
  { id: 'dbms', name: 'DBMS', description: 'Database Management Systems' },
  { id: 'os', name: 'Operating Systems', description: 'Core principles of OS' },
  { id: 'cn', name: 'Computer Networks', description: 'Networking concepts and protocols' },
  { id: 'daa', name: 'DAA', description: 'Design and Analysis of Algorithms' },
  { id: 'webdev', name: 'Web Development', description: 'Modern web tech stack' },
  { id: 'se', name: 'Software Engineering', description: 'Software dev lifecycles' },
]

export const RESOURCE_TYPES = [
  'Notes',
  'PYQs',
  'Cheat Sheets',
  'Important Questions',
  'Assignments',
  'Viva Questions',
]

export const INITIAL_RESOURCES = [
  {
    id: '1',
    title: 'DBMS Normalization Notes',
    subjectId: 'dbms',
    type: 'Notes',
    description: 'Comprehensive notes covering 1NF to BCNF with examples.',
    uploadDate: '2023-10-12',
    downloads: 145,
  },
  {
    id: '2',
    title: 'OS Process Synchronization PYQ',
    subjectId: 'os',
    type: 'PYQs',
    description: 'Previous year questions on semaphores and mutexes from 2020-2023.',
    uploadDate: '2023-11-05',
    downloads: 89,
  },
  {
    id: '3',
    title: 'Computer Networks Topologies Cheat Sheet',
    subjectId: 'cn',
    type: 'Cheat Sheets',
    description: 'Quick revision guide for Star, Ring, Mesh, and Bus topologies.',
    uploadDate: '2023-09-20',
    downloads: 310,
  },
  {
    id: '4',
    title: 'DAA Dynamic Programming Important Questions',
    subjectId: 'daa',
    type: 'Important Questions',
    description: 'Top 20 DP problems frequently asked in exams.',
    uploadDate: '2023-12-01',
    downloads: 215,
  },
  {
    id: '5',
    title: 'React Fundamentals Notes',
    subjectId: 'webdev',
    type: 'Notes',
    description: 'Beginner friendly notes on React hooks and state management.',
    uploadDate: '2024-01-15',
    downloads: 450,
  },
  {
    id: '6',
    title: 'Software Development Life Cycle Models',
    subjectId: 'se',
    type: 'Notes',
    description: 'Detailed comparison of Agile, Waterfall, and Spiral models.',
    uploadDate: '2023-08-10',
    downloads: 120,
  },
]
