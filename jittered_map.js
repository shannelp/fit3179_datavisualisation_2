// jittered_map.js
const malaysiaFnbMap = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",

  width: 810,
  height: 600,
  projection: { type: "mercator", center: [109.4, 4], scale: 2300, translate: [410, 285] }, // lock the map position

  // Keep point colors independent from any geoshape coloring
  resolve: { scale: { color: "independent" } },

  layer: [
    // --- Graticule background ---
    {
      data: { graticule: { extent: [[8, -5], [135, 15]], step: [3, 3] } },
      mark: { type: "geoshape", stroke: "#ddebf1", fill: null }
    },

    // --- Neighbouring countries ---
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_neighbouring_countries.json",
        format: { type: "json" }
      },
      mark: { type: "geoshape", stroke: "#D3D3D3", fill: null },
      encoding: {
        tooltip: [{ field: "name", title: "Country" }]
      }
    },

    // --- Malaysia outline ---
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia.geojson",
        format: { type: "json", property: "features" }
      },
      mark: { type: "geoshape", fill: "none", stroke: "#1b211d" }
    },

    // --- Points layer with legend-click highlight ---
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
        { filter: "isValid(datum.longitude) && isValid(datum.latitude)" }
      ],

      // Selection: click legend to highlight region
      params: [
        {
          name: "regionSelect",
          select: { type: "point", fields: ["region"] },
          bind: "legend"
        }
      ],

      mark: {
        type: "circle",
        stroke: "#00000033",
        strokeWidth: 0.3
      },

      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude: { field: "latitude", type: "quantitative" },
        size: { value: 60 },

        color: {
          field: "region",
          type: "nominal",
          title: "Region",
          scale: {
            range: [
              "#b28dff", "#f78ecf", "#d4a373", "#ee6055", "#86e7b8",
              "#dd7f5a", "#fcb373", "#7f7f7f", "#bcbd22", "#7bdff2",
              "#f2cd60", "#637939", "#a0ced9", "#ec698f"
            ]
          },
          legend: {
            title: "Region",
            orient: "right",
            columns: 1,
            labelExpr:
              "({'johor':'Johor','kedah':'Kedah','kelantan':'Kelantan','kuala lumpur':'Kuala Lumpur','labuan':'Labuan','melaka':'Melaka','negeri sembilan':'Negeri Sembilan','pahang':'Pahang','perak':'Perak','pulau pinang':'Pulau Pinang','sabah':'Sabah','sarawak':'Sarawak','selangor':'Selangor','terengganu':'Terengganu'})[datum.label] || datum.label"
          }
        },

        // Opacity control: highlight selected legend region, dim others
        opacity: {
          condition: { param: "regionSelect", value: 1 },
          value: 0.1
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

vegaEmbed("#fnb_map", malaysiaFnbMap, { actions: false }).catch(console.error);
