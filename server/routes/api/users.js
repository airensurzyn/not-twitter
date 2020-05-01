const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.find({
		$or: [{ email: req.body.email }, { username: req.body.username }],
	}).then((user) => {
		if (user) {
			if (user.email === req.body.email) {
				return res.status(400).json({
					email: 'Email already exists',
				});
			} else {
				return res.status(400).json({
					username: 'Username already exists',
				});
			}
		} else {
			const newUser = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body);
	console.log(req.body.password);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const { email, password } = req.body;

	console.log(password);
	// Find user by email
	User.findOne({ email }).then((user) => {
		// Check if user exists
		if (!user) {
			return res.status(404).json({ emailnotfound: 'Email not found' });
		}
		// Check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// User matched
				// Create JWT Payload
				const payload = {
					id: user.id,
					name: user.name,
				};
				// Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926, // 1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token,
						});
					}
				);
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: 'Password incorrect' });
			}
		});
	});
});

router.get(
	'',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const userId = req.user.id;

			const user = await User.findById(userId);
			if (!user) {
				res.status(404).send({ id: `User with id ${userId} is not found` });
			} else {
				res.json({
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
				});
			}
		} catch (error) {
			console.log('Error getting user: ', error);
			res.status(500).send({ error: error });
		}
	}
);

module.exports = router;
