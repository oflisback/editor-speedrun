#!/bin/bash

if [ -z "$EDITOR" ]; then
  echo "Missing \$EDITOR value, try running e.g. \$EDITOR=vi $0"
  exit -1
fi


# Remove previous attempt folder, if any
rm -rf src
# Prepare a folder for the current attempt
cp -r before src
# Remove /src from .gitignore temporarily to not be ignored by some editors
sed -i '/\/src/d' .gitignore

# Tuck away before and after to not interfear with the attempt
mv before /tmp/
mv after /tmp/

SECONDS=0

# Start editor, let's go!
$EDITOR

SPENT_TIME=$SECONDS

# Bring back before and after
mv /tmp/before .
mv /tmp/after .
# Restore .gitignore to ignore /src
echo "/src" >> .gitignore

if [ "$(diff -r src after)" != "" ]; then
  echo "Your ./src dir is unfortunately not equal to the expected ./after dir."
  echo "Check the diff between ./src and ./after using your favorite diff tool to see why."
  exit
fi

timevalue=$(date +"%Y-%m-%d %H:%M:%S")
shortsha=$(git rev-parse --short HEAD)
echo "$shortsha $timevalue $SPENT_TIME seconds" >> ./times.txt
echo "Well done, your result: $SPENT_TIME seconds has been added to times.txt"
