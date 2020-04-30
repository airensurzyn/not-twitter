import React, { useState, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Login from './Login';
import Register from './Register';
import { registerUser, loginUser } from '../../Utils/api';

import AuthNUserContext from '../../Components/Session/AuthNUserContext';

const Landing = (props) => {
	const context = useContext(AuthNUserContext);

	const [loggedIn, setLoggedIn] = useState(context.token ? true : false);
	const [registerModalOpen, setRegisterModalOpen] = useState(true);
	const [registerFirstName, setRegisterFirstName] = useState('');
	const [registerLastName, setRegisterLastName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');

	const toggleRegisterModal = () => {
		console.log(registerModalOpen);
		setRegisterModalOpen(!registerModalOpen);
	};

	const registerNewUser = async () => {
		const userData = {
			firstName: registerFirstName,
			lastName: registerLastName,
			email: registerEmail,
			password: registerPassword,
			confirmPassword: registerConfirmPassword,
		};
		try {
			await registerUser(userData);
		} catch (error) {
			console.log(error);
		}
	};

	const handleLogIn = async () => {
		const loginData = {
			email: loginEmail,
			password: loginPassword,
		};
		try {
			let res = await loginUser(loginData);
			context.setToken(res.data.token);
			setLoggedIn(true);
			console.log('token should be set : ' + res.data.token);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Grid container direction="column" alignItems="center">
			<Switch>
				<Route path={['/register']}>
					<Register
						registerUser={registerNewUser}
						registerModalOpen={registerModalOpen}
						firstName={registerFirstName}
						setRegisterFirstName={setRegisterFirstName}
						lastName={registerLastName}
						setRegisterLastName={setRegisterLastName}
						setRegisterEmail={setRegisterEmail}
						email={registerEmail}
						password={registerPassword}
						setRegisterPassword={setRegisterPassword}
						confirmPassword={registerConfirmPassword}
						setRegisterConfirmPassword={setRegisterConfirmPassword}
						handleRegisterModalClose={toggleRegisterModal}
					/>
				</Route>
			</Switch>
			<Switch>
				<Route path={['/', '/login']}>
					<Login
						registerModalOpen={registerModalOpen}
						handleRegisterModalOpen={toggleRegisterModal}
						handleLogIn={handleLogIn}
						loginEmail={loginEmail}
						setLoginPassword={setLoginPassword}
						loginPassword={loginPassword}
						setLoginEmail={setLoginEmail}
						loggedIn={loggedIn}
					/>
				</Route>
			</Switch>
		</Grid>
	);
};

export default Landing;
