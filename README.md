# GitHub Web Launcher

## Using Github Web Launcher

Install globally:
```
npm install -g github-web-launcher
```

In a git repo folder via command line:
```
web
```

Why just `web`, because its short and easy to remember.


## Example using GitHub Web Launcher

An example of using it:

In the terminal, in the protractor repository, under the folder path `protractor/lib/driverProviders/` typing in `web` by default will navigate to the origin master url on GitHub found in the `.git/config` and navigate to the folder `lib/driverProviders`.

The result is https://github.com/cnishina/tree/master/lib/driverProviders

The contents of the `.git/config` is as follows:
```
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = git@github.com:cnishina/protractor
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
[remote "upstream"]
	url = git@github.com:angular/protractor
	fetch = +refs/heads/*:refs/remotes/upstream/*
```

If this is the first time running it, it will download ChromeDriver, launch Chrome and navigate to `chrome://version`. It will parse the command line for Chrome and navigate to the url above.

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
