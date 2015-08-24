

<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<link rel="stylesheet" type="text/css" href="app.css">
<script src="app.js"></script>
</head>
<body>
	<select onchange="openPlayers()" id="teams" class="form-control" >
		<option value="">Select Team</option>
	</select>
	<select onchange="selectPlayerId()" id="players" class="form-control" placeholder=>
	<option value="">Select Player</option>
	</select>
	<input onclick="window.location.reload()" type="submit" value="Reset">
    <h2 id="player-name"></h2>
    <h4 id="next-fixture">Next fixture: </h4>
    <h4 id="ppg" ></h4>
    <h4 id="cost" ></h4>
</body>

</html>