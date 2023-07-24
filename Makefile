copy-assets:
	@mkdir -p ./build/src/templates/common/
	@mkdir -p ./build/src/templates/controller/
	@mkdir -p ./build/src/templates/data-source/
	@mkdir -p ./build/src/templates/entity/
	@mkdir -p ./build/src/templates/input/
	@mkdir -p ./build/src/templates/mapper/
	@mkdir -p ./build/src/templates/model/
	@mkdir -p ./build/src/templates/output/
	@mkdir -p ./build/src/templates/query-builder/
	@mkdir -p ./build/src/templates/repository/
	@mkdir -p ./build/src/templates/route/
	@mkdir -p ./build/src/templates/service/
	@mkdir -p ./build/src/templates/use-case/
	@cp -R ./src/templates/common/*.hbs ./build/src/templates/common/
	@cp -R ./src/templates/controller/*.hbs ./build/src/templates/controller/
	@cp -R ./src/templates/data-source/*.hbs ./build/src/templates/data-source/
	@cp -R ./src/templates/entity/*.hbs ./build/src/templates/entity/
	@cp -R ./src/templates/input/*.hbs ./build/src/templates/input/
	@cp -R ./src/templates/mapper/*.hbs ./build/src/templates/mapper/
	@cp -R ./src/templates/model/*.hbs ./build/src/templates/model/
	@cp -R ./src/templates/output/*.hbs ./build/src/templates/output/
	@cp -R ./src/templates/query-builder/*.hbs ./build/src/templates/query-builder/
	@cp -R ./src/templates/repository/*.hbs ./build/src/templates/repository/
	@cp -R ./src/templates/route/*.hbs ./build/src/templates/route/
	@cp -R ./src/templates/service/*.hbs ./build/src/templates/service/
	@cp -R ./src/templates/use-case/*.hbs ./build/src/templates/use-case/

build-mac: copy-assets
	@pkg ./build/src/aliengen.js --config pkg.json -t node18-macos-x64 -o ./bin/mac/aliengen

build-linux: copy-assets
	@pkg ./build/src/aliengen.js --config pkg.json -t node18-linux-x64 -o ./bin/linux/aliengen

build-win: copy-assets
	@pkg ./build/src/aliengen.js --config pkg.json -t node18-win-x64 -o ./bin/win/aliengen.exe

build-all: build-mac build-linux build-win