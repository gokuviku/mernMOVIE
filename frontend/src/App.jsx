import { Outlet } from "react-router"
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Navigation from "./pages/Auth/Navigation"

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Navigation/>
    <main className="py-3">
    <Outlet/>
    </main>
   </>
  )
}
{/* <div className='text-3xl font-bold underline text-teal-200'>App</div> */}


export default App