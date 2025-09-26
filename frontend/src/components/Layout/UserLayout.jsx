import { Outlet } from 'react-router-dom'
import Header from '../Common/Header.jsx'
import Footer from '../Common/Footer.jsx'


const UserLayout = () => {
  return (
    <>
    {/* header */}
      <Header />
      {/* Main content */}
     <main>
      <Outlet />
     </main>
      {/* Footer */}
      <Footer />
      
    </>
  )
}

export default UserLayout
