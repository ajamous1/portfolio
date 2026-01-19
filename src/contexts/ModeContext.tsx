import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface ModeContextType {
  isDeveloper: boolean
  setIsDeveloper: (value: boolean) => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [isDeveloper, setIsDeveloper] = useState(true)

  useEffect(() => {
    document.body.setAttribute('data-mode', isDeveloper ? 'developer' : 'designer')
  }, [isDeveloper])

  return (
    <ModeContext.Provider value={{ isDeveloper, setIsDeveloper }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
