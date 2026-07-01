import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import DeletePopup from '../components/DeletePopup';
import '../styles/App.css';
import '../styles/Home.css';
import { useLogout } from '../hooks/useLogout';
import { useDelete } from '../hooks/useDelete';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { logout } = useLogout();
    const { Delete } = useDelete();

    const handleDeleteClick = () => {
        setShowDeletePopup(true);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
    };

    const handleDelete = async () => {
        await logout();
        await Delete(user.email);
        setShowDeletePopup(false);
    };

    return (
        <div className="home-container">
            <header className="hero">
                <div className="hero-overlay">
                    <h1 className="hero-title">Connect with Your Health</h1>
                    <p className="hero-subtitle">Your path to a healthier lifestyle starts here</p>
                    {!user && <Link to="/login" className="login-btn font-bold px-6 py-3">Login</Link>}
                </div>
            </header>
            <div className='flex flex-col justify-center items-center'>
                <div className='font-extrabold text-4xl mt-11'>OUR SERVICES</div>
                <section className="services p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="service-item">
                        <h2>Nutrition Analyzer</h2>
                        <p>Nutrients in the food that you have had.</p>
                        <Link to="/nutrisearch" className="service-link">Learn More</Link>
                    </div>
                    <div className="service-item">
                        <h2>Nearby Hospitals</h2>
                        <p>Discover Nearby Hospitals.</p>
                        <Link to="/genquery" className="service-link">Explore</Link>
                    </div>
                    <div className="service-item">
                        <h2>Appointment Booking</h2>
                        <p>Book online appointment with a Specialist Doctor</p>
                        <Link to="/bookappoint" className="service-link">Book Now</Link>
                    </div>
                    <div className="service-item">
                        <h2>Blogs</h2>
                        <p>Read blogs by renowned doctors and experts on health</p>
                        <Link to="/blogs" className="service-link">Read Now</Link>
                    </div>
                    <div className="service-item">
                        <h2>Symptom Checker</h2>
                        <p>Diagnose yourself just by filling a simple form</p>
                        <Link to="/symptom" className="service-link">Check Symptoms</Link>
                    </div>
                    <div className="service-item">
                        <h2>BMI Calculator</h2>
                        <p>Calculate your BMI and see how healthy you are.</p>
                        <Link to="/bmi" className="service-link">Calculate</Link>
                    </div>
                </section>
            </div>

            <footer className="footer">
                <div className="footer-about text-center">
                    <h3 className='text-center'>About Us</h3>
                    <p className='text-center'>Looking Forward to see Healthier India....</p>
                    <Link to="/about">Read More...</Link>
                </div>
                <div className="footer-services">
                    <h3 className='text-center'>Services</h3>
                    <ul className='text-center'>
                        <li><Link to="/bookappoint">Appointment Booking</Link></li>
                        <li><Link to="/blogs">Blogs</Link></li>
                        <li><Link to="/genquery">Nearest Hospitals</Link></li>
                        <li><Link to="/nutrisearch">Nutrition Content</Link></li>
                        <li><Link to="/symptom">Symptom Checker</Link></li>
                        <li><Link to="/bmi">BMI Calculator</Link></li>
                    </ul>
                </div>
                <div className="footer-contact text-center">
                    <h3>Delete Account</h3>
                    <button className='cursor-pointer text-[#4caf50]' onClick={handleDeleteClick}>Delete Account</button>
                    {showDeletePopup && <DeletePopup handleDelete={handleDelete} handleClosePopup={handleClosePopup} />}
                </div>

            </footer>
        </div>
    );
}

export default Home;
