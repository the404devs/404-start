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
https://start.the404.nl

## Changelog
### *0.1.6 (06/03/20)*
----------------------
- Added missing changelog to README.
- Rewrote CSS to make it easier to navigate.
- Added fonts, since there's no way to guarantee they're installed on the user's system.
- Changed page title from 'Welcome' to '404-Start' for consistency.
- Added a tentative icon for this project.

### *0.1.5 (05/25/20)*
----------------------
- Configuration process greatly simplified.
    - All config now done within `config.js`, instead of across multiple files.
    - README changed accordingly.
- Added experimental Chrome extension that will make 404-Start the new tab page.
    - See setup process in README
- Created local copies of external JS, improving load times as we no longer need to fetch JS from other sites.


### *0.1.4 (05/08/20)*
----------------------
- Customizability changes.
    - Removed hardcoded values, streamlining customization
    - Added setup instructions to README
- Added sample colours. These are used as a fallback if no `pywal` colours exist.
- Minor fix to XKCD fetching.
- Plenty of little things from the past few months.

### *0.1.3 (10/05/19)*
----------------------
- Removed redundant files.
- CSS changes.

### *0.1.2 (09/18/19)*
----------------------
- Project moved to Github
- Minor tweaks.

### *0.1.1 (07/26/19)*
---------------------
- Added modal to display weather warnings, etc.
- Added XKCD viewer at the bottom, displaying the latest webcomic from xkcd.com

### *0.1.0 (03/26/19)*
---------------------
- Added todo list functionality using Firebase.
- Weather display CSS tweaked.

### *0.0.1 (03/18/19)*
---------------------
- Initial version
- Added weather display using DarkSky API and Skycons.






