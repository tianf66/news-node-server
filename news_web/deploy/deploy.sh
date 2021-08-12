#! /bin/bash
npm run build

scp -r ../dist/static/css/* static_front:/nh/resources/opfed/news/
scp -r ../dist/static/js/* static_front:/nh/resources/opfed/news/