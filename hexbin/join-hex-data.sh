mapshaper \
 -i hex-grid.json \
 -join april-rejected-ballots-geocode-v3.json calc='n = count()' \
 -o hex-aggregated.json format=geojson force

 # run bash join-hex-data.sh