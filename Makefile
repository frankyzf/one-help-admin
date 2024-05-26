# Self documented Makefile
# http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html

.PHONY: all
all:  builduat uploaduat

build:
	yarn run build


devlocal:
	yarn run dev:local
devcloud:
	yarn run dev:cloud

uatlocal:
	yarn run uat:local
uatcloud:
	yarn run uat:cloud

stagelocal:
	yarn run stage:local
stagecloud:
	yarn run stage:cloud
prodlocal:
	yarn run prod:local

prodcloud:
	yarn run prod:cloud




uploaddevlocal:
	scp -r dist/* work-gw:/var/www/dist-one-help-admin

uploaduatlocal:
	scp -r dist/* work-gw:/var/www/dist-one-help-admin

uploadstagelocal:
	scp -r dist/* work-gw:/var/www/dist-one-help-admin

uploadprodlocal:
	scp -r dist/* work-gw:/var/www/dist-one-help-admin










