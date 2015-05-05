cursorMe
========

A web-tool to add a cursor to an image or screenshot.

Demo: http://splosch.github.io/cursorMe/
------

Based on HTML / Canvas / JS (jQuery + Kinetic.js)
* Kinetic.js is not under active development, still decided to use it since it easy to use

Uses jasmine & imagediff for unittesting
* http://jasmine.github.io/
* https://github.com/HumbleSoftware/js-imagediff/

"Build, Measure, Learn" development principle
* uses Event-based tracking of google analytics
* see how users behave
* which features are used to which degree
* are users able to get a image out of the tool

Get it running
----------

* checkout this repo
* serve the files from a (local) fileserver (otherwise you cannot render the canvas due to same origin policy)
* I use node-static https://github.com/cloudhead/node-static
* run it, cursor it