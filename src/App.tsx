import { lazy, Suspense, useState } from 'react'
import './App.css'
import type { AppScreen, TossLine } from './types'
import { useLang } from './contexts/LangContext'
import StartScreen from './components/StartScreen'
import DivinationScreen from './components/DivinationScreen'

const ResultScreen = lazy(() => import('./components/ResultScreen'))

function App() {
  const [screen, setScreen] = useState<AppScreen>('start')
  const [tossLines, setTossLines] = useState<TossLine[] | null>(null)
  const { lang, toggleLang } = useLang()

  const handleComplete = (lines: TossLine[]) => {
    setTossLines(lines)
    setScreen('result')
  }

  const handleNewReading = () => {
    setTossLines(null)
    setScreen('start')
  }

  return (
    <div className="app">
      <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
        {lang === 'zh' ? 'EN' : '中文'}
      </button>

      {screen === 'start' && <StartScreen onStart={() => setScreen('divining')} />}
      {screen === 'divining' && (
        <DivinationScreen
          onComplete={handleComplete}
          onBack={() => setScreen('start')}
        />
      )}
      {screen === 'result' && tossLines && (
        <Suspense fallback={null}>
          <ResultScreen
            tossLines={tossLines}
            onNewReading={handleNewReading}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
