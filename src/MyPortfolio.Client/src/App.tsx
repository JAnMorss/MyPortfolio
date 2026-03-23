import Header from './components/header/Header'
import SidebarProfile from './components/sidebarProfile/sidebarProfile'

function App() {
  return (
    <>
        <div className="min-h-screen bg-white text-black dark:bg-[#212830] dark:text-white">
          <Header />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-[296px]">
                <SidebarProfile />
              </div>

            </div>
          </div>
        </div>

      
      
    </>
  )
}

export default App
