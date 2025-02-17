import Hero from './components/Hero'
import Achievements from './components/Achievements'
import Contact from './components/contact'

export default function Home() {
  return (
    <main className='flex flex-col max-w-4xl gap-16 px-6 py-12'>
      <Hero />
      <Achievements />
      <Contact />
    </main>
  )
}
