const http = require('http');
const fs = require('fs');
const data = require('./top_2018_movies.json');

function allMovies(response){
    response.write('This is a list of the top 100 movies released in 2017/18:' + "\n");
    data.forEach(x => response.write(x.movie + "\n"));
    response.end();
}

function actionMovies(response){
    response.write('This is a list of action movies from 2017/2018 that grossed over 20 million dollars:' + "\n");
    for(i=0;i<data.length;i++){
        if(data[i].genre === "Action" && data[i].gross > 20000000){
            response.write(data[i].movie + "\n");
        }
    }
    response.end();   
};

function pg13Movies(response){
    response.write('This is a list of all PG-13 movies from 2017/2018 that sold between 1 and 5 million tickets:' + "\n");
    data.forEach(x => {if(x.mpaa === "PG-13" && x.tickets_sold <= 5000000 && x.tickets_sold >= 1000000){
            response.write(x.movie + "\n")
        }
    })
    response.end();
};

function distributorSort(response){
    data.sort(function(a,b){
        if(a.distributor < b.distributor) return -1;
        if(a.distributor > b.distributor) return 1;
        return 0;
    });
    response.write('This is a list of movies sorted by distributor:' + "\n" + "\n");
    data.forEach(x => response.write("Movie: " + x.movie + "    Distributor: " +x.distributor + "\n"));
    response.end();
}

let server = http.createServer(function(request, response){
    if(request.url === "/" && request.method == "GET"){
        fs.readFile('index.html', function(err, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            return response.end();
          });
    }else if(request.url === "/all_movies" && request.method == "GET"){
        allMovies(response);
    }else if(request.url === "/action" && request.method == "GET"){
        actionMovies(response);
    }else if(request.url === "/pg" && request.method == "GET"){
        pg13Movies(response);
    }else if(request.url === "/distributor" && request.method == "GET"){
        distributorSort(response);
    }else {
        console.log("Something went wrong");
        response.end("404 Error, the requested page does not exist.")
    }
});

server.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});