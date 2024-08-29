# Lyrix API

A node.js API that extract synced lyrics from Musixmatch through Spotify.
Check the source code on how it works, it is well commented/document lol.
Also do not hestitate to ask me any questions

## Contact

Message me on telegram
https://t.me/bluecat_softwares

Token Url
```
https://open.spotify.com/get_access_token?reason=transport&productType=web_player
```


Lyrics Url

```
https://spclient.wg.spotify.com/color-lyrics/v2/track/
```
## Endpoints

#### Search lyrics by Track ID
```
GET https://lyrix.vercel.app/getLyrics/{trackId}
````
This endpoint allows you to search for lyrics of a specific track using the Spotify Track ID.

#### Search lyrics by Artist Name and Track Name

```
GET https://lyrix.vercel.app/getLyricsByName/{artistName}/{trackName}?remix={true/false}

```

This endpoint allows you to search for lyrics of a specific track using the Artist Name and Track Name.

The `remix` query parameter is optional, if set to true it will only return official remix songs.
Example:
```
https://lyrix.vercel.app/getLyricsByName/Asake/Sungba?remix=true
```

This will return lyrics of the official remix of the song "Sungba" by Asake.
Example:

```
https://lyrix.vercel.app/getLyricsByName/Asake/Sungba
```
This will return lyrics of the original version of the song "Sungbaa" by Asake.
Example:
```
https://lyrix.vercel.app/getLyricsByName/Asake/Sungba
```
