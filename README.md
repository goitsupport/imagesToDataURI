# imagesToDataURI
This project converts images in a directory to DATA URI in a css file

Install :

please run npm install in the source directory to make sure you have all dependencies for this project installed

Usage:

Create a folder inside the images folder for the project of images you want to convert.


run : node convert.js

you will get a selection of directories that resides in the images folder.

Enter the number matching your selection and then the program will first compress all images found in the folder

Then it will create a 
dataURI.css file containing all the images found in the compressed directory as dataURI

There is no limit to how many images the program can convert in one batch
