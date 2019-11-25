#!/bin/bash

# Simple bash script to recreate env for this repository
# Activate env by typing
#
# source ./v-env/bin/activate
#

set -e
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

rm -rf $SCRIPTPATH/v-env
rm -rf $SCRIPTPATH/n-env
rm -rf $SCRIPTPATH/quizlytics/node_modules

python3 -m venv $SCRIPTPATH/v-env
. $SCRIPTPATH/v-env/bin/activate

pip3 install --compile \
nodeenv==1.3.3

. $SCRIPTPATH/v-env/bin/activate

nodeenv $SCRIPTPATH/n-env

. $SCRIPTPATH/n-env/bin/activate

cd $SCRIPTPATH/quizlytics/

npm install
