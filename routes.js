
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('new_user')
})

router.get('/emotion/:id', (req, res) => {
  let id = req.params.id;
  let musicQuery = "SELECT `filename` FROM `music_files` ORDER BY RAND() LIMIT 10";
  db.query(musicQuery, (err, result) => {
	  res.render('emotion', {
					title: "Platform for Emotion Annotation",
					userid: id,
					musicfiles:result
	  });
  })
})


router.post('/add_user', (req, res) => {
	let name = req.body.name;
	let age = req.body.age;
	let gender = req.body.gender;
	let email = req.body.email;
	let ethinicity = req.body.ethinicity;
	let religion = req.body.religion;
	let music_knowledge = req.body.music_knowledge;

	let nameQuery = "SELECT * FROM `user` WHERE name = '" + name + "'";
	db.query(nameQuery, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		if (result.length > 0) {
			res.redirect('/');
			
		} else {
			let query = "INSERT INTO `user` (name, age, gender, email, ethnicity, religion, music_knowledge) VALUES ('" +
                            name + "', '" + age + "', '" + gender + "', '" + email + "', '" + ethinicity + "', '" + religion + "', '" + music_knowledge + "')";
			db.query(query, (err, result) => {
				if (err) {
					return res.status(500).send(err);
				}
				let query = 'SELECT id from `user` where name = "'+name+'"';
				
				db.query(query, (err, result) => {
					if (err) {
						res.redirect('/');
					}
					
					//res.redirect('/emotion/:'+result);
					else {
						//res.render('emotion', {
						//	title: "Platform for Emotion Annotation"
						//	,userid: result
						//});
						res.redirect('/emotion/'+result[0].id);
					}
				});
				
			});
		}
	})
  
})


router.post('/rest/emocat', (req, res) => {
	let tenderness = req.body.tenderness;
	let wonder = req.body.wonder;
	let nostalgia = req.body.nostalgia;
	let transcendence = req.body.transcendence;
	let power = req.body.power;
	let peacefulness = req.body.peacefulness;
	let tension_sadness = req.body.tension_sadness;
	let joy = req.body.joy;
	let userid = req.body.userid;
	let music = req.body.music;
	let query = "INSERT INTO `emotion_tracker`(`userid`, `music`, `tenderness`, `wonder`, `nostalgia`, `transcendence`, `power`, `peacefulness`, `tension_sadness`, `joy`) VALUES ('" +
                            userid + "', '" + music + "', '" + tenderness + "', '" + wonder + "', '" + nostalgia + "', '" + transcendence + "', '" 
		+ power + "', '" + peacefulness + "', '" + tension_sadness + "', '" + joy + "')";
	console.log('query == '+ query);
	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		
		return res.status(200).send();
	});
})


router.post('/rest/emocord', (req, res) => {

	let userid = req.body.userid;
	let music = req.body.music;
	let xcord = req.body.x;
	let ycord = req.body.y;
	let query = "INSERT INTO `emotion_tracker_coordinates`(`userid`, `music`, `xcord`, `ycord`) VALUES ('" +
                            userid + "', '" + music + "', '" + xcord + "', '" + ycord + "')";
	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		
		return res.status(200).send();
	});
})

module.exports = router
