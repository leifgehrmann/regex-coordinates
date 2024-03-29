# Regex-Coordinates

[![Build Status](https://github.com/leifgehrmann/regex-coordinates/workflows/Tests/badge.svg?branch=master)](https://github.com/leifgehrmann/regex-coordinates/actions)
[![Code Coverage](https://codecov.io/gh/leifgehrmann/regex-coordinates/branch/master/graph/badge.svg)](https://codecov.io/gh/leifgehrmann/regex-coordinates)

A single-page web application to parse text as coordinate data and
output coordinate data as GeoJSON.

Visit https://regex-coordinates.leifgehrmann.com/ to see it live.

It solves a common use-case where one has a bunch of poorly structure CSV or
database table output and one wants to simply display it quickly on a map.

After generating the GeoJSON output, one can copy and paste it into
http://geojson.io/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
