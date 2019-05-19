// Delay loading any function until the html dom has loaded. All functions are
// defined in this top level function to ensure private scope.
jQuery(document).ready(function () {

  // Installs error handling.
  jQuery.ajaxSetup({
  error: function(resp, e) {
    if (resp.status == 0){
      alert('You are offline!!\n Please Check Your Network.');
      } else if (resp.status == 404){
        alert('Requested URL not found.');
      } else if (resp.status == 500){
        alert('Internel Server Error:\n\t' + resp.responseText);
      } else if (e == 'parsererror') {
        alert('Error.\nParsing JSON Request failed.');
      } else if (e == 'timeout') {
        alert('Request timeout.');
      } else {
        alert('Unknown Error.\n' + resp.responseText);
      }
    }
  });  // error:function()


  var generate_btn = jQuery('#generate_btn');
  var sample_1_btn = jQuery('#sample_1_btn');
  var sample_2_btn = jQuery('#sample_2_btn');
  var sample_3_btn = jQuery('#sample_3_btn');
  var sample_4_btn = jQuery('#sample_4_btn');
  var sample_5_btn = jQuery('#sample_5_btn');
  var sample_6_btn = jQuery('#sample_6_btn');
  var buttonNumber = 1;

  var svg_div = jQuery('#graphviz_svg_div');
  var graphviz_data_textarea = jQuery('#graphviz_data');

  function InsertGraphvizText(text) {
    graphviz_data_textarea.val(text);
  }


  function UpdateGraphviz() {
    svg_div.html("");

    if (buttonNumber == 6){
      var data = TextParser(graphviz_data_textarea.val());
    }
    else {
      var data = graphviz_data_textarea.val();
    }

    // Generate the Visualization of the Graph into "svg".
    var svg = Viz(data, "svg");
    svg_div.html("<hr>"+svg);
  }

  // Startup function: call UpdateGraphviz
  jQuery(function() {
	// The buttons are disabled, enable them now that this script
	// has loaded.
    generate_btn.removeAttr("disabled")
                .text("Generate Graph!");

    sample_1_btn.removeAttr("disabled");
    sample_2_btn.removeAttr("disabled");
    sample_3_btn.removeAttr("disabled");
    sample_4_btn.removeAttr("disabled");
    sample_5_btn.removeAttr("disabled");
    sample_6_btn.removeAttr("disabled");
  });

  // Bind actions to form buttons.
  generate_btn.click(UpdateGraphviz);

  sample_1_btn.click(function(){
    buttonNumber = 1;
    InsertGraphvizText(jQuery("#sample1_text").html().trim());
  });

  sample_2_btn.click(function(){
    buttonNumber = 2;
    InsertGraphvizText(jQuery("#sample2_text").html().trim());
  });

  sample_3_btn.click(function(){
    buttonNumber = 3;
    InsertGraphvizText(jQuery("#sample3_text").html().trim());
  });

  sample_4_btn.click(function(){
    buttonNumber = 4;
    InsertGraphvizText(jQuery("#sample4_text").html().trim());
  });

  sample_5_btn.click(function(){
    buttonNumber = 5;
    InsertGraphvizText(jQuery("#sample5_text").html().trim());
  });

  function TextParser(text) {
    var tmpTxt = "digraph G {\n";
    var indent = 0;
    var last = [];
    var relation_array = [];

    var lines = text.split('\n');
    var line;
    for(var i = 0;i < lines.length;i++){
      var count = 0;
      //code here using lines[i] which will give you each line
      line = lines[i];
      while (line.startsWith("\t")){
        count += 1;
        line = line.slice(1);
      }
      if (count > indent){
        indent += 1;
        last.push(last[last.length - 1]);
      }
      else{
        if (count < indent){
          indent -= 1;
          last = last.slice(0, -1);
        }
      }
      
      line = line.trim().replace(/\"/g, '\\"');
      if (line.endsWith("?")){
        tmpTxt = tmpTxt + '"' + line + '" ' + '[shape=diamond]\n';
      }
      else if (line.endsWith(".")){
          tmpTxt = tmpTxt + '"' + line + '" ' + '[shape=ellipse]\n';
      }
      else{
        tmpTxt = tmpTxt + '"' + line + '" ' + '[shape=box]\n';
      }
    
      if (last.length > 0){
        var label = "";
        if (last[last.length - 1].endsWith("?")){
          if ((last.length > 1) && (last[last.length - 1] == last[last.length - 2]) ){
              label = ' [label="No"]';
            }
          else{
              label = ' [label="Yes"]';
            } 
          }
          tmpTxt = tmpTxt + '"' + last[last.length - 1] + '"' + ' -> ' + '"' + line + '"'  + label + '\n';
          relation_array.push('"' + last[last.length - 1] + '"' + ' -> ' + '"' + line + '"' + '\n');
        }
      last = last.slice(0, -1);
      last.push(line);
    }
    var graphviz_code_textarea = jQuery('#graphviz_code');
    graphviz_code_textarea.val(tmpTxt);
    tmpTxt += '}\n';
    console.log(relation_array);
    return tmpTxt;
  }

  sample_6_btn.click(function(){
    buttonNumber = 6;
    InsertGraphvizText((jQuery("#sample6_text").html().trim()));
  });

});
