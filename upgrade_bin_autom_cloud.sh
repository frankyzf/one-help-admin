#!/bin/bash
date
if [ "$#" -ne 1 ]; then
    echo "usage: ./upgrade_bin.sh CLIENT; eg: ./upgrade_bin.sh aws-gw4"
    exit 0;
fi
server=$1
echo "machine is:$server"

echo "upgrading dist-autom-admin-prod"
scp -r dist/* ${server}:/var/www/dist-autom-admin-prod/
