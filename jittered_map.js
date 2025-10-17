// state_filter_map.js
const malaysiaFnbStateMap = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "width": 810,
  "height": 500,
  "projection": { "type": "mercator", "center": [109.4, 4], "scale": 2300, "translate": [410, 285] },
  "resolve": { "scale": { "color": "independent" } },

  "params": [
    {
      "name": "stateParam",
      "value": "all",
      "bind": {
        "input": "select",
        "name": "Select state: ",
        "options": ["all", "johor", "kedah", "kelantan", "kuala lumpur", "labuan", "melaka", "negeri sembilan", "pahang", "perak", "pulau pinang", "sabah", "sarawak", "selangor", "terengganu"],
        "labels": ["All states", "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu"]
      }
    }
  ],

  "layer": [
    {
      "data": { "graticule": { "extent": [[8, -5], [135, 15]], "step": [3, 3] } },
      "mark": { "type": "geoshape", "stroke": "#ddebf1", "fill": null }
    },
    {
      "data": {
        "url": "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_neighbouring_countries.json",
        "format": { "type": "json" }
      },
      "mark": { "type": "geoshape", "stroke": "#D3D3D3", "fill": null },
      "encoding": { "tooltip": [{ "field": "name", "title": "Country" }] }
    },
    {
      "data": {
        "url": "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia.geojson",
        "format": { "type": "json", "property": "features" }
      },
      "mark": { "type": "geoshape", "fill": "none", "stroke": "#1b211d" }
    },
    {
      "data": {
        "url": "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_fnb_points.csv",
        "format": {
          "type": "csv",
          "parse": {
            "longitude": "number",
            "latitude": "number",
            "region": "string",
            "locality": "string",
            "name": "string",
            "website": "string"
          }
        }
      },
      "transform": [
        { "filter": "isValid(datum.longitude) && isValid(datum.latitude)" },
        {
          "calculate": "indexof(['sabah','sarawak','labuan'], lower(datum.region)) >= 0 ? 'East Malaysia' : 'West Malaysia'",
          "as": "zone"
        },
        { "filter": "stateParam == 'all' || lower(datum.region) == stateParam" }
      ],
      "mark": {
        "type": "circle",
        "stroke": "#00000033",
        "strokeWidth": 0.3,
        "opacity": 1
      },
      "encoding": {
        "longitude": { "field": "longitude", "type": "quantitative" },
        "latitude": { "field": "latitude", "type": "quantitative" },
        "size": { "value": 60 },
        "color": {
          "condition": {
            "test": "stateParam != 'all'",
            "value": "#c4cea1"
          },
          "field": "zone",
          "type": "nominal",
          "title": "Area",
          "scale": { "range": ["#f4978e", "#99c1de"] },
          "legend": {
            "title": "Area",
            "orient": "right",
            "values": ["West Malaysia", "East Malaysia"]
          }
        },
        "tooltip": [
          { "field": "name", "title": "Business" },
          { "field": "locality", "title": "Locality" },
          { "field": "region", "title": "Region" },
          { "field": "zone", "title": "Area" }
        ]
      }
    }
  ]
};

// Render
vegaEmbed("#fnb_map", malaysiaFnbStateMap, { actions: false }).catch(console.error);
