import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SignupForm from '../components/signup/SignupForm'
const Signup = () => {
    return (
        <div style={{minHeight: "100vh", display:"grid",  gridTemplateRows: "auto 1fr auto"}}>
            <Navbar />
            <SignupForm />
            <Footer/>
        </div>
    )
}

export default Signup
