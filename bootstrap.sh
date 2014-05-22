#!/usr/bin/env bash

# Install updates and other needs
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install software-properties-common -y

#Install node.JS
sudo apt-get install python-software-properties python g++ make -y
sudo add-apt-repository ppa:chris-lea/node.js -y
sudo apt-get update -y
sudo apt-get install nodejs -y
sudo npm config set registry http://registry.npmjs.org/

# Install Jekyll
sudo apt-get update && sudo apt-get -y install build-essential git ruby1.9.3 && sudo gem install github-pages --no-ri --no-rdoc

# Install Git
sudo apt-get install -y git

# Install apache
sudo apt-get install -y apache2

sudo apt-get update -y

# Install Gulp.JS and Gulp's plugins
sudo npm install gulp -g && cd /vagrant
sudo npm install gulp --save-dev
sudo npm install gulp-util --save-dev
sudo npm install gulp-coffee --save-dev
sudo npm install gulp-sass --save-dev
sudo npm install gulp-uglify --save-dev
sudo npm install gulp-changed --save-dev
sudo npm install gulp-imagemin --save-dev
sudo npm install gulp-watch --save-dev
sudo npm install gulp-concat --save-dev
sudo npm install gulp-minify-html --save-dev
sudo npm install gulp-strip-debug --save-dev
sudo npm install gulp-autoprefixer --save-dev 
sudo npm install gulp-minify-css --save-dev
sudo npm install gulp-clean --save-dev
sudo npm install gulp-cache --save-dev
sudo npm install event-stream --save-dev
sudo npm install run-sequence --save-dev
sudo apt-get update -y

# Put all up
cd /vagrant && gulp build

# Link the _site folder with the apache root
sudo rm -rf /var/www
sudo ln -fs /vagrant/build/_site /var/www