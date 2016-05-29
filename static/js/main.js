var chess = (function(){

    var requests = m.prop([]);

    function getRequests(){
        return requests;
    }

    window.setInterval(function(){
        m.request({method: "GET", url: "/list"}).then(requests);
        /*
        then(function(array){
            if(array.posts.length > 0){
                timer(timer()-1);
                if(timer() === 0){
                    timer(turnlength);
                    m.request({method: "GET", url: "/round"});
                }
            }
            return array;
        })
        */
    }, 1000);

    return {
        getRequests: getRequests
    };
})();

var RequestList = {
    controller: function(){
        this.requests = chess.getRequests();
    },
    view: function(ctrl){
        console.log(ctrl.requests());
        return m("div", [
            m("h1", {class: 'beurt'},ctrl.requests().move +" "+ ctrl.requests().timer+"s"),
            //m("div", (ctrl.requests().timer<60) ? "Nog " + ctrl.requests().timer + " seconden" : "stuur jouw zet!"),

            m("h2", "Laatste zetten: "),
            m("div", ctrl.requests().lastmoves.reverse().slice(0,5).map(function(move){
                return m("div", {class:"request"}, m("span", {class:"value"}, move.move+": "+move.post.value));
            })),

            m("h2", "Volgende zet: "),

            ctrl.requests().posts.map(function(data){
                return m("div", {class:"request"},[
                    m("span", {class:"value"}, data.value),
                    m("span", {class:"count"}, data.count)
                ]);
            })
        ]);
    }
};

m.module(document.getElementById("content"), RequestList);
