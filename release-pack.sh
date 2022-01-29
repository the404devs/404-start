#!/bin/bash

VER=$(cat ./VER)
FILENAME="404-Start_$VER.zip"
zip $FILENAME -r ./* -x "*.zip"
echo "Packed release $VER!"
