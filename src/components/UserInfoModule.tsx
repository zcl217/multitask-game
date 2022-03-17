
import { useAuth0 } from "@auth0/auth0-react";


const LoginModule = () => {
    const { loginWithRedirect } = useAuth0();
    const highScore = 5;

    return (
        <div className="flex flex-col justify-around mb-16 h-4/5">
            <label htmlFor="user"><b>Username</b></label>
            <input
                className="input-field"
                type="text"
                placeholder="Enter Username"
                name="user"
                maxLength={10}
                required
            />

            <b> Current high score: {highScore} </b>
        </div>

    );
}

export default LoginModule;
