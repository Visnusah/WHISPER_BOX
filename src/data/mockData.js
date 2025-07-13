export const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'test01',
    fullName: 'Test User',
    bio: 'Love sharing thoughts and ideas!',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isAdmin: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'admin@whisperbox.com',
    username: 'admin',
    fullName: 'Admin User',
    bio: 'Platform administrator',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isAdmin: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'adrien@example.com',
    username: 'adrien_shrestha',
    fullName: 'Adrien Shrestha',
    bio: 'Tech enthusiast and developer',
    profileImage: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isAdmin: false,
    createdAt: '2024-02-01T12:00:00Z'
  }
]

export const mockPosts = [
  {
    id: '1',
    title: 'Welcome to Whisper Box!',
    description: 'This is an amazing platform to share your thoughts and connect with like-minded people. Looking forward to great discussions!',
    hashtags: ['welcome', 'community', 'introduction'],
    author: mockUsers[0],
    createdAt: '2024-06-29T14:30:00Z',
    votes: 5,
    userVote: null,
    isSaved: false,
    comments: [
      {
        id: '1',
        text: 'Welcome to the community!',
        author: mockUsers[2],
        createdAt: '2024-06-29T15:00:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Save button not working, Comment started working also share button!',
    description: 'Everything is almost finished i wished Nihar and Sarjak did someone work too.',
    hashtags: ['development', 'progress', 'teamwork'],
    author: mockUsers[2],
    createdAt: '2024-06-29T16:00:00Z',
    votes: 2,
    userVote: null,
    isSaved: false,
    comments: [
      {
        id: '2',
        text: 'ok',
        author: mockUsers[0],
        createdAt: '2024-07-02T10:00:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'created',
    description: 'Just testing the create post functionality. It works perfectly!',
    hashtags: ['test', 'create'],
    author: mockUsers[0],
    createdAt: '2024-06-12T18:00:00Z',
    votes: 3,
    userVote: null,
    isSaved: false,
    comments: []
  },
  {
    id: '4',
    title: 'The Future of Web Development',
    description: 'React continues to evolve with new features and improvements. The component-based architecture makes building complex UIs much more manageable.',
    hashtags: ['react', 'webdev', 'future', 'javascript'],
    author: mockUsers[1],
    createdAt: '2024-07-01T09:15:00Z',
    votes: 12,
    userVote: null,
    isSaved: false,
    comments: [
      {
        id: '3',
        text: 'Totally agree! React has changed the game.',
        author: mockUsers[0],
        createdAt: '2024-07-01T10:30:00Z'
      },
      {
        id: '4',
        text: 'The hooks system is particularly powerful.',
        author: mockUsers[2],
        createdAt: '2024-07-01T11:45:00Z'
      }
    ]
  }
]