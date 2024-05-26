#!/bin/bash
date
if [ "$#" -ne 1 ]; then
    echo "usage: ./upgrade_bin.sh CLIENT; eg: ./upgrade_bin.sh nuc-1"
    exit 0;
fi
nuc=$1
echo "machine is:$nuc"

echo "upgrading dist-autom-local"
scp -r dist/* ${nuc}:/var/www/dist-autom-local/
