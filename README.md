# homepage
A custom homepage, for me.
Depends on Pywal, so make sure you have that installed. Better yet, install my fork of it.

## Setup

`css/style.css`: Line 2: adjust the path to match wherever `pywal` stores it's css colours on your system. This is usually `/home/<username>/.cache/wal/colors.css`. If no `wal` colours exist, the sample colors `css/sample-colors.css` will be used as a fallback. I guess you could modify the sample colours on your own if you wished to not use `pywal`


`js/firebase.js`: Lines 4-10: Create your own database at [Firebase](firebase.google.com), and adjust all the values here to match your own database. Otherwise, you'll be seeing my own to-do list, and I doubt you care for that.

`js/weather.js`: Lines 8-12: Adjust the coordinates in these URLs to match the locations of which you want weather info for. For example, throw in `40.7127,-74.0059` for New York City. On lines 11 & 12, set the name to show for the two weather info boxes. You'd probably want it to just be the name of the city/town, but you could do something like "Home" and "Work" instead.


A sample colour file is provided at `css/sample-colors.css`

## Example

[https://the404devs.github.io/404-start/](https://the404devs.github.io/404-start/)
