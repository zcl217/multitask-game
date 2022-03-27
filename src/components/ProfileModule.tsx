import { useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { FETCH_USERNAMES_QUERY, UPDATE_USERNAME_MUTATION } from "../queries/queries";
import { ReactComponent as EditIcon } from '../assets/editIcon.svg';
import { ReactComponent as SaveIcon } from '../assets/saveIcon.svg';

interface ProfileModuleProps {
    initialUsername: string,
    highscore: number
}

const ProfileModule: React.FC<ProfileModuleProps> = (props) => {
    const { initialUsername, highscore } = props;
    const { user, logout } = useAuth0();
    const [username, setUsername] = useState(initialUsername);
    const [error, setError] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { loading: loadingFetchUsernames, data: usernameData, refetch } = useQuery(FETCH_USERNAMES_QUERY, {
        onError: (e) => { setError(e.message) },
        // this flag makes `loading` true when `refetch` is called
        notifyOnNetworkStatusChange: true,
    });
    // we need this effect because initialUsername is fetched from a query,
    // which takes time to reflect in the prop
    useEffect(() => {
        setUsername(initialUsername);
    }, [initialUsername]);
    const [updateUser] = useMutation(UPDATE_USERNAME_MUTATION, {
        onError: (e) => { setError(e.message) }
    });
    const handleFormChange = (event: React.FormEvent<HTMLInputElement>) => {
        setUsername(event.currentTarget.value);
    }
    const handleUsernameSave = async (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (event.type === 'keyup' && (event as React.KeyboardEvent).key !== 'Enter') return;
        if (user?.sub && !loadingFetchUsernames) {
            setError('');
            await refetch();
            const usernameList = usernameData.user.map((data: any) => data.username);
            if (!isUsernameValid(usernameList)) return;
            setError('');
            setIsEditingUsername(false);
            updateUser({
                variables: {
                    userId: user.sub,
                    newUsername: username
                }
            });
        }
    }
    const isUsernameValid = (usernameList: string[]) => {
        if (username === 'anonymous') return true;
        if (username.length === 0) {
            setError('Username cannot be empty');
            return false;
        }
        if (usernameList.includes(username)) {
            setError('That username is taken');
            return false;
        }
        return true;
    }
    const handleLogout = () => {
        setIsLoggingOut(true);
        logout();
    }

    return (
        <div className={`flex flex-col justify-around mb-16 h-full ${isLoggingOut ? 'pointer-events-none' : ''}`} >
            <h1 className="font-bold"> Profile </h1>
            <div className="flex flex-col">
                <div className={`flex justify-center items-center ${isEditingUsername ? 'flex-col' : 'flex-row'}`}>
                    <label htmlFor="user" className="h-10 mr-4"><b>Username: </b></label>
                    {isEditingUsername ?
                        <div className="flex flex-row justify-center w-full mt-4">
                            <input
                                className={`input-field ${isEditingUsername ? '' : 'h-10'}`}
                                value={username}
                                type="text"
                                placeholder="Enter Username"
                                name="user"
                                spellCheck="false"
                                maxLength={10}
                                onChange={handleFormChange}
                                onKeyUp={handleUsernameSave}
                                disabled={loadingFetchUsernames}
                                required
                            />
                            {loadingFetchUsernames ?
                                <span className="pointer-events-none lds-dual-ring" /> :
                                <SaveIcon
                                    className="w-10 h-10 mt-2 ml-2 cursor-pointer"
                                    onClick={handleUsernameSave}
                                />
                            }
                        </div> :
                        <div className="flex flex-row" onClick={() => setIsEditingUsername(true)}>
                            <div> {username} </div>
                            <EditIcon className="w-10 h-10 ml-4 cursor-pointer" />
                        </div>
                    }
                </div>
                <span className="text-red-500"> {error} </span>
            </div>
            <div className="flex flex-row justify-center">
                <b className="mr-4"> Current high score: {highscore} </b>
            </div>
            <div
                className={`flex justify-center mx-auto menu-button-round ${isLoggingOut ? '' : 'cursor-pointer'}`}
                onClick={handleLogout}
            > Logout </div>
        </div>
    );
}

export default ProfileModule;