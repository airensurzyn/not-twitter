import React, { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '../../Utils/api';

import AuthNUserContext from './AuthNUserContext';
import axios from 'axios';

const withAuthentication = (Component) => {
	const WithAuthentication = (props) => {
		const prevToken = window.localStorage.getItem('token') || null;

		const [token, setToken] = useState(prevToken);
		const [user, setUser] = useState(null);

		useEffect(() => {
			const getCurrentUser = async () => {
				if (token) {
					window.localStorage.setItem('token', token);
					axios.defaults.headers.common['Authorization'] = token;
					try {
						const loggedInUser = await getAuthenticatedUser();
						loggedInUser.data.profileImage =
							'http://localhost:3001/' + loggedInUser.data.profileImage;
						setUser(loggedInUser);
					} catch (error) {
						console.log(error);
					}
				}
			};
			getCurrentUser();
		}, [token]);

		const logout = () => {
			window.localStorage.removeItem('token');
			axios.defaults.headers.common['Authorization'] = null;
			setUser(null);
			setToken(null);
		};

		const authenticationContext = {
			token,
			setToken,
			user,
			logout,
		};

		return (
			<AuthNUserContext.Provider value={authenticationContext}>
				<Component {...props} />
			</AuthNUserContext.Provider>
		);
	};
	return WithAuthentication;
};

export default withAuthentication;
