
import { useAuth0 } from "@auth0/auth0-react";

const LoginModule = () => {
    const { loginWithRedirect } = useAuth0();

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

            <label htmlFor="psw"><b>Password</b></label>
            <input
                className="input-field"
                type="password"
                placeholder="Enter Password"
                name="psw"
                maxLength={20}
                required
            />

            <div className="flex mt-10">

                <div className="w-1/2">
                    {/* <button className="p-4 mx-auto modal-content-button">Login</button> */}
                    <button
                        className="p-4 mx-auto modal-content-button"
                        onClick={() => loginWithRedirect()}
                    >
                        Log In
                    </button>
                </div>
                <div className="w-1/2">
                    <button className="p-4 mx-auto modal-content-button">Create Account</button>
                </div>
            </div>
        </div>

    );
}

export default LoginModule;

/*
certificate to put in heroku app
{"type": "RS512", "key": "-----BEGIN CERTIFICATE-----\nMIIDDTCCAfWgAwIBAgIJR5FXORDkORe4MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV\nBAMTGWRldi11dm5pcjlrby51cy5hdXRoMC5jb20wHhcNMjIwMjE5MTAyNzA0WhcN\nMzUxMDI5MTAyNzA0WjAkMSIwIAYDVQQDExlkZXYtdXZuaXI5a28udXMuYXV0aDAu\nY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArG0b3FeWhcmsVKBF\nrgtv4PDX/ODqoo+h8UEHaIy0kj+qVBOB/5x3JIaWNlMms+WcXpX3GJDWx80A4Hj4\nCbcqYaxI4GNnogaein2kHUyT1GyAU5jC0huqDKXvNgwjCUMlc3FnQ+fVVbHfJ7b5\nz15OH6/CiPRK3tbWtkuxhNjK0tvSC1/Ck/9ZYqbYgLljhnTo1tzu7g9gvdb3mQpL\nZMqFQ7/2+RtyXB8kNFW4oj1HzwlxjMuxNtUIkDSGCUXkxUEKM4XLKKmwnNx7MU3Y\nXwt7TzRGLIGYFn35foLsBvGu2LpRmXy9K+m8E81BkskeuO3ffN/Y590wpDguBPuO\nbN0ChQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBScD55WnO2E\nHDDC1PXTgihqolMZQDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB\nABUepfEt4TGbNY+DFUhwcIZZSZMVk5pzNHT3qsnGJyhKuw3qItqB7Cl3IdN/lumK\neyvvfnT6WtqKTUO2j1StbqZUSN23OXrEzlsV4dwpATbt3qkQM57AW3ZKIH2cGGnZ\nyvoYUtHwoRA6l+j1v6bFJ/CS8BMmwfQsv/yVjrpW2Nxo6cjGI6aQuAp4iS6hud6Q\nICmBRfeRx6y88Vb9AMB1JVRlH/fmNaiC1r6c0Z/RZfM+i9XP5ZOw7Qu6WCu33XD/\nlg6w0yYOBUwH9x2GuH9eHrMjOMCsnkNjk+yK3colM0Yb3QEHhEC6odgKiC5JeZlO\n6K2u3MiR26p+hdUMlE8/U98=\n-----END CERTIFICATE-----"}

*/