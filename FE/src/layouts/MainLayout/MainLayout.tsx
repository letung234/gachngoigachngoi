import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface Props {
  children?: React.ReactNode
}

const Footer_ = memo(Footer)
const Header_ = memo(Header)

function MainLayoutInner({ children }: Props) {
  return (
    <div className='min-h-screen bg-cream-light'>
      <Header_ />
      <main className='flex flex-col min-h-[calc(100vh-64px)]'>
        {children}
        <Outlet />
      </main>
      <Footer_ />
    </div>
  )
}

const MainLayout = memo(MainLayoutInner)

export default MainLayout
