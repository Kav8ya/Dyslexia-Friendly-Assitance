import { ExerciseLevel } from '../types';

export const exerciseLevels: ExerciseLevel[] = [
  {
    range: '1-20',
    description: 'Basic Comprehension & Organization',
    exercises: [
      {
        question: 'Read the following news article and summarize it in 2-3 sentences:\n\nThe city council announced plans to renovate the central park next month. The $2 million project will include new playground equipment, improved lighting, and accessible pathways. Local residents have expressed excitement about the upgrades, particularly the addition of a dog park area. The construction is expected to take approximately three months, during which parts of the park will remain open to the public. Community feedback sessions will be held weekly to address any concerns.',
        type: 'text',
        expectedAnswer: 'The city council is planning a $2 million renovation of the central park, including new playground equipment, lighting, and pathways. The project will take three months and include a new dog park area, with weekly community feedback sessions.',
        hints: [
          'Focus on the main points: what, when, and how much',
          'Include the key improvements being made',
          'Mention the timeline and community involvement'
        ]
      },
      {
        question: 'Reorder these sentences to form a logical email sequence:\n1. Finally, attach any relevant documents to your email.\n2. First, open your email client and click "Compose".\n3. Next, write a clear subject line that summarizes your message.\n4. Then, write your message in a professional tone.',
        type: 'email',
        expectedAnswer: '2,3,4,1',
        hints: [
          'Think about the logical order of steps',
          'What would you do first when sending an email?',
          'Consider which actions depend on previous steps'
        ]
      },
      {
        question: 'Fill in the blanks in this workplace dialogue:\n\nManager: "Could you ___ the report by Friday?"\nEmployee: "Yes, I can ___ it done by then."\nManager: "Great, please ___ it to the team when finished."',
        type: 'text',
        expectedAnswer: 'complete, have, send',
        hints: [
          'Think about common workplace verbs',
          'Consider what action would fit with "done"',
          'What do you do with reports when they are finished?'
        ]
      }
    ]
  },
  {
    range: '21-40',
    description: 'Intermediate Analysis & Communication',
    exercises: [
      {
        question: 'Rearrange these sentences to form a coherent paragraph:\n1. The sun was setting behind the mountains.\n2. Birds were returning to their nests.\n3. A cool breeze rustled through the trees.\n4. It was a peaceful evening in the valley.',
        type: 'text',
        expectedAnswer: '4,1,3,2',
        hints: [
          'Look for the opening statement',
          'Consider the natural flow of events',
          'Think about what makes a logical conclusion'
        ]
      },
      {
        question: 'Write a 3-line reply to this coworker\'s request:\n"Hi, could you help me find the quarterly sales report from last month? I need it for my presentation tomorrow."\n\nWrite your response using a professional tone.',
        type: 'email',
        expectedAnswer: 'I\'d be happy to help you find the quarterly sales report. I\'ve located it in the shared drive under "Q3 Reports". I\'m attaching it to this email for your convenience.',
        hints: [
          'Start with a positive acknowledgment',
          'Provide specific information about the location',
          'End with a helpful action'
        ]
      },
      {
        question: 'Match these workplace terms with their definitions:\n1. Deadline\n2. Agenda\n3. Minutes\nA. Written record of a meeting\nB. Date/time when work must be completed\nC. List of topics to be discussed',
        type: 'matching',
        expectedAnswer: '1B,2C,3A',
        hints: [
          'Think about what each term means in a work context',
          'Consider which pairs naturally go together',
          'Use process of elimination'
        ]
      }
    ]
  },
  {
    range: '41-60',
    description: 'Advanced Critical Thinking & Processing',
    exercises: [
      {
        question: 'Compare these two products:\nProduct A: "High-performance laptop, 16GB RAM, 512GB SSD, 15" screen, $1200"\nProduct B: "Professional workstation, 32GB RAM, 1TB SSD, 15" screen, $1800"\n\nList the similarities and differences in a structured format.',
        type: 'visual_organizer',
        expectedAnswer: 'Similarities: 15" screen size, Both are professional computers\nDifferences: RAM (16GB vs 32GB), Storage (512GB vs 1TB), Price ($1200 vs $1800)',
        hints: [
          'Start by identifying common features',
          'Look for numerical differences',
          'Compare specifications systematically'
        ]
      },
      {
        question: 'Edit this paragraph for grammar errors:\nThe team have completed their project last week. Each of the members were responsible for different tasks. The results of the project has exceeded expectations.',
        type: 'proofreading',
        expectedAnswer: 'The team has completed their project last week. Each of the members was responsible for different tasks. The results of the project have exceeded expectations.',
        hints: [
          'Check subject-verb agreement',
          'Look for singular/plural consistency',
          'Consider tense agreement'
        ]
      },
      {
        question: 'Rank these tasks by urgency (1=most urgent):\n- Weekly team meeting\n- Client presentation tomorrow\n- Overdue report\n- Lunch break\n- Responding to CEO email',
        type: 'prioritization',
        expectedAnswer: '1. Overdue report\n2. Client presentation tomorrow\n3. Responding to CEO email\n4. Weekly team meeting\n5. Lunch break',
        hints: [
          'Consider deadlines',
          'Think about impact on business',
          'Evaluate importance of stakeholders'
        ]
      }
    ]
  },
  {
    range: '61-80',
    description: 'Complex Application & Evaluation',
    exercises: [
      {
        question: 'Revise these passive voice sentences into active voice:\n1. "The report was submitted by John."\n2. "The meeting was scheduled by the team."\n3. "The project was completed on time."',
        type: 'writing',
        expectedAnswer: '1. "John submitted the report."\n2. "The team scheduled the meeting."\n3. "We completed the project on time."',
        hints: [
          'Identify who is performing the action',
          'Move the doer to the beginning',
          'Change the verb form'
        ]
      },
      {
        question: 'Identify bias in this advertisement:\n"Only smart parents choose our educational toys. Other toys simply waste your child\'s time. Don\'t you want your child to succeed?"',
        type: 'critical_analysis',
        expectedAnswer: 'The ad uses emotional manipulation, false dichotomy, and implied judgment of parents. It makes unfair claims about other products and uses guilt to pressure parents.',
        hints: [
          'Look for emotional language',
          'Identify absolute statements',
          'Notice pressure tactics'
        ]
      },
      {
        question: 'Translate this technical term for a client:\n"Our cloud-based SaaS platform utilizes microservices architecture for optimal scalability."',
        type: 'simplification',
        expectedAnswer: 'Our online software is built in small, independent parts that make it easy to grow as your business needs change.',
        hints: [
          'Use everyday language',
          'Focus on benefits',
          'Avoid technical jargon'
        ]
      }
    ]
  },
  {
    range: '81-100',
    description: 'Real-World Task Mastery',
    exercises: [
      {
        question: 'Fill out this library membership form:\nName: ___\nAddress: ___\nPhone: ___\nEmail: ___\nPreferred Library Branch: ___\nType of Membership: (Standard/Premium)',
        type: 'form_filling',
        expectedAnswer: 'Name: John Smith\nAddress: 123 Main St, Anytown, ST 12345\nPhone: (555) 123-4567\nEmail: john.smith@email.com\nPreferred Library Branch: Central\nType of Membership: Standard',
        hints: [
          'Use proper formatting for contact details',
          'Include all required information',
          'Follow the specified format'
        ]
      },
      {
        question: 'Write step-by-step instructions for using a microwave to heat a frozen meal:\n',
        type: 'procedural_writing',
        expectedAnswer: '1. Remove meal from freezer\n2. Read package instructions\n3. Pierce film cover or vent corner\n4. Place container in microwave\n5. Set appropriate time and power level\n6. Wait 1-2 minutes after cooking\n7. Carefully remove and check temperature',
        hints: [
          'Start with safety steps',
          'Include preparation steps',
          'Add cautions where needed'
        ]
      },
      {
        question: 'Create a script for calling a landlord about a leaky faucet:\n',
        type: 'script_practice',
        expectedAnswer: 'Hi, this is [Your Name] from apartment 2B. I\'m calling about a leaky faucet in my bathroom that needs repair. It\'s been dripping constantly for the past two days. When would be a good time for maintenance to come take a look?',
        hints: [
          'Start with a proper introduction',
          'Clearly state the problem',
          'Be polite and professional'
        ]
      }
    ]
  }
];