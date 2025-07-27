import { useAppStore } from './store/appStore'
import FreePlay from './features/FreePlay'
// import PopRace from './features/PopRace'
// import MemoryPop from './features/MemoryPop'
// import AlphabetPop from './features/AlphabetPop'

function App() {
  const currentMode = useAppStore((state) => state.currentMode)

  const renderCurrentMode = () => {
    switch (currentMode) {
      case 'freePlay':
        return <FreePlay />
      // case 'popRace':
      //   return <PopRace />
      // case 'memoryPop':
      //   return <MemoryPop />
      // case 'alphabetPop':
      //   return <AlphabetPop />
      default:
        return <FreePlay />
    }
  }

  return (
    <>
      {/* Some main layout could go here, like a header or settings menu */}
      {renderCurrentMode()}
    </>
  )
}

export default App
