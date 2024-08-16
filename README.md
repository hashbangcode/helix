# Brennan Helix Web App

**Note**: This project is not owned or endorsed by Brennan in any way.

A standalone proxy system that can connect to your Brennan Helix and provides
the same control of the API as the built-in applicatiom.

## Why?

This project is intended to showcase changes or improvements to the Helix web
application,

## PHP Router

If you have PHP installed you can use a simple PHP router to act as the proxy
between your browser and the Helix.

To use the PHP router run the following.

```
php -S localhost:8000 router.php
```

Load a web browser with the address http://localhost:8000 and you will see the 
Helix web app.

You can use the ./php_runme.sh bash script to run this command.

## API Docs

Here are the available endpoints for the Brennan Helix.

Always encode spaces into "%20" in your requests.

### Get Status

- **Path**: `/getStatus`
- **Arguments**: None.

Gets the current status of the player, firmware version, ip address, zones and
track information.

Example request:

```
curl "http://192.168.0.101/getStatus"
```

Example response, when playing a track from the SD card.

```json
{
	"version":	"Feb 29 2024 10:18:10",
	"zone":	        "Office",
	"ssid":	        "Wifi",
	"ip":	        "192.168.0.101",
	"update":       "",
	"SDMounted":    true,
	"Volume":	7,
	"Playing":	false,
	"Source":	"SD",
	"artFlag":	true,
	"artUrl":	"http://192.168.0.101/sdcard/music/Bones of Minerva/Embers/art.jpg",
	"cdReady":	false,
	"Artist":	"Bones of Minerva",
	"Album":	"Embers",
	"Track":	"06 Merula.wav",
	"zones":	["Wired", "Den", "Living Room", "Office"]
}
```

### Get Tracks

- **Path**: `/getTracks`
- **Arguments**: None.

Gets the track list from the currently inserted CD.

Example request: 

```
curl "http://192.168.0.101/getFiles?path=/sdcard/"
```

Response, from a CD with an unknown artist.

```json
["Track 1", "Track 2", "Track 3", "Track 4", "Track 5", "Track 6", "Track 7", "Track 8"]
```

### Get Files

- **Path**: `/getFiles`
- **Arguments**: `path` - The path to inspect. This should always be in
relation to the path "/sdcard".

Gets the file information from a given path.

Request to get the contents of the SD Card. 

```
curl "http://192.168.0.101/getFiles?path=/sdcard"
```

Response, the default directory for the SD card is "/sdcard", which produces 
the following.
```

[{
	"name":	"music",
	"type":	2
}]
```

Here, "music" is a directory (type 2).

Drilling into a directory with files will show the files (type 1).

For example the request

```
curl "http://192.168.0.101/getFiles?path=/sdcard/music/Bones%20of%20Minerva/Embers"
```

Will respond with:

```
[{
		"name":	"01 Forest.wav",
		"type":	1
	}, {
		"name":	"02 Swamp.wav",
		"type":	1
	}, 
	// Tracks removed for brevity...
	{
		"name":	"11 Hands.wav",
		"type":	1
	}, {
		"name":	"art.jpg",
		"type":	1
	}]
```

### Play File

- **Path**: `/playFile`
- **Arguments**: `path` - The path to the file or directory.

Play the file with the given path on the SD card. If a directory is given then
all files in that directory are played in order.

Request:

```
curl "http://192.168.0.101/playFile?path=/sdcard/music/Bones%20of%20Minerva/Embers/01%20Forest.wav"
```

This endpoint will always respond with "OK" and a 200 response code.

This will change the response of getStatus so that "playing" is "true".

### Events

- **Path**: `/Event`
- **Arguments**: `key` - The event action to perform.

The `key` value can be one of the following values.
- `eject` = Eject the CD tray.
- `back` = Play the previous track.
- `play` = Play the current track or stop the playback.
- `next` = Play the next track.

Example request to go to the next track.

```
curl "http://192.168.0.101/Event?key=next"
```

This endpoint will always respond with "OK" and a 200 response code.

### Set Volume

- **Path**: `/setVolume`
- **Arguments**: `volume` - The value to set the volume to. A value of 0 means 
that the volume is off. A value of 100 sets the volume to max.

```
curl "http://192.168.0.101/setVolume?volume=1"
```

This endpoint will always respond with "OK" and a 200 response code.

### Play Track

- **Path**: `/playTrack`
- **Arguments**: `track` - The number of the track to play.

This will play the designated track number from the CD. There are a couple of 
things to note:
- The tracks are numbered as a 0 index array. So a value of track 0 will play
the first track on the CD.
- If the value of track doesn't validate to a number then the first track is
played.

```
curl "http://192.168.0.101/playTrack?track=2"
```

This endpoint will always respond with "OK" and a 200 response code.

### Pick Zone

- **Path**: `/pickZone`
- **Arguments**: `zone` - The zone to select.

This sets the output zone that audio output will be sent to. A zone of 'Wired'
will always be available. A full list of the zones is available in the
`getStatus` request response.

Example request.

```
curl "http://192.168.0.101/pickZone?zone=Wired"
```

This endpoint will always respond with "OK" and a 200 response code.

### Get Generic Settings

- **Path**: `/getGenericSettings`
- **Arguments**: None.

Request to get the generic settings for the Helix.

```
curl "http://192.168.0.101/getGenericSettings"
```

This will result in the following response.

```
{
    "latency":
    {
        "value":    2000,
        "min":	    0,
        "max":	    10000,
        "step":	    100,
        "label":    "Buffer Length",
        "text":	    "Time in Milliseconds"
    }
}                          
```
