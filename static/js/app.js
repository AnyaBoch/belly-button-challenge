// 1 - Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.find(obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");
    

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    } else {
      panel.append("h6").text("No metadata available");
    }
  });
}

// 2 - function to build both charts
function buildCharts(sample) {
 d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
   let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.find(sampleObj => sampleObj.id == sample);

    if (!result) {
      console.error("No sample data found");
      return;
    }

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    // 2-1. Build a Bubble Chart
   let bubbleLayout = { 
    title: "Bacteria Cultures per Sample",
    xaxis: { title: "OTU ID" },
    yaxis: { title: 'Number of Bacteria'},
    hovermode: "closest"
   };

   let bubbleData = [{
     x: otu_ids,
     y: sample_values,
     text: otu_labels,
     mode: "markers",
     marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Cividis" ///This color scheme is for people with color blindness. One of many other color schemes
     }
    }];
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    //2-2 Building a Bar Chart
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
   let barData = [{
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h",
    marker: {
      color: sample_values.slice(0, 10), //setting gradient
      colorscale: "Greys",
    }
  }];

   let barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    xaxis: { title: "Number of Bacteria" },
   };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

//3- Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
   let names = data.names;
  
    // Use d3 to select the dropdown with id of `#selDataset`
   let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdownMenu.append("option")
      .text(name)
      .property("value", name);
    });

    // Get the first sample from the list
   let firstSample = names [0];



    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
   });
  }


// 4- Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

//5 - Initialize the dashboard
init();
