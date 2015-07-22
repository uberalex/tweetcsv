// make dataset globally available
var dz;

// load dataset and create table
function load_dataset(csv) {
  
  var data =  
    d3.csv.parse(csv, function(d){
    return d.text.split(" ");
  });
  create_cloud(d3.merge(data));
}

function create_cloud(data){
    stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
'herself', 'i', 'it', 'its', 'it\'s','i\'m','itself', 'they', 'them', 'their', 'theirs', 'themselves',
'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', '_','-','|' ,'...', 'i\'ve','&amp;'];

data = data.filter(function(d){ return stopwords.indexOf(d.toLowerCase()) < 0;}); 
   count = {}
    data.forEach(function(d){
        count[d] = count[d] + 1 || 1;
    }); 

    topfifty = d3.entries(count).sort(function(a,b) { return (b.value - a.value); }).slice(0,50)

    var cloud = d3.select("#cloud").append("svg:svg")
                                   .attr("height", "750px")
                                   .attr("width", "750px");

    var color = d3.scale.category20();

    var scale = d3.scale.linear().range([40,140]).domain(d3.extent(topfifty, function(d){return d.value;}));

    var force = d3.layout.force()
                         .charge(-250)
                         .linkDistance(50)
                         .size([750, 750]);

    force.nodes(topfifty).start();

var node = cloud.selectAll(".node")
      .data(topfifty)
        .enter()
      .append("text")
      .text(function(d) {return d.key})
      .attr("font-size", function(d){ return scale(d.value) + "px";})
      .style("fill", function(i,d) { return color(d); })
      .call(force.drag);

node.append("title")
      .text(function(d) { return d.word; });


  force.on("tick", function() {
    node.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  });



}

// handle upload button
function upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();

  reader.onload = function(e) {
    var contents = e.target.result;
    callback(contents);
  };

  uploader.addEventListener("change", handleFiles, false);  

  function handleFiles() {
    d3.select("#table").text("loading...");
    var file = this.files[0];
    reader.readAsText(file);
  };
};
