const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');

dotenv.config();

const SUBJECTS = [
  {
    title: 'Data Structures and Algorithms',
    description: 'Core concepts of DSA, Leetcode patterns, and problem-solving techniques for technical interviews.',
  },
  {
    title: 'Operating Systems',
    description: 'Process management, memory management, concurrency, and file systems.',
  },
  {
    title: 'Database Management Systems',
    description: 'SQL, normalization, indexing, transaction management, and NoSQL basics.',
  },
  {
    title: 'Computer Networks',
    description: 'OSI model, TCP/IP, routing protocols, and network security fundamentals.',
  },
  {
    title: 'System Design',
    description: 'Scalability, load balancing, caching, microservices, and high-level architectural patterns.',
  },
  {
    title: 'Web Development',
    description: 'Frontend and Backend frameworks, HTML/CSS, JavaScript, REST APIs, and deployment.',
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Subject.deleteMany();
    console.log('Cleared existing subjects');

    await Subject.insertMany(SUBJECTS);
    console.log('Inserted default subjects');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
