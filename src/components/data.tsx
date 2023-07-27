const mockData = [
  {
    id: 1,
    name: 'Devchallenges board',
    isPrivate: true,
    image: 'https://source.unsplash.com/random?7',
    users: [
      { image: 'https://source.unsplash.com/random/?user?1', name: 'John Doe' },
      {
        image: 'https://source.unsplash.com/random/?user?2',
        name: 'Jane Smith',
      },
      { image: null, name: 'Alex Johnson' },
      { image: null, name: 'Alex Johnson' },
      { image: null, name: 'Alex Johnson' },
      { image: null, name: 'Alex Johnson' },
    ],
  },
  {
    id: 2,
    isPrivate: true,
    name: 'Another Board',
    image: 'https://source.unsplash.com/random?6',
    users: [
      {
        image: 'https://source.unsplash.com/random/?user?3',
        name: 'Michael Brown',
      },
      {
        image: 'https://source.unsplash.com/random/?user?84',
        name: 'Emily Adams',
      },
      {
        image: 'https://source.unsplash.com/random/?user?85',
        name: 'Emily Adams',
      },
      {
        image: 'https://source.unsplash.com/random/?user?82',
        name: 'Emily Adams',
      },
      {
        image: 'https://source.unsplash.com/random/?user?94',
        name: 'Emily Adams',
      },
      {
        image: 'https://source.unsplash.com/random/?user?04',
        name: 'Emily Adams',
      },
      {
        image: 'https://source.unsplash.com/random/?user?54',
        name: 'Emily Adams',
      },
      { image: null, name: 'Chris Wilson' },
    ],
  },
  {
    id: 3,
    name: 'Design Inspirations',
    image: 'https://source.unsplash.com/random?5',
    users: [
      {
        image: 'https://source.unsplash.com/random/?user?5',
        name: 'Sarah Clark',
      },
      {
        image: 'https://source.unsplash.com/random/?user?6',
        name: 'David Lee',
      },
      { image: null, name: 'Ava Martinez' },
    ],
  },
  {
    id: 4,
    name: 'Coding Tutorials',
    image: 'https://source.unsplash.com/random?4',
    users: [
      {
        image: 'https://source.unsplash.com/random/?user?7',
        name: 'Ryan Wright',
      },
      {
        image: 'https://source.unsplash.com/random/?user?8',
        name: 'Olivia Turner',
      },
      { image: null, name: 'Noah Hernandez' },
    ],
  },
  {
    id: 5,
    isPrivate: true,
    name: 'Travel Bucket List',
    image: 'https://source.unsplash.com/random?3',
    users: [
      {
        image: 'https://source.unsplash.com/random/?user?9',
        name: 'Liam Adams',
      },
      {
        image: 'https://source.unsplash.com/random/?user?10',
        name: 'Emma Wilson',
      },
      { image: null, name: 'James Brooks' },
    ],
  },
  {
    id: 6,
    name: 'Recipes to Try',
    image: 'https://source.unsplash.com/random?2',
    users: [
      {
        image: 'https://source.unsplash.com/random/?user?11',
        name: 'Sophia Carter',
      },
      {
        image: 'https://source.unsplash.com/random/?user?12',
        name: 'Matthew Reed',
      },
      { image: null, name: 'Ella Morgan' },
    ],
  },
  {
    id: 7,
    name: 'Fitness Goals',
    image: 'https://source.unsplash.com/random?1',
    users: [
      {
        image: 'https://source.unsplash.com/random/?user?13',
        name: 'Daniel Clark',
      },
      {
        image: 'https://source.unsplash.com/random/?user?14',
        name: 'Avery Roberts',
      },
      { image: null, name: 'Logan Smith' },
    ],
  },
]

// Define the User and Message interfaces
interface User {
  id: number
  image: string
  name: string
}

interface Message {
  user: User
  timestamp: string
  message: string
}

// Generate random image URL from Unsplash
function getRandomUnsplashImage(): string {
  return `https://source.unsplash.com/random/${Math.random() * 100}`
}

// Generate random timestamp
function getRandomTimestamp(): string {
  return new Date().toISOString()
}

//Generate list
const generateList = (_: unknown, index: number) => {
  // Generate random number for user ID
  const userId = index + 1

  // Create the user objects
  const users: User[] = [
    { id: userId, image: getRandomUnsplashImage(), name: 'User 1' },
    { id: userId + 1, image: getRandomUnsplashImage(), name: 'User 2' },
    { id: userId + 2, image: getRandomUnsplashImage(), name: 'User 3' },
  ]

  // Create the messages array
  const messages: Message[] = [
    {
      user: users[0],
      timestamp: getRandomTimestamp(),
      message: 'Hello, this is User 1!',
    },
    {
      user: users[1],
      timestamp: getRandomTimestamp(),
      message: 'Hey there, User 2 speaking!',
    },
    {
      user: users[2],
      timestamp: getRandomTimestamp(),
      message: "Hi, it's User 3 here!",
    },
  ]

  return {
    id: index + 1,
    image: getRandomUnsplashImage(),
    taskName: `Task ${index + 1}`,
    tags: ['technical', 'design'],
    users,
    messages,
  }
}

// Create the mockData array
const mockData1 = Array(2).fill(0).map(generateList)
const mockData2 = Array(5).fill(0).map(generateList)
const mockData3 = Array(3).fill(0).map(generateList)
const mockData4 = Array(1).fill(0).map(generateList)

export const mockDataArr = [mockData1, mockData2, mockData3, mockData4]

export default mockData
