#!/bin/bash

set -e
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

. $SCRIPTPATH/v-env/bin/activate
. $SCRIPTPATH/n-env/bin/activate

cd $SCRIPTPATH/quizlytics

npm run build

npm run start -p 8000
