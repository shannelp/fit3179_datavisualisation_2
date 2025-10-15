// radial_chart.js
const radialFnbSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Compact radial chart of the distribution of 281 F&B Businesses",
  width: "container",
  height: 500,
  data: {
    url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_fnb_points.csv",
    format: { type: "csv" }
  },
  title: {
    text: "Sizes of Food & Beverage Businesses in Malaysia",
    subtitle: "Grouped by the size ranges of 281 businesses",
    fontSize: 25,
    subtitleFontSize: 16,
    subtitleColor: "#5e5e5e",
    anchor: "middle",
    dy: -10
  },

  transform: [
    { calculate: "trim(datum.size)", as: "size_clean" },
    { filter: "datum.size_clean && datum.size_clean != '0'" },
    {
      calculate:
        "replace(replace(replace(replace(replace(replace(replace(datum.size_clean, '501-1000', '501-1,000'), '1001-5000', '1,001-5,000'), '5001-10000', '5,001-10,000'), '201-500', '201-500'), '51-200', '51-200'), '11-50', '11-50'), '1-10', '1-10')",
      as: "size_label"
    },
    { aggregate: [{ op: "count", as: "business_count" }], groupby: ["size_label"] }
  ],

  encoding: {
    theta: { field: "business_count", type: "quantitative", stack: true, title: "Number of Businesses" },
    radius: {
      field: "business_count",
      type: "quantitative",
      scale: { type: "sqrt", zero: true, rangeMin: 100, rangeMax: 280 },
      title: "Relative Size"
    },
    color: {
      field: "size_label",
      type: "nominal",
      title: "Business Size Range",
      scale: {
        domain: ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001-10,000"],
        range: ["#F2F296","#E1D681","#C0AA89","#A98A8E","#8B6195","#74419B","#3C2054"]
      },
      sort: ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001-10,000"],
      legend: {
        orient: "top-left",
        direction: "vertical",
        columns: 1,
        titleFontSize: 12,
        labelFontSize: 11,
        symbolSize: 70,
        symbolType: "circle",
        padding: 30
      }
    },
    opacity: { condition: { param: "sizeSelect", value: 1 }, value: 0.3 },
    tooltip: [
      { field: "size_label", title: "Size Range" },
      { field: "business_count", title: "Businesses" }
    ]
  },

  params: [
    { name: "sizeSelect", select: { type: "point", fields: ["size_label"] }, bind: "legend" }
  ],

  mark: { type: "arc", innerRadius: 100, stroke: "#fff", opacity: 0.95 },

  config: { view: { stroke: null }, background: "white", legend: { titleFontSize: 12, labelFontSize: 11 } }
};

vegaEmbed("#radial_fnb", radialFnbSpec, { actions: false }).catch(console.error);
