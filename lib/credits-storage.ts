// Mock credits storage (in a real app, this would be in a database)
const userCredits: { [userId: string]: number } = {
  "550e8400-e29b-41d4-a716-446655440001": 10, // Default credits for test user
}

export const getCredits = (userId: string): number => {
  return userCredits[userId] || 0
}

export const updateCredits = (userId: string, amount: number): number => {
  if (!userCredits[userId]) {
    userCredits[userId] = 0
  }
  userCredits[userId] += amount
  return userCredits[userId]
}

export const deductCredit = (userId: string): number => {
  if (!userCredits[userId]) {
    userCredits[userId] = 0
  }
  if (userCredits[userId] > 0) {
    userCredits[userId] -= 1
  }
  return userCredits[userId]
}

export const setCredits = (userId: string, amount: number): number => {
  userCredits[userId] = amount
  return userCredits[userId]
}
