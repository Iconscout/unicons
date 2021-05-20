#!/bin/sh

set -e
set -x

if [ -z "$INPUT_PACKAGE_NAME" ]
then
  echo "Package name and version must be defined"
  return -1
fi

if [ $INPUT_DESTINATION_HEAD_BRANCH == "main" ] || [ $INPUT_DESTINATION_HEAD_BRANCH == "master"]
then
  echo "Destination head branch cannot be 'main' nor 'master'"
  return -1
fi

if [ -z "$INPUT_PULL_REQUEST_REVIEWERS" ]
then
  PULL_REQUEST_REVIEWERS=$INPUT_PULL_REQUEST_REVIEWERS
else
  PULL_REQUEST_REVIEWERS='-r '$INPUT_PULL_REQUEST_REVIEWERS
fi

CLONE_DIR=$(mktemp -d)

echo "Setting git variables"
export GITHUB_TOKEN=$API_TOKEN_GITHUB
git config --global user.email "$INPUT_USER_EMAIL"
git config --global user.name "$INPUT_USER_NAME"

echo "Cloning destination git repository"
git clone "https://$API_TOKEN_GITHUB@github.com/$INPUT_DESTINATION_REPO.git" "$CLONE_DIR"

echo "Copying contents to git repo"
mkdir -p $CLONE_DIR/
cd "$CLONE_DIR"

raw_version=`jq .version package.json`
version=`echo $raw_version | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
next_version=`echo $version | awk -F"." '{print $1 FS $2 FS}'`$((`echo $version | awk -F"." '{print $NF}'` + 1))
sed -i -e "s/\(version\":\).*/\1 \"^$next_version\",/" package.json
npm ci --progress=false && npm i @iconscout/unicons@latest

git checkout -b "release-$next_version"
echo "Adding git commit"
git add .
if git status | grep -q "Changes to be committed"
then
  git commit --message "Update from https://github.com/$GITHUB_REPOSITORY/commit/$GITHUB_SHA for package "
  echo "Pushing git commit"
  git push -u origin HEAD:"release-$next_version"
  echo "Creating a pull request"
  gh pr create -t "Release $next_version"
               -b "release-$next_version"\
               -B $INPUT_DESTINATION_BASE_BRANCH \
               -H "release-$next_version"\
                $PULL_REQUEST_REVIEWERS
else
  echo "No changes detected"
fi