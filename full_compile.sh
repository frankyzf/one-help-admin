#!/bin/bash
cd $GOPATH/src/gitlab.com/tradingvision/autom/autom-admin
git pull
yarn install
make uatlocal;
make uploaduatlocal;
#make uploadstagetlocal;
make uatcloud;
make uploaduatcloud;
#make uploadstagecloud;
make uploadprodcloud;
