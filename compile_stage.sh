#!/bin/bash
git pull
yarn install
make stagecloud;
make uploadstagecloud;
