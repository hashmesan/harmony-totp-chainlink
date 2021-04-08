clean:
	rm -rf $(package)/dist

deps: clean
	yarn --frozen-lockfile --production

build:
	yarn ncc build $(package) -o $(package)/dist

zip: deps build
	(cd $(package)/dist && zip  $(package).zip index.js)
