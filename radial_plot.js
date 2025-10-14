// radial_plot.js
const radialFnbSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Compact radial chart of the distribution of F&B Businesses",
  width: 700,
  height: 700,
  data: {
    // NOTE: removed "refs/heads" so the CSV loads correctly
    url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_fnb_points.csv",
    format: { type: "csv" }
  },
  title: {
    text: "Food & Beverage Businesses Sizes in Malaysia",
    subtitle: "Grouped by business size range (based on F&B registration points)",
    fontSize: 25,
    subtitleFontSize: 16,
    subtitleColor: "#5e5e5e",
    anchor: "middle",
    dy: -10
  },

  transform: [
    { calculate: "trim(datum.size)", as: "size_clean" },
    { filter: "datum.size_clean && datum.size_clean != '0'" },
    { aggregate: [{ op: "count", as: "business_count" }], groupby: ["size_clean"] }
  ],

  encoding: {
    theta: {
      field: "business_count",
      type: "quantitative",
      stack: true,
      title: "Number of Businesses"
    },
    radius: {
      field: "business_count",
      type: "quantitative",
      scale: { type: "sqrt", zero: true, rangeMin: 100, rangeMax: 280 },
      title: "Relative Size"
    },
    color: {
      field: "size_clean",
      type: "nominal",
      title: "Business Size Range",
      scale: { scheme: "pastel2" },
      sort: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000"],
      legend: {
        orient: "top-right",
        direction: "vertical",
        columns: 1,
        titleFontSize: 12,
        labelFontSize: 11,
        symbolSize: 70,
        symbolType: "circle",
        padding: 4
      }
    },
    opacity: {
      condition: { param: "sizeSelect", value: 1 },
      value: 0.3
    },
    tooltip: [
      { field: "size_clean", title: "Size range" },
      { field: "business_count", title: "Businesses" }
    ]
  },

  params: [
    {
      name: "sizeSelect",
      select: { type: "point", fields: ["size_clean"] },
      bind: "legend"
    }
  ],

  mark: { type: "arc", innerRadius: 100, stroke: "#fff", opacity: 0.95 },

  config: {
    view: { stroke: null },
    background: "white",
    legend: { titleFontSize: 12, labelFontSize: 11 }
  }
};

// Mount it into a div with id="radial_fnb"
vegaEmbed("#radial_fnb", radialFnbSpec, { actions: false }).catch(console.error);
