build:
	zola build

build-drafts:
	zola build --drafts

deploy-local:
	cp -r ./public/* /var/www/localhost/html/

redeploy-local: build-drafts deploy-local
