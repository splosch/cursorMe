cursorMe
========

A web-tool to add a cursor to an image or screenshot.

Demo: http://splosch.github.io/cursorMe/
------

Based on HTML / Canvas / JS (jQuery + Kinetic.js)

There are lots of JS Libraries that aim to ease interaction with canvas, I choose Kinetic.js because of this article:
http://www.softr.li/blog/2012/06/20/which-html5-canvas-javascript-library-should-i-use

Uses jasmine & imagediff for unittesting
* http://jasmine.github.io/
* https://github.com/HumbleSoftware/js-imagediff/

Get it running
----------

* checkout this repo
* serve the files from a (local) fileserver (otherwise you cannot render the canvas due to same origin policy)
* I use node-static https://github.com/cloudhead/node-static
* run it, cursor it