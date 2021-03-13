# 404-Start
A custom homepage, with **pywal** integration and decent customizability (more soon).

## Setup (Normal)
Just set https://start.the404.nl/ as your homepage in your browser.

## Setup (Advanced)
This is the preferred method of using 404-Start if you want integration with **pywal**, since most modern browsers don't allow remote webpages to read local files, such as pywal's `colors.css`.

Head over to the [Releases page](https://github.com/the404devs/404-start/releases) and download the latest version (or just `git clone`).

Extract the .zip file to your preferred location, and open `index.html` in your browser. Once you set the URL of this page, you're all set!

For pywal integration: in `js/config.js`, you'll need to change the `Pywal` value to the path to `colors.css` on your system, typically this is `~/.cache/wal/colors.css`.

## Account Creation
Hit the cog icon in the top-right corner, and select *Register*. Insert an email and password and you're good to go!

## Experimental New Tab Page (Chrome Extension)
*Only supported when 404-Start is a local html file (advanced setup)*

I'm currently working on a Chrome extension that will make this start page your new tab page as well. This feature is still experimental. You've been warned.

In `js/config.js`, change the `ExtPath` variable to the path of `index.html` (You can just copy the url when on the homepage). This path is where the extension redirects the browser upon the creation of a new tab.

To enable the extension, perform the following steps:
- Head over to Chrome's extension settings page **chrome://extensions**.
- Enable "Developer Mode" with the toggle in the top-right corner.
- Hit the "Load Unpacked" button that appears.
- Choose the base directory of the homepage (the one containing `index.html`).
- Success! It should be working now.

## About Icons
You can now configure the links on the page, as well as the icons that go alongside them.
Since there is no documentation in the page on how to configure the icons, I'll do it here for now until I come up with a better solution.

You may either use an icon from [FontAwesome](https://fontawesome.com/icons/), and set the icon HTML to the provided snippet you'll find on FontAwesome, for example: 

`<i class="fab fa-google"></i>`

Alternatively, you can use your own image, and put in an HTML snippet like this: 

`<img src="img/r.png" class="imageicon">`

Change the `src` value to the path to your chosen image. Make sure you include the `imageicon` class, because that allows the page to filter the image to make it the correct colour. Custom image icons should be square in shape, and black with a transparent background. See the file `img/r.png` for an example.

## Example
https://start.the404.nl

## Changelog

### *1.0.0 (03/12/2021)*
------------------------
- After nearby 2 years, we've finally reached a full release!
- Remove old Firebase events db
- Added account-based Firestore db, stores all preferences and things per-user.
    - Since everything is now account-based, you can easily sync settings cross-device.
- Added new config modal box.
- The following things are now configurable:
    - Left-side links (icons, text, url)
    - Weather locations and display units
    - Toggle XKCD display on/off
    - Date/time formats
- Migrated to OpenWeather API, since DarkSky is being depreciated at the end of 2021.
- Still missing configurable colours, that will come soon™
- Code is very messy, will need lots of cleanup.

### *0.1.7 (08/07/2020)*
------------------------
- Force MM/DD/YY date in header.

### *0.1.6 (06/03/2020)*
------------------------
- Added missing changelog to README.
- Rewrote CSS to make it easier to navigate.
- Added fonts, since there's no way to guarantee they're installed on the user's system.
- Changed page title from 'Welcome' to '404-Start' for consistency.
- Added a tentative icon for this project.

### *0.1.5 (05/25/2020)*
------------------------
- Configuration process greatly simplified.
    - All config now done within `config.js`, instead of across multiple files.
    - README changed accordingly.
- Added experimental Chrome extension that will make 404-Start the new tab page.
    - See setup process in README
- Created local copies of external JS, improving load times as we no longer need to fetch JS from other sites.


### *0.1.4 (05/08/2020)*
------------------------
- Customizability changes.
    - Removed hardcoded values, streamlining customization
    - Added setup instructions to README
- Added sample colours. These are used as a fallback if no `pywal` colours exist.
- Minor fix to XKCD fetching.
- Plenty of little things from the past few months.

### *0.1.3 (10/05/2019)*
------------------------
- Removed redundant files.
- CSS changes.

### *0.1.2 (09/18/2019)*
------------------------
- Project moved to Github
- Minor tweaks.

### *0.1.1 (07/26/2019)*
-----------------------
- Added modal to display weather warnings, etc.
- Added XKCD viewer at the bottom, displaying the latest webcomic from xkcd.com

### *0.1.0 (03/26/2019)*
-----------------------
- Added todo list functionality using Firebase.
- Weather display CSS tweaked.

### *0.0.1 (03/18/2019)*
-----------------------
- Initial version
- Added weather display using DarkSky API and Skycons.






