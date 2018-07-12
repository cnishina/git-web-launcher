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

The result is https://github.com/cnishina/protractor/tree/master/lib/driverProviders

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

Command line support for:
```
web <file> <remote> <branch>
```

View README.md in the default origin master:
```
web README.md
```

View a file or folder relative to the current directory assuming it is in the repository. In the following example, the current folder is `lib`.
```
web ../some/path/to/file_or_folder_1 
// github path = lib/some/path/to/file_or_folder_1

web some/path/to/file_or_folder_2
// github path = lib/some/path/to/file_or_folder_2
```

View a file or folder from the base of the repo, independent of where you are located in the repo.
```
web /some/path/to/file_or_folder
```

View the current directory for the upstream remote on a default master branch.
```
web . upstream
```

View the usptream remote and branch foobar
```
web <file_or_folder> upstream foobar
```