var zip = new JSZip();

var loadViz = function(){
  loadData();
};

var dataCSV;

var loadData = function(){

    var zipFile = "story_liwc_author_tiny.csv"; // arquivo com 4K samples
    //var zipFile = "story_liwc_author.csv"; // arquivo com 130K samples
    JSZipUtils.getBinaryContent('http://henrique.gemeos.org/wheel-of-life/js/' + zipFile + '.zip', (err, dataLoad) => {
        if(err) {
            throw err;
        }

        JSZip.loadAsync(dataLoad)
            .then(zip => {

                  // descompacta arquivo csv
                  var content = zip.file(zipFile).async("string").then(content => {
                  dataCSV = d3.csv.parseRows(content);

                  //remove linha de cabeçalho
                  //console.log(dataCSV[0]);
                  dataCSV.splice(0,1);

                  // deixa somente 20 linhas para depuração
                  dataCSV.splice(2000, dataCSV.length)

                  //imprime os dados no console do browser
                  //console.log(dataCSV);

                  // remove "Loading..." e imprime o gráfico
                  $('#title').text("Visualization");
                  selectAuthors();
                  drawTimeSeries(0);//0 pq ao inicializar o valor selecionado será "All Authors"
                  redrawRadial(0);

                }
            )
        });
    });

};

var selectAuthors = () => { 
  var authorMap = new Map();
  authorMap.set("All Authors", "0");//adiciona opção para exibir todos os autores
  dataCSV.forEach(d => {
    authorMap.set(d[66],d[66])
  });

  authorMap.forEach( (key, value) => {   
       $('#authorID')
           .append($("<option></option>")
                      .attr("value",key)
                      .text(value)); 
  });

  //console.log(authorMap);

};

$( "#authorID" ).change( () => {
  var authorID = $('#authorID option:selected').val();
  drawTimeSeries(authorID);
  redrawRadial(authorID);
});
