import React from 'react';
import { Grid, makeStyles, Divider, Typography } from '@material-ui/core';
import colors from '../../../Styles/colors';

import BackgroundImage from './BackgroundImage';
import UserProfileDashboard from './UserProfileDashboard';

import TweetNavbar from './TweetNavbar';
import TweetList from './TweetList';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		width: '100%',
		borderRight: '1px solid #dddddd',
		backgroundColor: `${colors.white}`,
		overflow: 'auto',
	},
	mainColumn: {},
	profileTitle: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: '0 30px',
	},
	profileUsername: {
		fontWeight: 'bold',
		fontSize: '1.25rem',
	},
	profileDetail: {
		color: '#636363',
	},
	profileTweetsSection: {
		width: '100%',
	},
	usernameLabelTop: {
		fontSize: '1rem',
		fontWeight: 'bold',
	},
}));

const UserProfileMain = (props) => {
	const classes = useStyles();

	const {
		tweetList,
		currentProfile,
		backgroundImageFileUpload,
		profileImageUpload,
		profilePicture,
		backgroundImage,
		handleUserFollowRequest,
		handleUserUnfollowRequest,
	} = props;
	return (
		<Grid className={classes.root} container direction="row">
			<Grid className={classes.mainColumn} container direction="column">
				<div className={classes.profileTitle}>
					<Typography className={classes.usernameLabelTop}>
						{currentProfile.data ? currentProfile.data.username : 'Profile'}
					</Typography>
				</div>
				<Divider />
				<Grid container direction="column" className={classes.backgroundImage}>
					<BackgroundImage
						backgroundImageFileUpload={backgroundImageFileUpload}
						backgroundImage={backgroundImage}
						profileOwner={
							currentProfile.data ? currentProfile.data.username : ''
						}
					/>
				</Grid>
				<UserProfileDashboard
					profileOwner={currentProfile.data ? currentProfile.data : ''}
					profilePicture={profilePicture}
					profileImageUpload={profileImageUpload}
					handleUserFollowRequest={handleUserFollowRequest}
					handleUserUnfollowRequest={handleUserUnfollowRequest}
				/>
				{currentProfile.data ? (
					<Grid container className={classes.profileTweetsNavbar}>
						<TweetNavbar tweetNavbarTabs={props.tweetNavbarTabs} />
					</Grid>
				) : (
					<div></div>
				)}

				<Grid container direction="row">
					<Grid item className={classes.profileTweetsSection}>
						<TweetList
							profileOwner={
								currentProfile.data ? currentProfile.data.username : ''
							}
							profilePicture={profilePicture}
							tweetList={tweetList}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default UserProfileMain;
