// Mock the ThemeContext module
jest.mock('../../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'default',
    setTheme: jest.fn()
  }),
  ThemeProvider: ({ children }) => children
})); 