// state_filter_map.js
const malaysiaFnbStateMap = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  width: 810,
  height: 600,
  projection: { type: "mercator", center: [109.4, 4], scale: 2300, translate: [410, 285] },

  // Keep point colors independent from any geoshape coloring
  resolve: { scale: { color: "independent" } },

  /* Dropdown to filter by state; "all" shows everything */
  params: [
    {
      name: "stateParam",
      value: "all",
      bind: {
        input: "select",
        name: "Select state: ",
        options: [
          "all",
          "johor",
          "kedah",
          "kelantan",
          "kuala lumpur",
          "labuan",
          "melaka",
          "negeri sembilan",
          "pahang",
          "perak",
          "pulau pinang",
          "sabah",
          "sarawak",
          "selangor",
          "terengganu"
        ],
        labels: [
          "All states",
          "Johor",
          "Kedah",
          "Kelantan",
          "Kuala Lumpur",
          "Labuan",
          "Melaka",
          "Negeri Sembilan",
          "Pahang",
          "Perak",
          "Pulau Pinang",
          "Sabah",
          "Sarawak",
          "Selangor",
          "Terengganu"
        ]
      }
    }
  ],

  layer: [
    /* Graticule background */
    {
      data: { graticule: { extent: [[8, -5], [135, 15]], step: [3, 3] } },
      mark: { type: "geoshape", stroke: "#ddebf1", fill: null }
    },

    /* Neighbouring countries */
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_neighbouring_countries.json",
        format: { type: "json" }
      },
      mark: { type: "geoshape", stroke: "#D3D3D3", fill: null },
      encoding: { tooltip: [{ field: "name", title: "Country" }] }
    },

    /* Malaysia outline */
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia.geojson",
        format: { type: "json", property: "features" }
      },
      mark: { type: "geoshape", fill: "none", stroke: "#1b211d" }
    },

    /* Points */
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_fnb_points.csv",
        format: {
          type: "csv",
          parse: {
            longitude: "number",
            latitude: "number",
            region: "string",
            locality: "string",
            name: "string",
            website: "string"
          }
        }
      },
      transform: [
        { filter: "isValid(datum.longitude) && isValid(datum.latitude)" },
        {
          calculate:
            "indexof(['sabah','sarawak','labuan'], lower(datum.region)) >= 0 ? 'East Malaysia' : 'West Malaysia'",
          as: "zone"
        },
        { filter: "stateParam == 'all' || lower(datum.region) == stateParam" }
      ],
      mark: { type: "circle", stroke: "#00000033", strokeWidth: 0.3, opacity: 0.2 },
      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude: { field: "latitude", type: "quantitative" },
        size: { value: 60 },

        /* Color rule:
           - When a specific state is selected via dropdown -> all points are green
           - When "All states" -> East/West palette with non-interactive legend */
        color: {
          condition: { test: "stateParam != 'all'", value: "#28a745" },
          field: "zone",
          type: "nominal",
          title: "Area",
          scale: { range: ["#7bdff2", "#f78ecf"] },
          legend: {
            title: "Area",
            orient: "right",
            values: ["West Malaysia", "East Malaysia"]
          }
        },

        tooltip: [
          { field: "name", title: "Business" },
          { field: "locality", title: "Locality" },
          { field: "region", title: "Region" }
        ]
      }
    }
  ]
};

vegaEmbed("#fnb_map", malaysiaFnbStateMap, { actions: false }).catch(console.error);
