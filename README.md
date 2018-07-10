# GitHub Web Launcher

Hacky installation instructions:

```
npm install

cd node_modules/webdriver-manager

npm install
npm run tsc

cd ../..

```

Fake in a global install by setting the path to the bin directory.

```
export PATH=$PATH:/path/to/github-web-launcher/bin
```



An example of using it:

```
# in the Protractor repo, protractor/lib/driverProviders/
web

# Downloads chromedriver with webdriver-manager
# Uses chromedriver to find the Chrome launch command from chrome://version
# Launches Chrome to the origin master for Protractor under the directory lib/driverProviders
# https://github.com/cnishina/tree/master/lib/driverProviders
```

## Roadmap

Support other remotes and branches:

```
web origin master
web upstream master
web origin fork-branch
```

Support launching files:

```
web README.md
web origin master README.md
web upstream master path/to/README.md
```
