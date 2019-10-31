// collaboration github https://youtu.be/MnUd31TvBoU?t=284
// git pull origin master # merge changes to local
// git checkout -b index-html
// make changes and then
// git add . or git add file.php
// git commit -m "added some changes"
// warning: DO NOT MERGE FEATURES ON LOCAL (TO MASTER BRANCH)
// git push origin index-html
// then it will show the pull request ----------- button on github

// Merge - Confirm - and DELETE branch as been merged.

//If something has been forgotteg eg. missing images:
//Remeber to pull master branch before any new feature/branch created to make sure we are up to date.
// git checkout master && git pull origin master
// git checkout -b images-forgotten
// git add . && git commit -m "mychanges" && git push origin img-update

//SQUASH
// git merge --squash feature # merge all commits on to the one and merge with
// git commit -m "feature and master merged."
// git log

// git checkout master &&
// git pull &&
// make test &&
// git tag v$(node -p 'require("./package.json").version') &&
// git push v$(node -p 'require("./package.json").version')

// npm pack
// tar xf "flow-bin-$(node -p 'require("./package.json").version').tgz"
// cd package
// npm run verify

// git clone git@example.com:project-name.git
// git checkout -b $feature_name
// git commit -am "My feature is ready"
// git push origin $feature_name

// git submodule add git@github.com:whoshuu/cpr.git
// git submodule update --init --recursive

// # clone with submodules
// git clone --recurse-submodules -j8 git://github.com/foo/bar.git
// # or only submodules
// git submodule init
// git submodule update

// Remove from just added to the repo
// git rm -r --cached .

// merging - first we need to be on the branch we want to merge into eg. git checkout master
// git merge branchname

// FAST FORWARD - direct from previous branch..
// RECURSIVE STRATEGY - if the change was started before

// CONFLICT
// git checkout -b myfeature && git checkout master
// git add somechange.php
// git commit -m "some change"
// git checkout -b myfeature &same fi
// git add somechange.php (different change to the same file which was changed on branch by others)
// git commit -m "other change on feature"
// git checout master
// git merge feature-c <--- conflict
// <<<<<HEAD, >>>>>>myfeature will be added to the conflict file (chose how the file should look)
//
// add this change git add somechange.php
// git commit
// and then we just save a file (:wq on)
