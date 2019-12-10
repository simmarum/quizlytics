#!/bin/bash

set -e
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

. $SCRIPTPATH/v-env/bin/activate

cd $SCRIPTPATH/analytics

python manage.py runserver