#!/bin/bash

# Simple bash script to recreate env for this repository
# Activate env by typing
#
# source ./v-env/bin/activate
#

set -e
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

rm -rf $SCRIPTPATH/v-env

python3 -m venv $SCRIPTPATH/v-env
. $SCRIPTPATH/v-env/bin/activate

pip3 install --compile \
Django==2.2.7 \
djangorestframework==3.10.3 \
pygments==2.5.2 \
django-rest-auth==0.9.5 \
djangorestframework_simplejwt==4.4.0 \
django-cors-headers==3.2.0 \
django-filter==2.2.0 \
coreapi==2.3.3
