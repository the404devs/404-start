# 404-Start
A custom homepage, with [**pywal**](https://github.com/dylanaraps/pywal) integration and decent customizability (more soon).

[Setup (Normal)](#setup-normal)

[Setup (Advanced)](#setup-advanced)

[Account Creation](#account-creation)

[Experimental New Tab Page (Chrome Extension)](#experimental-new-tab-page-chrome-extension)

[About Icons](#about-icons)

[Changelog](#changelog)

![alt text](img/screen1.png "screenshot 1")

## Setup (Normal)
Just set https://start.the404.nl/ as your homepage in your browser.
Things you miss out on:
  - Automatic update checking
      - This is fine, since the online version is *always* up to date.
  - Pywal integration

## Setup (Advanced)
This is the preferred method of using 404-Start if you want integration with **pywal**, since most modern browsers don't allow remote webpages to read local files, such as pywal's `colors.css`.

Head over to the [Releases page](https://github.com/the404devs/404-start/releases) and download the latest version (or just `git clone`).

Extract the .zip file to your preferred location, and open `index.html` in your browser. Once you set the URL of this page, you're all set!

For pywal integration: in the Settings menu (top right), under 'Local Settings', check off `Use Pywal` to enable the feature and set the `Pywal CSS Path` value to the path to `colors.css` on your system, typically this is `/home/<user>/.cache/wal/colors.css`. Once you save your preferences, 404-Start will auto-load colours from pywal.

## Account Creation
Hit the cog icon in the top-right corner, and select *Register*. Insert an email and password and you're good to go!

## Experimental New Tab Page (Chrome Extension)
*Only supported when 404-Start is a local html file (advanced setup)*

I'm currently working on a Chrome extension that will make this start page your new tab page as well. This feature is still experimental. You've been warned.

In `js/config.js`, change the `ExtPath` variable to the path of `index.html` (You can just copy the url when on the homepage, the 'file://' prefix is required). This path is where the extension redirects the browser upon the creation of a new tab.

To enable the extension, perform the following steps:
- Head over to Chrome's extension settings page **chrome://extensions**.
- Enable "Developer Mode" with the toggle in the top-right corner.
- Hit the "Load Unpacked" button that appears.
- Choose the base directory of the homepage (the one containing `index.html`).
- Success! It should be working now.

- Once the extension is installed, you won't need to update it again, unless explicitly mentioned in the changelog.
- When you update 404-Start, you'll need to set the `ExtPath` variable again.

## About Icons
You can now configure the links on the page, as well as the icons that go alongside them.
Since there is no documentation in the page on how to configure the icons, I'll do it here for now until I come up with a better solution.

You may either use an icon from [FontAwesome](https://fontawesome.com/icons/), and set the icon HTML to the provided snippet you'll find on FontAwesome, for example: 

`<i class="fab fa-google"></i>`

Alternatively, you can use your own image, and put in an HTML snippet like this: 

`<img src="img/r.png" class="imageicon">`

Change the `src` value to the path to your chosen image. Make sure you include the `imageicon` class, because that allows the page to filter the image to make it the correct colour. Custom image icons should be square in shape, and black with a transparent background. See the file `img/r.png` for an example.


## Changelog

### *1.0.4 (04/26/2021)*
------------------------
- Fixed a long-standing bug with wind direction arrows pointing in the opposite direction of where they should be.
- Added hover text to buttons that don't have any text on them, like close buttons, etc.
- Added a button to refresh weather info.
- You can now press `Enter` in the password fields of the login & register forms to submit them.


### *1.0.3 (04/18/2021)*
------------------------
- Fixed a bug regarding the colour of the animated weather icons.
- Implemented the icon I made in 1.0.2, since I forgot.
- Made the path to the user's pywal css file configurable in the settings menu.
    - Honestly, I'm not sure why I didn't do this in the first place.
    - Some documentation changes to match this change.

### *1.0.2 (03/18/2021)*
------------------------
- Fixed bug where missing fields in the account db would break everything and prevent the page from loading correctly.
    - Missing fields are now given default values.
- Fixed very poorly coded event deletion (Thanks 2019 me).
- Login/Register forms now show error messages when something goes wrong, inputs are cleared when forms are closed.
- Slight cleanup of `js/weather.js`, much more to come.
- New icon, still not 100% happy with it.
- Link settings made a bit more user-friendly, config for only 1 link is shown at a time, dropdown allows user to choose which one is shown.
- Firestore rules fixed, only logged-in users can read/write, and only to the collection that matches their UUID.

### *1.0.1 (03/13/2021)*
------------------------
- 404-Start now (sort of) differentiates between online and local modes.
    - Additional settings are shown in local mode.
        - Toggle automatic update on/off
        - Button for manual update check
        - Toggle Pywal colours on/off (still need to set the path in `config.js`, for now)
    - Automatic update check on page load. This will probably get annoying, so in the future I should probably make it once per session.
- Added the ability to change UI colours.
    - Background colour: used for the background of all components
    - Foreground colour: used for text, borders, etc.
    - Highlight colour: used for buttons when hovered over
    - Header colour: used for the header with the time and date
- There are only 4 colours for now, but more may come in the future.
- Added ability to toggle inverting the colours of the XKCD comic, for dark themes.
- Some styling changes.
- Added more words to README setup instructions.

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






