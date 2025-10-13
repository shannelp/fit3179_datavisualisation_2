// vegalite_map.js
const malaysiaFnbMap = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  title: {
    text: "Geographic Distribution of Food & Beverage Businesses in Malaysia",
    subtitle: "Mapping the locations of 281 F&B establishments across Malaysian regions",
    fontSize: 25,
    fontWeight: "bold",
    subtitleFontSize: 16,
    anchor: "middle",
    color: "#064587",
    subtitleColor: "#333333"
  },
  width: "container",
  height: 600,
  projection: { type: "mercator", center: [109.4, 4], scale: 2300 },

  // keep point colors independent from any geoshape coloring
  resolve: { scale: { color: "independent" } },

  layer: [
    {
      data: { graticule: { extent: [[8, -5], [135, 15]], step: [3, 3] } },
      mark: { type: "geoshape", stroke: "#ddebf1", fill: null }
    },
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/refs/heads/main/malaysia_neighbouring_countries.json",
        format: { type: "json" }
      },
      mark: { type: "geoshape", stroke: "#9e9e9e", fill: null },
      // no legend so it won't clash with point legend
      encoding: {
        tooltip: [{ field: "name", title: "Country" }]
      }
    },
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/refs/heads/main/malaysia.geojson",
        format: { type: "json", property: "features" }
      },
      mark: { type: "geoshape", fill: "none", stroke: "#1b211d" }
    },

    // Points layer (interactive legend)
    {
      data: {
        url: "https://raw.githubusercontent.com/shannelp/vegadata/refs/heads/main/malaysia_fnb_points.csv",
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
      params: [
        {
          name: "regionSelect",
          select: { type: "point", fields: ["region"], bind: "legend" }
        }
      ],
      mark: { type: "circle", opacity: 0.7, stroke: "#00000033", strokeWidth: 0.3 },
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
              "#b28dff",
              "#f78ecf",
              "#d4a373",
              "#ee6055",
              "#86e7b8",
              "#dd7f5a",
              "#fcb373",
              "#7f7f7f",
              "#bcbd22",
              "#7bdff2",
              "#f2cd60",
              "#637939",
              "#a0ced9",
              "#ec698f"
            ]
          },
          legend: { title: "Region", orient: "right", columns: 1 }
        },
        opacity: {
          condition: { param: "regionSelect", value: 0.9 },
          value: 0.15
        },
        tooltip: [
          { field: "name", title: "Business" },
          { field: "locality", title: "Locality" },
          { field: "region", title: "Region" },
        ]
      }
    }
  ]
};

vegaEmbed("#fnb_map", malaysiaFnbMap, { actions: false }).catch(console.error);
