# 404-start
A custom homepage, for me.
Depends on Pywal, so make sure you have that installed. Better yet, install my fork of it.

## Setup
All configuration is done in the file `js/config.js`. 


Set the `Pywal` variable to the path where Pywal stores it's css colours on your system. This is usually `/home/<username>/.cache/wal/colors.css`. If no pywal colours exist, the sample colors `css/sample-colors.css` will be used as a fallback. I guess you could modify the sample colours on your own if you wished to not use pywal.

For `WeatherURL1` and `WeatherURL2`, adjust the coordinates in these URLs to match the locations of which you want weather info for. For example, throw in `40.7127,-74.0059` for New York City. 
Change `WeatherName1` and  `WeatherName2` to whatever name you want to display for the two forecasts. You'd probably want it to just be the name of the city/town, but you could do something like "Home" and "Work" instead.
`WeatherName1` goes with `WeatherURL1`, as you'd expect.

`fire-config`: Configure Firebase settings here. Create your own database at [Firebase](https://firebase.google.com/), and adjust all the values here to match your own database. Otherwise, you'll be seeing my own to-do list, and I doubt you care for that.

## Experimental New Tab Page (Chrome Extension)
I'm currently working on a Chrome extension that will make this start page your new tab page as well. This feature is still experimental. You've been warned.

In `js/config.js`, change the `ExtPath` variable to the path of `index.html`. This path is where the extension redirects the browser upon the creation of a new tab.

To enable the extension, perform the following steps:
- Head over to Chrome's extension settings page **chrome://extensions**.
- Enable "Developer Mode" with the toggle in the top-right corner.
- Hit the "Load Unpacked" button that appears.
- Choose the base directory of the homepage (the one containing `index.html`).
- Success! It should be working now.

## Example

[https://the404devs.github.io/404-start/](https://the404devs.github.io/404-start/)
