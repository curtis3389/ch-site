build-js:
	npm install
	esbuild ./content/blog/mandelbrot/main.js --bundle --minify --sourcemap --outfile=content/blog/mandelbrot/bundle.js

build: build-js
	zola build

build-drafts: build-js
	zola build --drafts

deploy-local:
	cp -r ./public/* /var/www/localhost/html/

redeploy-local: build-drafts deploy-local
