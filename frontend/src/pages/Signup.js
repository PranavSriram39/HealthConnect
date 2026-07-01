import { useContext } from 'react';
import { genContext } from '../contexts/GeneralContext';
import SignupPage from '../components/SignupPage'

const Signup = () => {

    const {open} = useContext(genContext)

    return ( 
        <div className="h-screen max-h-screen bg-[url('https://i.ibb.co/tJkCLrK/16404766-v870-tang-37.png')] bg-cover -z-[100]">
            <div className="flex justify-center items-center h-[calc(100vh-118px)]">
                <div className={`overflow-y-auto h-full ${open? "w-[calc(100vw-224px)]":"w-screen"} duration-300`}>
                    <div className='flex justify-center items-center h-full'>
                        <SignupPage />
                    </div>
                </div>
            </div>


        </div>
     );
}
 
export default Signup;