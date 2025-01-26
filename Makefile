
.PHONY: build make-content add-pages clean-all clean-build build-chrome build-firefox

build: clean-all build-all generate-firefox generate-chrome

build-chrome: build-all generate-chrome

build-firefox: build-all generate-firefox

build-all: clean-build make-content add-pages add-icons

generate-chrome: make-background-chrome
	- cp -r src/manifest-chrome.json dist/build/manifest.json
	- cd dist/build && zip -r ../chrome.zip .

generate-firefox: make-background-firefox
	- cp -r src/manifest-firefox.json dist/build/manifest.json
	- cd dist/build && zip -r ../firefox.zip .

make-background-firefox:
	- cp -r src/firefox_background.js dist/build/background.js

make-background-chrome:
	- cp src/chrome_background.js dist/build/background.js

make-content:
	- pnpm run build-content-scripted
	- pnpm run build-content

add-pages:
	- cp -r src/pages/ dist/build/

add-icons:
	- cp -r src/icons dist/build/icons

clean-all:
	- rm -rf dist
	- mkdir dist

clean-build:
	- rm -rf dist/build
	- mkdir dist/build